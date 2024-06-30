'use client';
export const dynamic = 'force-dynamic';


import Image from 'next/image';
import { useRouter } from 'next/navigation'
import React, { useState } from 'react';
import { prisma } from '@/lib/prisma';



export function DisplayForm({ display, allStaticAssets, allDynamicAssets }: { display: any, allStaticAssets: Array<any>, allDynamicAssets: Array<any> }) {
    const router = useRouter();
    console.log(display);

    const updateDisplay = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        const formData = new FormData(e.currentTarget);

        const response = await fetch("/api/v1/displays/" + display.mac_adr, {
            method: 'PUT',
            body: formData,
        });
        router.push("/displays");

        if (response.ok) {
            router.push("/displays");
        } else {
            console.log(response.body);
            console.error('Failed to update the asset');
        }
    };

    const removeDisplay = async () => {
        const response = await fetch("/api/v1/displays/" + display.mac_adr, {
            method: 'DELETE',
        });
        router.push("/displays");

        if (response.ok) {
            router.push("/displays");
        } else {
            console.error('Failed to create the asset');
        }
    };

    const setAsset = async (e : any) => {
        const data = {
            "currentAsset": e.target.id,
            "currentAssetType": e.target.type,
        }
        const response = await fetch("/api/v1/displays/" + display.mac_adr, {
            method: 'PUT',
            body: JSON.stringify(data),
            headers: {
                'Content-Type': 'application/json',
            },
        });
        router.push("/displays");

        if (response.ok) {
            router.push("/displays");
        } else {
            console.log(response.body);
            console.error('Failed to update the asset');
        }
    };

    return (
        <div>
            <h2>{display.friendly_name}</h2>
            <div className='display-info-container'>
                Mac Adresse: {display.mac_adr}
                <br />
                Zuletz online: {display.last_seen.toString()}
                <br />
                Aktives Asset: {display.currentAsset}
                <br />
            </div>
            <form onSubmit={updateDisplay}>
                <label htmlFor="friendly_name">Displayname</label>
                <input type="text" name="friendly_name" id="friendly_name" defaultValue={display?.friendly_name ?? ''} />
                <br />
                <label htmlFor="width">Breite</label>
                <input type="number" name="width" id="width" defaultValue={display?.width ?? 0} />
                <br />
                <label htmlFor="height">Höhe</label>
                <input type="number" name="height" defaultValue={display?.height ?? 0} />
                <br />
                <button type="submit">Speichern</button>
            </form>

            <form onSubmit={removeDisplay}>
                <button type="submit">Löschen</button>
            </form>
            <br />
            <h3>Statische Assets:</h3>
            <br />
            <div className='allAssets-container'>
                {allStaticAssets.map((asset) => {
                    return (

                        <div key={asset.id} className='asset-container' id={asset.id} onClick={setAsset} >
                            <Image
                                src={asset.file_path!} // Route of the image file
                                width={160}
                                height={96}
                                alt={asset.friendly_name!}
                                id={asset.id}
                            />
                            {asset.friendly_name}
                        </div>);
                })}
            </div>
            <br />
            <h3>Dynamische Assets:</h3>
            <br />
            <div className='allAssets-container'>
                {allDynamicAssets.map((asset) => {
                    return (
                        <div key={asset.id} className='asset-container' id={asset.id} onClick={setAsset} >
                            <Image
                                src={asset.file_path!} // Route of the image file
                                width={160}
                                height={96}
                                alt={asset.friendly_name!}
                                id={asset.id}
                            />
                            {asset.friendly_name}
                        </div>);
                })}
            </div>
        </div>
    );
}