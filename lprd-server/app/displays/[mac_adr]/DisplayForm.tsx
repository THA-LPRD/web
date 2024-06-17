'use client';

import Image from 'next/image';
import { useRouter } from 'next/navigation'
import React, { useState } from 'react';
import { prisma } from '@/lib/prisma';



export function DisplayForm({ display, allAssets }: { display: any, allAssets: Array<any> }) {
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

    const setAsset = async (e) => {
        const data = {
            "currentAsset": e.target.id,
            "currentAssetType": "static",
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

    const setDynamicAsset = async (e) => {
        const data = {
            "currentAsset": e.target.id,
            "currentAssetType": "dynamic",
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
            {display.mac_adr}
            <br />
            {display.last_seen.toString()}
            <br />
            CA: {display.currentAsset}
            <br />
            <form onSubmit={updateDisplay}>
                <input type="text" name="friendly_name" id="friendly_name" defaultValue={display?.friendly_name ?? ''} />
                <input type="number" name="width" id="width" defaultValue={display?.width ?? 0} />
                <input type="number" name="height" defaultValue={display?.height ?? 0} />
                <button type="submit">Speichern</button>
            </form>

            <form onSubmit={removeDisplay}>
                <button type="submit">Löschen</button>
            </form>
            <br />
            Statische Assets:
            <br />
            {allAssets.map((asset) => {
                return (
                    <div id={asset.id} onClick={setAsset} >
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
            <br />
            Dynamische Assets:
            <br />
            <div id="projectday" onClick={setDynamicAsset}>
                <Image
                    src="/uploads/projectday.png" // Route of the image file
                    width={160}
                    height={96}
                    alt="Projectday"
                    id="projectday"
                />
                Projectday
            </div>
        </div>
    );
}