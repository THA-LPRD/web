// Cache expiery after 300 Seconds
// export const revalidate = 300;
import { prisma } from '@/lib/prisma';

interface Props {
    params: {id: string};
}

export  default async function showDisplayDetails({params}: Props) {
    const playlist = await prisma.playlist.findUnique({where: {id: params.id}});

    return (
        <div>
            <h2>
                {playlist!.friendly_name}
            </h2>
        </div>
    );
}