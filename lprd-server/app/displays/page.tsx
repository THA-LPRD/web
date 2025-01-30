export const dynamic = 'force-dynamic';

import Image from 'next/image';
import Link from 'next/link'

import { prisma } from '@/lib/prisma';
import { env } from 'node:process';

import DisplayComponent from '@/components/ui/display';

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
            <div className='allDisplay-container'>
                {allDisplays.map(async (oneDisplay) => {
                    return(<DisplayComponent key={oneDisplay.mac_adr} {...oneDisplay}/>)
                })}
            </div>
        </div>
    );
}