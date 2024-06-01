"use server";

import { prisma } from '@/lib/prisma';
import fs from "node:fs/promises";

import { revalidatePath } from "next/cache";
import { redirect } from 'next/navigation';


export async function uploadFile(formData: FormData) {

    const friendly_name_input = formData.get('friendly_name')! as string;

    const newAsset = await prisma.asset.create({
        data: {
            friendly_name: friendly_name_input,
            file_path: '',
        },
    });

    const file = formData.get("file") as File;
    const arrayBuffer = await file.arrayBuffer();
    const buffer = new Uint8Array(arrayBuffer);
    const filePath = '/uploads/' + newAsset.id + '.' + file.name.split('.').slice(-1)[0];
    
    await fs.writeFile('./public' + filePath, buffer);
    

    await prisma.asset.update({
        where: {
            id: newAsset.id,
        },
        data: {
            file_path: filePath,
        },
    });

  revalidatePath("/assets");
  redirect('/assets');
}
