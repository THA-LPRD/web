export const dynamic = 'force-dynamic';
import { NextRequest, NextResponse } from 'next/server';
import { revalidatePath } from "next/cache";
import { prisma } from '@/lib/prisma';

export async function GET(request: Request) {
    // Get all Displays
    const allDatas = await prisma.data.findMany();

    return NextResponse.json(allDatas);
}

export async function PUT(request: Request) {
    // Create new Data
    const formData = await request.formData();

    // const friendly_name_input = formData.get('friendly_name')! as string;

    const jsonString = formData.get('json') as string;
    const jsonObject = JSON.parse(jsonString);


    const newData = await prisma.data.create({
        data: {
            id: formData.get('id') as string,
            origin_type: "JSON",
            origin_worker: "JSON",
            json: jsonObject,
        },
    });

    revalidatePath("/datas");

    return Response.json({newData})
}