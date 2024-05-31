"use server";

import { prisma } from '@/lib/prisma';
import fs from "node:fs/promises";

// import { revalidatePath } from "next/cache";

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

  // revalidatePath("/");
}

const addAsset = async (e: React.FormEvent<HTMLFormElement>) => {
    
    e.preventDefault();
    
    const formData = new FormData(e.currentTarget);

    const body = {
      name: formData.get('name'),
      bio: formData.get('bio'),
      age: formData.get('age'),
      image: formData.get('image'),
    };

    const res = await fetch('/api/user', {
      method: 'PUT',
      body: JSON.stringify(body),
      headers: {
        'Content-Type': 'application/json',
      },
    });
    
    await res.json();
  };
