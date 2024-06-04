'use client';

import Image from 'next/image';
import { useRouter } from 'next/navigation'
import React, { useState } from 'react';


export function DisplayForm({ display, allAssets }: any) {
    const router = useRouter();

    const updateDisplay = async (e : React.FormEvent<HTMLFormElement>) => {
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

    // mac_adr         String  @id @unique
    // friendly_name   String?
    // width           Int
    // height          Int
    // colordepth      Int
    // colors          String[] // Saved in HEX-Format
    // last_seen       DateTime?
    // currentAsset    String?

    return (
        <div>
            {display.mac_adr}
            {display.last_seen}
            CA: {display.currentAsset}
            <form onSubmit={updateDisplay}> 
                <input type="text" name="friendly_name" defaultValue={display?.friendly_name ?? ''} />
                <input type="number" name="width" defaultValue={display?.width ?? 0} />
                <input type="number" name="height" defaultValue={display?.height ?? 0} />
                <input type="number" name="colordepth" defaultValue={display?.colordepth ?? 0} />
                <button type="submit">Speichern</button>
            </form>

            <form onSubmit={removeDisplay}>
                <button type="submit">Löschen</button>
            </form>

            Assets:
             { allAssets.map((asset) => {
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
        </div>
    );
}