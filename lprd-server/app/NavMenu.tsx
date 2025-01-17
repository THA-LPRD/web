import Link from 'next/link';
import { usePathname } from 'next/navigation'

import styles from './NavMenu.module.css';

export default function NavMenu() {
    return (
        <nav className={styles.nav}>
            <ul className={styles.links}>
                <li>
                    <Link href={'/displays'}>Displays</Link>
                </li>
                <li>
                    <Link href={'/assets'}>Assets</Link>
                </li>
            </ul>
        </nav>
    )
}