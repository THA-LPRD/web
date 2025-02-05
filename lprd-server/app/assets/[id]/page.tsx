// Cache expiery after 300 Seconds
// export const revalidate = 300;
export const dynamic = 'force-dynamic';

import { redirect } from 'next/navigation'
import { prisma } from '@/lib/prisma';
import { AssetForm } from './AssetForm';

interface Props {
    params: {id: string};
}

export  default async function showAssetDetails({params}: Props) {
    const asset = await prisma.asset.findUnique({where: {id: params.id}});

    const allTemplates = await prisma.template.findMany();
    const allDatas = await prisma.data.findMany();

    if (!asset) {
        redirect("/assets");
    }

    return (
        <AssetForm asset={asset} allTemplates={allTemplates} allDatas={allDatas}/>
    );
}