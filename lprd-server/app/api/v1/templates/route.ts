export const dynamic = 'force-dynamic';
import { NextRequest, NextResponse } from 'next/server';
import { revalidatePath } from "next/cache";
import { prisma } from '@/lib/prisma';
import fs from "node:fs/promises";
import nodeHtmlToImage from 'node-html-to-image'



export async function GET(request: Request) {
    // Get all Templates
    const allTemplates = await prisma.template.findMany();

    return NextResponse.json(allTemplates);
}

export async function PUT(request: Request) {
    // Create new Template
    const formData = await request.formData();

    const friendly_name_input = formData.get('friendly_name')! as string;
    // const date = new Date(formData.get('valid_for') as string);

    const newTemplate = await prisma.template.create({
        data: {
            friendly_name: friendly_name_input,
            html: formData.get("html") as string,
        },
    });

    revalidatePath("/templates");

    return Response.json({newTemplate})
}