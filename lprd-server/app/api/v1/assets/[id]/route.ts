export const dynamic = 'force-dynamic';
import { NextRequest, NextResponse } from 'next/server';
import { revalidatePath } from "next/cache";
import { prisma } from '@/lib/prisma';
import fs from "node:fs/promises";
import nodeHtmlToImage from 'node-html-to-image'

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

    // const formData = await request.formData();
    const data = request.headers.get('Content-Type')?.includes('application/json') 
        ? await request.json()
        : Object.fromEntries(await request.formData());

    // const friendly_name_input = formData.get('friendly_name')! as string;

    const updatedAsset = await prisma.asset.update({
        where: { id },
        data: {
            ...(data.friendly_name && { friendly_name: data.friendly_name }),
            ...(data.currentTemplate && {
                template: {
                    connect: { id: data.currentTemplate }
                }
            }),
            ...(data.currentData && {
                datas: {
                    connectOrCreate: [{
                        where: {
                            assetId_dataId: {
                                assetId: id,
                                dataId: data.currentData
                            }
                        },
                        create: {
                            data: {
                                connect: { id: data.currentData }
                            }
                        }
                    }]
                }
            })
        },
    });

    // await nodeHtmlToImage({
    //     output: "./public/uploads/" + updatedAsset.id + ".png",
    //     html: updatedAsset.html as string,
    // });

    revalidatePath("/assets");

    //return Response.json({updatedAsset})
    return NextResponse.json({ message: 'Updated Asset'}, { status: 200 });
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

    try {
        await fs.rm('./public' + oneAsset?.file_path);
    } catch (error) {
        console.error('Failed to remove file');
    }
    
    await prisma.asset.delete({
        where: {
            id: oneAsset!.id,
        },
    });

    revalidatePath("/assets");
    return NextResponse.json({ message: 'Removed Asset' }, { status: 200 });
}