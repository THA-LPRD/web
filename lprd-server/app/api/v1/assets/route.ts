export const dynamic = 'force-dynamic';
import { NextRequest, NextResponse } from 'next/server';
import { revalidatePath } from "next/cache";
import { prisma } from '@/lib/prisma';
import fs from "node:fs/promises";
import nodeHtmlToImage from 'node-html-to-image'



export async function GET(request: Request) {
    // Get all Assets
    const allAssets = await prisma.asset.findMany();

    return NextResponse.json(allAssets);
}

export async function PUT(request: Request) {
    // Create new Asset
    const formData = await request.formData();

    const friendly_name_input = formData.get('friendly_name')! as string;

    const newAsset = await prisma.asset.create({
        data: {
            friendly_name: friendly_name_input,
            file_path: '',
            valid_for: parseInt(formData.get('valid_for') as string),
            type: "STATIC"
        },
    });

    if (formData.get('html')) {
        await prisma.asset.update({
            where: {
                id: newAsset.id,
            },
            data: {
                html: formData.get("html") as string,
                file_path: "/uploads/" + newAsset.id + ".png",
            },
        });

        await nodeHtmlToImage({
            output: "./public/uploads/" + newAsset.id + ".png",
            html: formData.get("html") as string,
        });
    }

    if (formData.get('file')) {
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
                type: "STATIC",
            },
        });
    }

    revalidatePath("/assets");

    return Response.json({newAsset})
}