export const dynamic = 'force-dynamic';

import Image from 'next/image';
import Link from 'next/link'

import { prisma } from '@/lib/prisma';

export default async function showAllAssets() {
    const allAssets = await prisma.asset.findMany();

    return (
        <div>
            <h2>Alle Assets</h2>
            <nav>
                <ul>
                    <li>
                        <Link className='asset-buttons' href={'/assets/create'}>Create</Link>
                    </li>
                    <li>
                        <Link className='asset-buttons' href={'/assets/upload'}>Upload</Link>
                    </li>
                </ul>
            </nav>
            <div className='allAssets-container'>
                {allAssets.map((asset) => {
                    return (
                        <div className='asset-container'>
                            <Link href={"/assets/" + asset.id}>
                                <Image
                                    src={asset!.file_path!} // Route of the image file
                                    width={216}
                                    height={30}
                                    alt={asset!.friendly_name!}
                                />
                                {asset.friendly_name}
                            </Link>
                        </div>);
                })}
            </div>
        </div>
    );
}