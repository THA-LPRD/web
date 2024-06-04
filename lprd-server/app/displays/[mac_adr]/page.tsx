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
    const allAssets = await prisma.asset.findMany();

    if (!display) {
        redirect("/displays");
    }

    const setAsset = async (id) => {
        // const response = await fetch("/api/v1/displays/" + display?.mac_adr, {
        //     method: 'PUT',
        //     body: {"currentAsset": id},
        // });
        // router.push("/displays");
        console.log(id);
        //if (response.ok) {
            // redirect('/assets');
            // Redirect geht noch nicht
            // router.push("/assets");
        //} else {
            //console.log(response.body);
            //console.error('Failed to update the asset');
        //}
    };

    return (
        <DisplayForm display={display} allAssets={allAssets}></DisplayForm>
    );
}