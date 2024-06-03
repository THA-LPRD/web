import { NextRequest, NextResponse } from 'next/server';
import { revalidatePath } from "next/cache";
import { prisma } from '@/lib/prisma';

export async function PUT(request: Request) {
    // Create new Display
    const url = new URL(request.url);
    const mac_adr = url.pathname.split("/").slice(-1)[0];

    const newDisplay = await prisma.display.create({
        data: {
            mac_adr: mac_adr,
            friendly_name: "",
        }
    });

    revalidatePath("/displays");

    return Response.json({newDisplay})
}