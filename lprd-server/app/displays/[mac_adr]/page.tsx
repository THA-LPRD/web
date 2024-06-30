// Cache expiery after 300 Seconds
// export const revalidate = 300;
export const dynamic = 'force-dynamic';

import { redirect } from 'next/navigation'
import Image from 'next/image';
import Link from 'next/link'
import { prisma } from '@/lib/prisma';

import { DisplayForm } from './DisplayForm';

interface Props {
    params: {mac_adr: string};
}

export  default async function showDisplayDetails({params}: Props) {
    const display = await prisma.display.findUnique({where: {mac_adr: params.mac_adr}});
    const allStaticAssets = await prisma.asset.findMany({
            where: {
                type: "STATIC",
            },
        }
    );
    const allDynamicAssets = await prisma.asset.findMany({
            where: {
                type: "DYNAMIC",
            },
        }
    );

    if (!display) {
        redirect("/displays");
    }

    return (
        <DisplayForm display={display} allStaticAssets={allStaticAssets} allDynamicAssets={allDynamicAssets}></DisplayForm>
    );
}