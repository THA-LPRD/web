// Cache expiery after 300 Seconds
// export const revalidate = 300;
export const dynamic = 'force-dynamic';

import { redirect } from 'next/navigation'
import { prisma } from '@/lib/prisma';
import { TemplateForm } from './TemplateForm';

interface Props {
    params: {id: string};
}

export  default async function showTemplateDetails({params}: Props) {
    const template = await prisma.template.findUnique({where: {id: params.id}});

    if (!template) {
        redirect("/templates");
    }

    return (
        <TemplateForm template={template}/>
    );
}