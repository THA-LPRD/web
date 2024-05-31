'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation'

export function ChangeButtons() {
    return (
        <ul>
            <li>
                <Link href={usePathname() + '/add'}>Add</Link>
            </li>
        </ul>
    );
}