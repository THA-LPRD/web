'use client';
export const dynamic = 'force-dynamic';

import { prisma } from '@/lib/prisma';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation'
import React, { useState } from 'react';


export function AssetForm({ asset, allTemplates, allDatas }: any) {
    const router = useRouter();

    const [formData, setFormData] = useState({
        html: '',
    });

    const handleChange = (e: any) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
    };

    const updateAsset = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        const formData = new FormData(e.currentTarget);

        const response = await fetch("/api/v1/assets/" + asset.id, {
            method: 'PUT',
            body: formData,
        });
        router.push("/assets");

        if (response.ok) {
            router.push("/assets");
        } else {
            console.log(response.body);
            console.error('Failed to update the asset');
        }
    };

    const setTemplate = async (e: any) => {
        const response = await fetch("/api/v1/assets/" + asset.id, {
            method: 'PUT',
            body: JSON.stringify({
                currentTemplate: e.target.id
            }),
            headers: {
                'Content-Type': 'application/json'
            },
        });

        if (response.ok) {
            router.push("/assets");
        } else {
            console.error('Failed to update asset');
        }
    };

    const setData = async (e: any) => {
        const response = await fetch("/api/v1/assets/" + asset.id, {
            method: 'PUT',
            body: JSON.stringify({
                currentData: e.target.id
            }),
            headers: {
                'Content-Type': 'application/json'
            },
        });

        if (response.ok) {
            router.push("/assets");
        } else {
            console.error('Failed to update asset');
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
                {/*<label htmlFor="valid_for">Anzeigedauer</label>
                <input type="text" name="valid_for" id="valid_for" defaultValue={asset?.valid_for ?? '600'} />
                <label htmlFor="valid_for">Sekunden</label>*/}
                {/* <br />
                <label htmlFor="html">HTML</label> */}
                {/* <br />
                <textarea name="html" id="html" rows={20} cols={97} onInput={handleChange} onPaste={handleChange} defaultValue={asset?.html ?? ''} />
                < br />
                HTML Live Vorschau
                <div style={{width: '800px', height: '480px;'}} dangerouslySetInnerHTML={{__html: formData.html}}/> */}
                <button type="submit">Speichern</button>
            </form>
            <form onSubmit={removeAsset}>
                <button type="submit">Löschen</button>
            </form>
            <h3>Template</h3>
            <br />
            <div className='allTemplates-container'>
                {allTemplates.map((template) => {
                    return (
                        <div key={template.id} className='asset-container' id={template.id} onClick={setTemplate} >
                            {template.friendly_name}
                        </div>
                    );
                })}
            </div>
            <h3>Datas</h3>
            <br />
            <div className='allTemplates-container'>
                {allDatas.map((data) => {
                    return (
                        <div key={data.id} className='asset-container' id={data.id} onClick={setData} >
                            {data.id}
                        </div>
                    );
                })}
            </div>
        </div>
    );
}