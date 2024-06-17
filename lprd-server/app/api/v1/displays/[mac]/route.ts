import { NextRequest, NextResponse } from 'next/server';
import { revalidatePath } from "next/cache";
import { prisma } from '@/lib/prisma';

export async function GET(request: Request) {
    // Get one specific Display
    const url = new URL(request.url);
    const mac_adr = url.pathname.split("/").slice(-1)[0];

    const oneDisplay = await prisma.display.findUnique({
        where: {
            mac_adr: mac_adr!,
        }
    });

    if (oneDisplay) {
        return NextResponse.json(oneDisplay);
    } else {
        return NextResponse.json({ message: 'No Display found' }, { status: 404 });
    }
}

export async function PUT(request: Request) {
    // Update a specific Display
    const url = new URL(request.url);
    const mac_adr = url.pathname.split("/").slice(-1)[0];

    //console.log(request.headers.get("content-type"))

    if (request.headers.get("content-type")?.includes("multipart/form-data") || request.headers.get("content-type")?.includes("application/x-www-form-urlencoded")) {
        //console.log("Update Form")
        let formData;
        try {formData = await request.formData()}
        catch (e) {
            console.log("Kein Form")
            console.log((e as Error).message)
        }

        
        const updatedDisplay = await prisma.display.update({
            where: {
                mac_adr: mac_adr,
            },
            data: {
                friendly_name: formData.get('friendly_name')! as string,
                width: parseInt(formData.get('width')!.toString()),
                height: parseInt(formData.get('height')!.toString()),
            },
        });
    }

    if (request.headers.get("content-type")?.includes("application/json")) {
        //console.log("Update Asset")
        let data;
        try {data = await request.json()}
        catch (e) {
            console.log("Kein JSON")
            console.log((e as Error).message)
        }

        if (data["currentAsset"]) {
            const updatedDisplay = await prisma.display.update({
                where: {
                    mac_adr: mac_adr,
                },
                data: {
                    currentAsset: data["currentAsset"],
                    currentAssetType: data["currentAssetType"],
                },
            });
        }
    }
    
    revalidatePath("/assets");

    //return Response.json({updatedAsset})
    return NextResponse.json({ message: 'Updated Asset'}, { status: 200 });
}

export async function DELETE(request: Request) {
    // Delete a specific Display
    const url = new URL(request.url);
    const mac_adr = url.pathname.split("/").slice(-1)[0];
    
    await prisma.display.delete({
        where: {
            mac_adr: mac_adr,
        },
    });

    revalidatePath("/displays");
    return NextResponse.json({ message: 'Removed Display' }, { status: 200 });
}