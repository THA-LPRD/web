'use client';
export const dynamic = 'force-dynamic';

import Image from 'next/image';
import { useRouter } from 'next/navigation'
import React, { useState } from 'react';


export function DataForm({ data }: any) {
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

    const updateData = async (e : React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        const formData = new FormData(e.currentTarget);

        const response = await fetch("/api/v1/datas/" + data.id, {
            method: 'PUT',
            body: formData,
        });
        router.push("/datas");
        
        if (response.ok) {
            // redirect('/assets');
            // Redirect geht noch nicht
            router.push("/datas");
        } else {
            console.log(response.body);
            console.error('Failed to update the asset');
        }
    };
    
    const removeData = async () => {
        // e.preventDefault();

        // const formData = new FormData(e.currentTarget);

        const response = await fetch("/api/v1/datas/" + data.id, {
            method: 'DELETE',
        });
        router.push("/datas");
        
        if (response.ok) {
            // redirect('/assets');
            // Redirect geht noch nicht
            router.push("/datas");
        } else {
            console.error('Failed to create the asset');
        }
    };

    return (
        <div>
            <h2>{data.id}</h2>
            <h3>Details</h3>
            <form onSubmit={updateData}>
                <label htmlFor="friendly_name">ID</label>
                <input type="text" name="id" id="id" defaultValue={data.id} />
                <br />
                <input type="text" name="outdated_at" id="outdated_at" defaultValue={data?.outdated_at ?? '600'} />
                <br />
                <label htmlFor="json">JSON</label>
                <br />
                <textarea name="json" id="json" rows={20} cols={97} defaultValue={typeof data?.json === 'string' 
        ? JSON.stringify(JSON.parse(data?.json), null, 2) 
        : JSON.stringify(data?.json, null, 2)} />
                < br />
                <button type="submit">Speichern</button>
            </form>

            <form onSubmit={removeData}>
                <button type="submit">Löschen</button>
            </form>
        </div>
    );
}