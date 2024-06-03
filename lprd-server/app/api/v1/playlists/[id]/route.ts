import { NextRequest, NextResponse } from 'next/server';
import { revalidatePath } from "next/cache";
import { prisma } from '@/lib/prisma';

export async function GET(request: Request) {
    // Get one specific Playlist
    const url = new URL(request.url);
    const id = url.pathname.split("/").slice(-1)[0];

    const onePlaylist = await prisma.playlist.findUnique({
        where: {
            id: id!,
        }
    });

    return NextResponse.json(onePlaylist);
}

export async function UPDATE(req: NextRequest) {
    // Update a specific Playlist
    revalidatePath("/playlists");
}

export async function DELETE(request: Request) {
    // Delete a specific Playlist
    const url = new URL(request.url);
    const id = url.pathname.split("/").slice(-1)[0];
    
    await prisma.playlist.delete({
        where: {
            id: id,
        },
    });

    revalidatePath("/playlists");
    return NextResponse.json({ message: 'Removed Playlist' }, { status: 200 });
}