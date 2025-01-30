// Cache expiery after 300 Seconds
// export const revalidate = 300;
export const dynamic = 'force-dynamic';

import { redirect } from 'next/navigation'
import { prisma } from '@/lib/prisma';
import { DataForm } from './DataForm';

interface Props {
    params: {id: string};
}

export  default async function showDataDetails({params}: Props) {
    const data = await prisma.data.findUnique({where: {id: params.id}});

    if (!data) {
        redirect("/datas");
    }

    return (
        <DataForm data={data}/>
    );
}