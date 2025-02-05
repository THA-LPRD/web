export const dynamic = 'force-dynamic';
import { NextRequest, NextResponse } from 'next/server';
import { revalidatePath } from "next/cache";
import { prisma } from '@/lib/prisma';

export async function PUT(request: NextRequest) {
    // Create new Display
    const url = new URL(request.url);
    const mac_adr = url.pathname.split("/").slice(-1)[0];

    const data = await request.json();

    const newDisplay = await prisma.display.create({
        data: {
            mac_adr: mac_adr,
            friendly_name: data['friendly_name'],
            currentAssetType: 'static',
            width: data['width'],
            height: data['height'],
            last_seen: new Date(),
        }
    });

    revalidatePath("/displays");

    return Response.json({newDisplay})
}