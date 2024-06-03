import Link from 'next/link'
import { prisma } from '@/lib/prisma';

export  default async function showAllPlaylists() {
    const allPlaylists = await prisma.playlist.findMany();

    return (
        <div>
            <h2>Alle Playlists</h2>
                { allPlaylists.map((playlist) => {
                    return (
                    <div>
                        <Link href={"/playlists/" + playlist.id}>
                            {playlist.friendly_name}
                        </Link>
                    </div>);
                })}
        </div>
    );
}