import { PrismaClient } from '@prisma/client';
import nodeHtmlToImage from 'node-html-to-image';
import path from 'path';
import * as fs from 'fs/promises';
import { fileURLToPath } from 'url';

const prisma = new PrismaClient();

interface AssetGenerationResult {
    success: boolean;
    message: string;
    assetId?: string;
}

export class AssetGenerator {
    private calculateValidUntil(): Date {
        // Wird vom Benuzter angepasst, daher kann keine Voraussage getroffen werden. 
        const inFuture = new Date();
        inFuture.setFullYear(inFuture.getFullYear() + 255);

        return inFuture;
    }

    async generateAssets(): Promise<void> {
        // Warte 1 Sekunde
        await new Promise(resolve => setTimeout(resolve, 1000));

        try {
            // Find assets that will expire in the next 10 minutes
            const expiringAssets = await prisma.asset.findMany({
                where: {
                    datas: {
                        some: {
                            data: {
                                origin_worker: "JSON"
                            }
                        }
                    }
                },
                include: {
                    template: true,
                    datas: {
                        include: {
                            data: true
                        }
                    }
                }
            });

            for (const asset of expiringAssets) {
                await this.regenerateAsset(asset);
            }
        } catch (error) {
            console.error('Error during asset generation:', error);
            throw error;
        } finally {
            await prisma.$disconnect();
        }
    } 

    private async regenerateAsset(asset: any): Promise<AssetGenerationResult> {
        try {
            // Prepare handlebars data from related Data models
            const templateData = asset.datas.reduce((acc: any, dataOnAsset: any) => {
                const jsonData = dataOnAsset.data.json;
                return Array.isArray(acc) ? [...acc, ...jsonData] : jsonData;
            }, {});

            const validUntil = this.calculateValidUntil();

            const outputDate = Date.now();

            // Generate new filename while keeping the original asset ID
            const outputPath = path.join(
                process.cwd(),
                'public',
                'dynamic',
                `${asset.id}_${outputDate}.png`
            );

            const absoluteOutputPath = path.join(
                '../public',
                'dynamic',
                `${asset.id}_${outputDate}.png`
            );

            const databaseOutputPath = path.join(
                '/dynamic',
                `${asset.id}_${outputDate}.png`
            );

            // console.log(templateData);


            // Ensure directory exists
            await fs.mkdir(path.dirname(outputPath), { recursive: true });

            // Generate new image from HTML template
            await nodeHtmlToImage({
                output: outputPath,
                html: asset.template.html,
                content: templateData
            });
            // Try to delete old file if it exists
            if (asset.file_path) {
                try {
                    await fs.unlink('./public' + asset.file_path);
                } catch (error) {
                    console.warn(`Could not delete old file ${asset.file_path}:`, error);
                }
            }

            // Update existing asset record
            const updatedAsset = await prisma.asset.update({
                where: {
                    id: asset.id
                },
                data: {
                    file_path: databaseOutputPath,
                    valid_until: validUntil
                }
            });

            return {
                success: true,
                message: 'Asset updated successfully',
                assetId: updatedAsset.id
            };
        } catch (error) {
            console.error('Error regenerating asset:', error);
            return {
                success: false,
                message: `Failed to regenerate asset: ${error}`
            };
        }
    }
}

// Usage
export const generateAssets = async () => {
    const generator = new AssetGenerator();
    await generator.generateAssets();
};

// Überprüfen ob die Datei direkt ausgeführt wird
const isMainModule = import.meta.url === `file://${process.argv[1]}`;

if (isMainModule) {
    console.log('Starting asset generation...');
    generateAssets()
        .then((result) => {
            console.log('Asset generation completed successfully:');
            process.exit(0);
        })
        .catch(error => {
            console.error('Asset generation failed:', error);
            process.exit(1);
        })
}