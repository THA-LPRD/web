export const dynamic = 'force-dynamic';
import { NextRequest, NextResponse } from 'next/server';
import { revalidatePath } from "next/cache";
import { prisma } from '@/lib/prisma';

export async function GET(request: Request) {
    // Get one specific Display
    const url = new URL(request.url);
    const mac_adr = url.pathname.split("/").slice(-1)[0];

    // const oneDisplay = await prisma.display.findUnique({
    //     where: {
    //         mac_adr: mac_adr!,
    //     }
    // });

    const oneDisplay = await prisma.display.update({
        where: {
            mac_adr: mac_adr!,
        },
        data: {
            last_seen: new Date(),
        },
    });

    switch (oneDisplay.currentAssetType) {
        case 'static': {
            const currentAsset = await prisma.asset.findUnique({
                where: {
                    id: oneDisplay?.currentAsset!,
                }
            });

            let sleepTimeInuS = 18446744073709551615;
            if (currentAsset?.valid_until != undefined) {
                sleepTimeInuS = (currentAsset?.valid_until.getTime() - new Date().getTime()) * 1000;
            }
             
            return NextResponse.json({ file_path: currentAsset?.file_path, valid_for: sleepTimeInuS });
        }
        case 'dynamic': {
            // const response = await fetch("/api/v1/assets/generate/projectday");
            const json = await fetch("/api/v1/assets/generate/projectday");
            return NextResponse.json(json);
        }
        // default: {
        //     return NextResponse.error({message: 'No type provided', status: 400 });
        // }
    }
} 