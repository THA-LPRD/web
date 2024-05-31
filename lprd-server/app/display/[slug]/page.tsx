// Cache expiery after 300 Seconds
// export const revalidate = 300;

interface Display {
    mac_adr: string;
    friendly_name: string;
}

interface Props {
    params: {slug: string};
}

export  default async function name({params}: Props) {
    const displays: Display[] = await fetch('http://localhost:3000/api/getDisplays').then(
        (res) => res.json()
    );

    // Beware of ! -> Tells compiler that we always get an result. 
    const display = displays.find((display) => display.mac_adr == params.slug)!;

    return (
        <div>
            <h1>
                {display.friendly_name}
            </h1>
        </div>
    );
}