'use client';

import Image from 'next/image';
import { useRouter } from 'next/navigation'
import React, { useState } from 'react';


export function AssetForm({ asset }: any) {
    const router = useRouter();

    const [formData, setFormData] = useState({
        html: '',
      });
    
      const handleChange = (e) => {
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
            <Image
                src={asset?.file_path} // Route of the image file
                width={216}
                height={30}
                alt={asset?.friendly_name}
            />
            <div style={{width: '800px', height: '480px;'}} dangerouslySetInnerHTML={{__html: formData.html}}/>
            <form onSubmit={updateAsset}>
                <input type="text" name="friendly_name" defaultValue={asset?.friendly_name ?? ''} />
                <textarea name="html" rows={20} cols={97} onInput={handleChange} defaultValue={asset?.html ?? ''} />
                <button type="submit">Speichern</button>
            </form>

            <form onSubmit={removeAsset}>
                <button type="submit">Löschen</button>
            </form>
        </div>
    );
}