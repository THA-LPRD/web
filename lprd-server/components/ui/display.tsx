// import Image from 'next/image';
import Link from 'next/link'
import Image from 'next/image';

import { prisma } from '@/lib/prisma';
import { Display } from '@prisma/client';
// import { Display, Prisma } from '@prisma/client';

export default async function DisplayComponent(display: Display) {
    if (display.currentAsset) {
        let asset = await prisma.asset.findUnique({
            where: {
                id: display.currentAsset!,
            }});
        return (
            <Link key={display.mac_adr} href={"/displays/" + display.mac_adr}>
                <div className='display-container'>
                        <Image
                            src={asset!.file_path!} // Route of the image file
                            width={216}
                            height={30}
                            alt={asset!.friendly_name!}
                        />
                    {display.friendly_name}
                </div>
            </Link>
        );
    } else {
        return (
            <Link key={display.mac_adr} href={"/displays/" + display.mac_adr}>
                <div className='display-container'>
                    {display.friendly_name}
                </div>
            </Link>
        );
    }
    
}