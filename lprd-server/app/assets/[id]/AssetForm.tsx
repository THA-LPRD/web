'use client';

import Image from 'next/image';
import { useRouter } from 'next/navigation'

export function AssetForm({ asset }: any) {
    const router = useRouter();
    
    const removeAsset = async () => {
        // e.preventDefault();

        // const formData = new FormData(e.currentTarget);

        const response = await fetch("/api/assets/" + asset.id, {
            method: 'DELETE',
        });
        router.push("/assets");
        
        if (response.ok) {
            // redirect('/assets');
            // Redirect geht noch nicht
            router.push("/assets");
        } else {
            console.error('Failed to create the asset');
        }
    };

    return (
        <div>

            <Image
                src={asset!.file_path} // Route of the image file
                width={216}
                height={30}
                alt={asset!.friendly_name}
            />
            {asset!.friendly_name}

            <form onSubmit={removeAsset}>
                <button type="submit">Löschen</button>
            </form>
        </div>
    );
}