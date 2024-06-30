'use client';

import Image from 'next/image';
import { useRouter } from 'next/navigation'
import React, { useState } from 'react';


export function AssetForm({ asset }: any) {
    const router = useRouter();

    const [formData, setFormData] = useState({
        html: '',
      });
    
      const handleChange = (e : any) => {
        const { name, value } = e.target;
        setFormData({
          ...formData,
          [name]: value
        });
      };

    const updateAsset = async (e : React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        const formData = new FormData(e.currentTarget);

        const response = await fetch("/api/v1/assets/" + asset.id, {
            method: 'PUT',
            body: formData,
        });
        router.push("/assets");
        
        if (response.ok) {
            // redirect('/assets');
            // Redirect geht noch nicht
            router.push("/assets");
        } else {
            console.log(response.body);
            console.error('Failed to update the asset');
        }
    };
    
    const removeAsset = async () => {
        // e.preventDefault();

        // const formData = new FormData(e.currentTarget);

        const response = await fetch("/api/v1/assets/" + asset.id, {
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
            <h2>{asset.friendly_name}</h2>
            <h3>Vorschau</h3>
            <Image
                src={asset?.file_path} // Route of the image file
                width={400}
                height={240}
                alt={asset?.friendly_name}
            />
            <h3>Details</h3>
            <form onSubmit={updateAsset}>
                <label htmlFor="friendly_name">Assetname</label>
                <input type="text" name="friendly_name" id="friendly_name" defaultValue={asset?.friendly_name ?? ''} />
                <br />
                <label htmlFor="valid_for">Anzeigedauer</label>
                <input type="text" name="valid_for" id="valid_for" defaultValue={asset?.valid_for ?? '600'} />
                <label htmlFor="valid_for">Sekunden</label>
                <br />
                <label htmlFor="html">HTML</label>
                <br />
                <textarea name="html" id="html" rows={20} cols={97} onInput={handleChange} onPaste={handleChange} defaultValue={asset?.html ?? ''} />
                < br />
                HTML Live Vorschau
                <div style={{width: '800px', height: '480px;'}} dangerouslySetInnerHTML={{__html: formData.html}}/>
                <button type="submit">Speichern</button>
            </form>

            <form onSubmit={removeAsset}>
                <button type="submit">Löschen</button>
            </form>
        </div>
    );
}