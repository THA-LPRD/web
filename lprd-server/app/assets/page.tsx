import { prisma } from '@/lib/prisma';

import Image from 'next/image';

export  default async function showAllAssets() {
    const allAssets = await prisma.asset.findMany();

    return (
        <div>
            <h1>
                { allAssets.map((asset) => {
                    return (<div>
                        <Image
                            src={asset.file_path} // Route of the image file
                            width={216}
                            height={30}
                            //alt="NextSpace Logo"
                        />
                        {asset.friendly_name}
                    </div>);
                })}
            </h1>
        </div>
    );
}