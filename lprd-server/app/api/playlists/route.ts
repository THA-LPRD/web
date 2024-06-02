import { NextRequest, NextResponse } from 'next/server';
import { revalidatePath } from "next/cache";
import { prisma } from '@/lib/prisma';

export async function GET(request: Request) {
    // Get all Playlists
    const allPlaylists = await prisma.playlist.findMany();

    return NextResponse.json(allPlaylists);
}