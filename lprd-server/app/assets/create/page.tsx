'use client';
export const dynamic = 'force-dynamic';
import { useRouter } from 'next/navigation'

// import { useRouter } from 'next/navigation'

export  default async function showAssetDetails() {
    const router = useRouter();
    
    const createAsset = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        const formData = new FormData(e.currentTarget);

        const response = await fetch('/api/v1/assets', {
            method: 'PUT',
            body: formData, //JSON.stringify(body),
        });

        if (response.ok) {
            router.push("/assets");
        } else {
            console.error('Failed to create the asset');
        }
    };

    return (
        <div>
            <h2>Create new Asset</h2>
            <form onSubmit={createAsset}>
                <label htmlFor="friendly_name">Assetname</label>
                <input type="text" name="friendly_name" />
                <button type="submit">Erstellen</button>
            </form>
        </div>
    );
}