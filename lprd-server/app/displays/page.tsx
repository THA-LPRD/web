import { prisma } from '@/lib/prisma';

export  default async function showAllDisplays() {
    /*
    const displays: Display[] = await fetch('http://localhost:3000/api/getDisplays').then(
        (res) => res.json()
    );

    // Beware of ! -> Tells compiler that we always get an result. 
    const display = displays.find((display) => display.mac_adr == params.mac_adr)!;
    */

    const allDisplays = await prisma.display.findMany();

    return (
        <div>
            <h1>
                { allDisplays.map((display) => {
                    return (<div>
                        {display.friendly_name}
                    </div>);
                })}
            </h1>
        </div>
    );
}