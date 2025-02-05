export const dynamic = 'force-dynamic';

import Image from 'next/image';
import Link from 'next/link';

import { prisma } from '@/lib/prisma';

export default async function showAllTemplates() {
    const allTemplates = await prisma.template.findMany();

    return (
        <div>
            <h2>Alle Templates</h2>
            <nav>
                <ul>
                    <li>
                        <Link className='asset-buttons' href={'/templates/create'}>Erstellen</Link>
                    </li>
                </ul>
            </nav>
            <div className='table-container'>
                {allTemplates.map((template) => {
                    return (
                        <div key={template.id} className='template-container'>
                            <Link href={"/templates/" + template.id}>
                                {template.friendly_name}
                            </Link>
                        </div>);
                })}
            </div>
        </div>
    );
}