// Cache expiery after 300 Seconds
// export const revalidate = 300;

import { prisma } from '@/lib/prisma';

/*
interface Display {
    mac_adr: string;
    friendly_name: string;
}
*/

interface Props {
    params: {mac_adr: string};
}

export  default async function showDisplayDetails({params}: Props) {
    /*
    const displays: Display[] = await fetch('http://localhost:3000/api/getDisplays').then(
        (res) => res.json()
    );

    // Beware of ! -> Tells compiler that we always get an result. 
    const display = displays.find((display) => display.mac_adr == params.mac_adr)!;
    */

    const display = await prisma.display.findUnique({where: {mac_adr: params.mac_adr}});

    return (
        <div>
            <h1>
                {display.friendly_name}
            </h1>
        </div>
    );
}