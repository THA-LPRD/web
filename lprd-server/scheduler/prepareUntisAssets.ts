import { PrismaClient, Asset, Template, Data, DatasOnAssets } from '@prisma/client';
import nodeHtmlToImage from 'node-html-to-image';
import path from 'path';
import * as fs from 'fs/promises';
import { fileURLToPath } from 'url';

const prisma = new PrismaClient();

interface LessonData {
    date: number;
    startTime: number;
    endTime: number;
    longname: string;
    teachers: Array<{
        longName: string;
        name: string;
        id: number;
    }>;
}

interface ProcessedLesson extends LessonData {
    height: number;
    formattedStartTime: string;
    formattedEndTime: string;
    teacherList: string;
    slotClass: string;
    displayName: string;
}

interface ProcessedData {
    room: string;
    currentLesson: ProcessedLesson;
    daySchedule: ProcessedLesson[];
    timeSlots: string[];
}

interface AssetGenerationResult {
    success: boolean;
    message: string;
    assetId?: string;
}

type AssetWithRelations = Asset & {
    template: Template | null;
    datas: (DatasOnAssets & {
        data: Data;
    })[];
};

// Konstanten für die Zeitfenster
const TIME_WINDOW = {
    START_HOUR: 8,
    END_HOUR: 20,
    TOTAL_HOURS: 12,  // 20 - 8 = 12 Stunden
    CONTAINER_HEIGHT: 384,  // Pixel
    PIXELS_PER_HOUR: 32    // 384/12 = 32
};

export class AssetGenerator {
    private calculateValidUntil(lessonData: any): Date {
        const now = new Date();//'2024-12-16T12:00:00');
        const tomorrow = new Date();//'2024-12-16T10:00:00');
        tomorrow.setDate(tomorrow.getDate() + 1);
        tomorrow.setHours(1, 0, 0);

        if (!lessonData.lessons || lessonData.lessons.length === 0) {
            console.log('No lessons found - setting valid until to tomorrow');
            return tomorrow;
        }

        const futureLessons = lessonData.lessons
            .map(lesson => {
                const dateStr = lesson.date.toString();
                const year = parseInt(dateStr.substring(0, 4));
                const month = parseInt(dateStr.substring(4, 6)) - 1;
                const day = parseInt(dateStr.substring(6, 8));
                const hours = Math.floor(lesson.startTime / 100);
                const minutes = lesson.startTime % 100;

                return new Date(year, month, day, hours, minutes);
            })
            .filter(date => date > now)
            .sort((a, b) => a.getTime() - b.getTime());

        if (futureLessons.length === 0) {
            console.log('No future lessons found - setting valid until to tomorrow');
            return tomorrow;
        }

        const nextLesson = futureLessons[0];
        nextLesson.setMinutes(nextLesson.getMinutes() - 2);
        return nextLesson;
    }

    private formatTime(time: number): string {
        const timeStr = time.toString().padStart(4, '0');
        return `${timeStr.slice(0, 2)}:${timeStr.slice(2)}`;
    }

    private timeToMinutes(time: number): number {
        const hours = Math.floor(time / 100);
        const minutes = time % 100;
        return hours * 60 + minutes;
    }

    private calculateLessonDimensions(startTime: number, endTime: number): { height: number; topOffset: number; visible: boolean } {
        const startMinutes = this.timeToMinutes(startTime);
        const endMinutes = this.timeToMinutes(endTime);
        const windowStartMinutes = TIME_WINDOW.START_HOUR * 60;
        const windowEndMinutes = TIME_WINDOW.END_HOUR * 60;

        // Prüfe, ob die Lektion komplett außerhalb des Zeitfensters liegt
        if (endMinutes <= windowStartMinutes || startMinutes >= windowEndMinutes) {
            return { height: 0, topOffset: 0, visible: false };
        }

        // Beschneide Start- und Endzeit auf das Zeitfenster
        const effectiveStartMinutes = Math.max(startMinutes, windowStartMinutes);
        const effectiveEndMinutes = Math.min(endMinutes, windowEndMinutes);

        // Berechne die Position und Höhe
        const topOffset = ((effectiveStartMinutes - windowStartMinutes) / 60) * TIME_WINDOW.PIXELS_PER_HOUR;
        const height = ((effectiveEndMinutes - effectiveStartMinutes) / 60) * TIME_WINDOW.PIXELS_PER_HOUR;

        return {
            height,
            topOffset,
            visible: true
        };
    }

    private processLesson(lesson: LessonData): ProcessedLesson {
        const isPause = lesson.longname === "Frei";
        const dimensions = this.calculateLessonDimensions(lesson.startTime, lesson.endTime);
        
        return {
            ...lesson,
            ...dimensions,
            formattedStartTime: this.formatTime(lesson.startTime),
            formattedEndTime: this.formatTime(lesson.endTime),
            teacherList: lesson.teachers.map(t => t.longName).join(', '),
            slotClass: `body-side-slot-${isPause ? 'break' : 'event'}`,
            displayName: isPause ? '' : lesson.longname
        };
    }

    private calculateHeight(startTime: number, endTime: number): number {
        const start = Math.floor(startTime / 100) * 60 + (startTime % 100);
        const end = Math.floor(endTime / 100) * 60 + (endTime % 100);
        return ((end - start) / 60) * 32; // 32px pro Stunde
    }


    private getCurrentLesson(lessons: LessonData[]): ProcessedLesson {
        const now = new Date();//'2024-12-17T10:00:00');
        const today = now.getFullYear() * 10000 +
            (now.getMonth() + 1) * 100 +
            now.getDate();
        const currentTime = now.getHours() * 100 + now.getMinutes();

        const currentLesson = lessons.find(lesson =>
            lesson.date === today &&
            currentTime >= lesson.startTime &&
            currentTime <= lesson.endTime
        );

        return this.processLesson(currentLesson || {
            date: today,
            longname: "Pause",
            teachers: [],
            startTime: 0,
            endTime: 0
        });
    }

    private processData(data: any): ProcessedData {
        const lessons: LessonData[] = data.lessons;
        
        // Erstelle Zeitslots für die Seitenleiste
        const timeSlots = Array.from({ length: 12 }, (_, i) =>
            `${(i + 8).toString().padStart(2, '0')}:00`
        );

        // Hole aktuelle Lektion
        const currentLesson = this.getCurrentLesson(lessons);

        // Hole und verarbeite Tageslektionen
        const now = new Date();//'2024-12-17T10:00:00');
        const today = now.getFullYear() * 10000 +
            (now.getMonth() + 1) * 100 +
            now.getDate();
        
        const daySchedule = lessons
            .filter(lesson => lesson.date === today)
            .sort((a, b) => a.startTime - b.startTime)
            .map(lesson => this.processLesson(lesson));

        return {
            room: data.room,
            currentLesson,
            daySchedule,
            timeSlots
        };
    }

    async generateAssets(): Promise<void> {
        try {
            const expiringAssets = await prisma.asset.findMany({
                where: {
                    valid_until: {
                        lte: new Date(Date.now() + 10 * 60 * 1000)
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
            const rawData = asset.datas.reduce((acc: any, dataOnAsset: DatasOnAssets & { data: Data }) => {
                const jsonData = dataOnAsset.data.json as any;
                return {
                    ...acc,
                    ...jsonData,
                    lessons: acc.lessons && jsonData.lessons 
                        ? [...acc.lessons, ...jsonData.lessons]
                        : jsonData.lessons || acc.lessons || []
                };
            }, { lessons: [] });

            // Verarbeite die Daten
            const processedData = this.processData(rawData);

            // console.log('Processed data:', processedData);
            
            const validUntil = this.calculateValidUntil(rawData);
            
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

            await fs.mkdir(path.dirname(outputPath), { recursive: true });

            if (!asset.template) {
                throw new Error('Template not found for asset');
            }

            await nodeHtmlToImage({
                output: outputPath,
                html: asset.template.html,
                content: processedData
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
                        // Zuerst finden wir alle betroffenen Data IDs
                        const dataIds = asset.datas
                            .filter(d => d.data.origin_worker === "JSON" && d.data.is_outdated)
                            .map(d => d.data.id);
            
                        // Dann updaten wir das Asset und die verknüpften Data Einträge
                        const updatedAsset = await prisma.$transaction(async (tx) => {
                            // Update Asset
                            const updated = await tx.asset.update({
                                where: {
                                    id: asset.id
                                },
                                data: {
                                    file_path: databaseOutputPath,
                                    valid_until: validUntil
                                }
                            });
            
                            // Update alle verknüpften Data Einträge
                            if (dataIds.length > 0) {
                                await tx.data.updateMany({
                                    where: {
                                        id: {
                                            in: dataIds
                                        }
                                    },
                                    data: {
                                        is_outdated: false
                                    }
                                });
                            }
            
                            return updated;
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

export const generateAssets = async (): Promise<void> => {
    const generator = new AssetGenerator();
    await generator.generateAssets();
};

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