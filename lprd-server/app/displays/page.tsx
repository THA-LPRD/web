export const dynamic = 'force-dynamic';

import Image from 'next/image';
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
            <div className='allDisplay-container'>
                {allDisplays.map(async (display) => {
                    const asset = await prisma.asset.findUnique({
                        where: {
                            id: display.currentAsset!,
                        },
                    });
                    return (
                        <Link href={"/displays/" + display.mac_adr}>
                            <div className='display-container'>
                            <Image
                                    src={asset?.file_path!} // Route of the image file
                                    width={216}
                                    height={30}
                                    alt={asset?.friendly_name!}
                                />
                                {display.friendly_name}
                                </div>
                        </Link>
                        
                    );
                })}
            </div>
        </div>
    );
}