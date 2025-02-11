import { PrismaClient, Asset, Template, Data, DatasOnAssets } from '@prisma/client';
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

interface LessonData {
    date: number;
    startTime: number;
    endTime: number;
    longname?: string;
    teacher?: string;
}

interface TemplateData {
    lessons?: LessonData[];
    [key: string]: any;
}

interface ScheduleItem extends LessonData {
    isBreak: boolean;
    height: number;
}

type AssetWithRelations = Asset & {
    template: Template | null;
    datas: (DatasOnAssets & {
        data: Data;
    })[];
};

export class AssetGenerator {
    private calculateValidUntil(lessonData: TemplateData): Date {
        const now = new Date('2024-12-16T12:00:00');
        const tomorrow = new Date('2024-12-16T10:00:00');
        tomorrow.setDate(tomorrow.getDate() + 1);
        tomorrow.setHours(1, 0, 0);  // 01:00 Uhr am Folgetag

        if (!lessonData.lessons || lessonData.lessons.length === 0) {
            console.log('No lessons found - setting valid until to tomorrow');
            return tomorrow;
        }

        // Konvertiere alle Lessons in Date Objekte für einfacheren Vergleich
        const futureLessons = lessonData.lessons
            .map(lesson => {
                const dateStr = lesson.date.toString();
                const year = parseInt(dateStr.substring(0, 4));
                const month = parseInt(dateStr.substring(4, 6)) - 1; // JS months are 0-based
                const day = parseInt(dateStr.substring(6, 8));
                const hours = Math.floor(lesson.startTime / 100);
                const minutes = lesson.startTime % 100;

                const lessonDate = new Date(year, month, day, hours, minutes);
                return {
                    date: lessonDate,
                    lesson: lesson
                };
            })
            .filter(lessonInfo => lessonInfo.date > now)
            .sort((a, b) => a.date.getTime() - b.date.getTime());

        if (futureLessons.length === 0) {
            console.log('No future lessons found - setting valid until to tomorrow');
            return tomorrow;
        }

        // Nächste Lesson gefunden - setze Zeit 2 Minuten davor
        const nextLesson = futureLessons[0].date;
        nextLesson.setMinutes(nextLesson.getMinutes() - 2);

        return nextLesson;
    }

    async generateAssets(): Promise<void> {
        try {
            // Find assets that will expire in the next 10 minutes
            const expiringAssets = await prisma.asset.findMany({
                where: {
                    valid_until: {
                        lte: new Date(Date.now() + 10 * 60 * 1000) // Current time + 10 minutes
                    },
                    datas: {
                        some: {
                            data: {
                                origin_worker: "WebUntis"
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

    private async regenerateAsset(asset: AssetWithRelations): Promise<AssetGenerationResult> {
        try {
            // Prepare handlebars data from related Data models
            const templateData = asset.datas.reduce((acc: TemplateData, dataOnAsset: DatasOnAssets & { data: Data }) => {
                const jsonData = dataOnAsset.data.json as TemplateData;
                return {
                    ...acc,
                    ...jsonData,
                    lessons: acc.lessons && jsonData.lessons 
                        ? [...acc.lessons, ...jsonData.lessons]
                        : jsonData.lessons || acc.lessons || []
                };
            }, { lessons: [] } as TemplateData);

            const validUntil = this.calculateValidUntil(templateData);

            // Generate new filename while keeping the original asset ID
            const outputPath = path.join(
                process.cwd(),
                'public',
                'dynamic',
                `${asset.id}_${Date.now()}.png`
            );

            const absoluteOutputPath = path.join(
                '../public',
                'dynamic',
                `${asset.id}_${Date.now()}.png`
            );

            // Ensure directory exists
            await fs.mkdir(path.dirname(outputPath), { recursive: true });

            // Generate new image from HTML template
            if (!asset.template) {
                throw new Error('Template not found for asset');
            }

            await nodeHtmlToImage({
                output: outputPath,
                html: asset.template.html,
                content: templateData,
                handlebarsHelpers: {
                    calculateHeight: (startTime: number, endTime: number): number => {
                        return 20;
                        const start = Math.floor(startTime / 100) * 60 + (startTime % 100);
                        const end = Math.floor(endTime / 100) * 60 + (endTime % 100);
                        return ((end - start) / 60) * 32; // 32px pro Stunde
                    },
                    
                    formatTime: (time: number | string): string => {
                        if (!time || time === '-') return '';
                        const timeStr = time.toString().padStart(4, '0');
                        return `${timeStr.slice(0, 2)}:${timeStr.slice(2)}`;
                    },
                    
                    timeSlots: (): string[] => {
                        return Array.from({ length: 12 }, (_, i) =>
                            `${(i + 8).toString().padStart(2, '0')}:00`
                        );
                    },
                    
                    getCurrentLesson: (context: TemplateData | LessonData[]): LessonData => {
                        // Sicherstellen, dass wir mit einem Array arbeiten
                        const lessonsArray = (context as any).data ? (context as any).data.root : context;
                        if (!Array.isArray(lessonsArray)) {
                            console.error('No lessons array found');
                            return {
                                date: 0,
                                startTime: 0,
                                endTime: 0,
                                longname: "Pause",
                                teachers: []
                            };
                        }
                
                        const now = new Date('2024-12-16T10:00:00');
                        const today = now.getFullYear() * 10000 +
                            (now.getMonth() + 1) * 100 +
                            now.getDate();
                        const currentTime = now.getHours() * 100 + now.getMinutes();
                
                        const currentLesson = lessonsArray.find(lesson =>
                            lesson.date === today &&
                            currentTime >= lesson.startTime &&
                            currentTime <= lesson.endTime
                        );
                
                        return currentLesson || {
                            date: today,
                            longname: "Pause",
                            teachers: [],
                            startTime: 0,
                            endTime: 0
                        };
                    },
                    
                    getDaySchedule: (context: TemplateData | LessonData[]): ScheduleItem[] => {
                        // Sicherstellen, dass wir mit einem Array arbeiten
                        const lessonsArray = (context as any).data ? (context as any).data.root : context;
                        if (!Array.isArray(lessonsArray)) {
                            console.error('No lessons array found');
                            return [];
                        }
                
                        const now = new Date();
                        const today = now.getFullYear() * 10000 +
                            (now.getMonth() + 1) * 100 +
                            now.getDate();
                
                        // Filtere die Lektionen für heute und sortiere sie nach Startzeit
                        const todayLessons = lessonsArray
                            .filter(lesson => lesson.date === today)
                            .sort((a, b) => a.startTime - b.startTime);
                
                        // Direkt die Höhe für jede Lektion berechnen
                        return todayLessons.map(lesson => {
                            const start = Math.floor(lesson.startTime / 100) * 60 + (lesson.startTime % 100);
                            const end = Math.floor(lesson.endTime / 100) * 60 + (lesson.endTime % 100);
                            const height = ((end - start) / 60) * 32; // 32px pro Stunde
                            console.log('Lesson height:', height);
                            console.log('Lesson:', lesson);
                            
                            return {
                                ...lesson,
                                height: height
                            };
                        });
                    },
                    
                    eq: (a: any, b: any): boolean => {
                        return a === b;
                    }
                }
            });

            // Try to delete old file if it exists
            if (asset.file_path) {
                try {
                    await fs.unlink(asset.file_path);
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
                    file_path: outputPath,
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
                message: `Failed to regenerate asset: ${error instanceof Error ? error.message : String(error)}`
            };
        }
    }
}

// Usage
export const generateAssets = async (): Promise<void> => {
    const generator = new AssetGenerator();
    await generator.generateAssets();
};

// Überprüfen ob die Datei direkt ausgeführt wird
const isMainModule = import.meta.url === `file://${process.argv[1]}`;

if (isMainModule) {
    generateAssets()
        .then(() => {
            console.log('Asset generation completed successfully');
            process.exit(0);
        })
        .catch(error => {
            console.error('Asset generation failed:', error);
            process.exit(1);
        });
}