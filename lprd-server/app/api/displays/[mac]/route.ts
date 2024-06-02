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

    return NextResponse.json(oneDisplay);
}

export async function UPDATE(req: NextRequest) {
    // Update a specific Display
    revalidatePath("/displays");
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