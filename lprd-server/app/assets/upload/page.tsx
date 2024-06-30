'use client';

import { useRouter } from 'next/navigation'

// import { redirect } from 'next/navigation';
// import { useRouter } from 'next/router';
// import { uploadFile } from "./upload";

export default function AssetForm({ user }: any) {
    const router = useRouter();

    const createAsset = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        const formData = new FormData(e.currentTarget);

        const response = await fetch('/api/v1/assets', {
            method: 'PUT',
            body: formData, //JSON.stringify(body),
        });

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
            <h2>Upload new Asset</h2>
            <form onSubmit={createAsset}>
                <label htmlFor="friendly_name">Assetname</label>
                <input type="text" name="friendly_name" />
                <label htmlFor="valid_for">Anzeigedauer:</label>
                <input type="text" name="valid_for" id="valid_for" defaultValue='600'/>
                <label htmlFor="file">Datei</label>
                <input type="file" name="file" accept='.png'/>
                <button type="submit">Hochladen</button>
            </form>
        </div>
    );
}