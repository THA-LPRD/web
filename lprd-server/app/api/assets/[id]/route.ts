import { NextRequest, NextResponse } from 'next/server';
import { revalidatePath } from "next/cache";
import { prisma } from '@/lib/prisma';
import fs from "node:fs/promises";

export async function GET(request: Request) {
    // Get one specific Asset
    const url = new URL(request.url);
    const id = url.pathname.split("/").slice(-1)[0];

    const oneAsset = await prisma.asset.findUnique({
        where: {
            id: id!,
        }
    });

    return NextResponse.json(oneAsset);
}

export async function UPDATE(req: NextRequest) {
    // Update a specific Asset
    revalidatePath("/assets");
}

export async function DELETE(request: Request) {
    // Delete a specific Asset
    const url = new URL(request.url);
    const id = url.pathname.split("/").slice(-1)[0];
    
    const oneAsset = await prisma.asset.findUnique({
        where: {
            id: id!,
        }
    });

    await fs.rm('./public' + oneAsset?.file_path);
    
    await prisma.asset.delete({
        where: {
            id: oneAsset!.id,
        },
    });

    revalidatePath("/assets");
    return NextResponse.json({ message: 'Removed Asset' }, { status: 200 });
}