export const dynamic = 'force-dynamic';

import Link from 'next/link'

import { prisma } from '@/lib/prisma';

export default async function showAllDisplays() {
    /*
    const displays: Display[] = await fetch('http://localhost:3000/api/getDisplays').then(
        (res) => res.json()
    );

    // Beware of ! -> Tells compiler that we always get an result. 
    const display = displays.find((display) => display.mac_adr == params.mac_adr)!;
    */

    const allDisplays = await prisma.display.findMany();

    return (
        <div>
            <h2>Alle Displays</h2>
                { allDisplays.map((display) => {
                    return (<div>
                        <Link href={"/displays/" + display.mac_adr}>
                            {display.friendly_name}
                        </Link>
                    </div>);
                })}
            
        </div>
    );
}