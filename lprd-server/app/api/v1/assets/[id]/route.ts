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

export async function PUT(request: Request) {
    // Update a specific Asset
    const url = new URL(request.url);
    const id = url.pathname.split("/").slice(-1)[0];

    const formData = await request.formData();
    

    const friendly_name_input = formData.get('friendly_name')! as string;

    const updatedAsset = await prisma.asset.update({
        where: {
            id: id,
        },
        data: {
            friendly_name: friendly_name_input,
        },
    });

    revalidatePath("/assets");

    //return Response.json({updatedAsset})
    return NextResponse.json({ message: 'Updated Asset', id: id, name: friendly_name_input }, { status: 200 });
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