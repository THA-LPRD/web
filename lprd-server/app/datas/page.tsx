export const dynamic = 'force-dynamic';

import Image from 'next/image';
import Link from 'next/link';

import { prisma } from '@/lib/prisma';

export default async function showAllDatas() {
    const allDatas = await prisma.data.findMany();

    return (
        <div>
            <h2>Alle Daten</h2>
            <nav>
                <ul>
                    <li>
                        <Link className='asset-buttons' href={'/datas/create'}>Erstellen</Link>
                    </li>
                </ul>
            </nav>
            <div className='table-container'>
                <table className='data-table'>
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Origin Type</th>
                            <th>Aktion</th>
                        </tr>
                    </thead>
                    <tbody>
                        {allDatas.map((data) => (
                            <tr key={data.id}>
                                <td>{data.id}</td>
                                <td>{data.origin_type}</td>
                                <td>
                                    <Link href={`/datas/${data.id}`}>
                                        Details
                                    </Link>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}