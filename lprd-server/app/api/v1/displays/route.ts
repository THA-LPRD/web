export const dynamic = 'force-dynamic';
import { NextRequest, NextResponse } from 'next/server';
import { revalidatePath } from "next/cache";
import { prisma } from '@/lib/prisma';

export async function GET(request: Request) {
    // Get all Displays
    const allDisplays = await prisma.display.findMany();

    return NextResponse.json(allDisplays);
}