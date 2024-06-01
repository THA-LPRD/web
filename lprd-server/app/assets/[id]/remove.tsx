'use server';

import { prisma } from '@/lib/prisma';
import fs from "node:fs/promises";

export async function deleteFile(file_path: string) {
    console.log("Delete!");
    await fs.rm('/public' + file_path);
    
    prisma.asset.delete({
        where: {
            file_path: file_path,
        },
    });
}
