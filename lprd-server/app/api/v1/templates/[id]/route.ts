export const dynamic = 'force-dynamic';
import { NextRequest, NextResponse } from 'next/server';
import { revalidatePath } from "next/cache";
import { prisma } from '@/lib/prisma';
import fs from "node:fs/promises";
import nodeHtmlToImage from 'node-html-to-image'

export async function GET(request: Request) {
    // Get one specific Template
    const url = new URL(request.url);
    const id = url.pathname.split("/").slice(-1)[0];

    const oneTemplate = await prisma.template.findUnique({
        where: {
            id: id!,
        }
    });

    return NextResponse.json(oneTemplate);
}

export async function PUT(request: Request) {
    // Update a specific Template
    const url = new URL(request.url);
    const id = url.pathname.split("/").slice(-1)[0];

    const formData = await request.formData();
    

    // const friendly_name_input = formData.get('friendly_name')! as string;

    const updatedTemplate = await prisma.template.update({
        where: {
            id: id,
        },
        data: {
            friendly_name: formData.get('friendly_name')! as string,
            html: formData.get('html')! as string,
        },
    });

    revalidatePath("/templates");

    return NextResponse.json({ message: 'Updated Template'}, { status: 200 });
}

export async function DELETE(request: Request) {
    // Delete a specific Template
    const url = new URL(request.url);
    const id = url.pathname.split("/").slice(-1)[0];
    
    await prisma.template.delete({
        where: {
            id: id,
        },
    });

    revalidatePath("/templates");
    return NextResponse.json({ message: 'Removed Template' }, { status: 200 });
}