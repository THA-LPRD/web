'use client';
export const dynamic = 'force-dynamic';

import Image from 'next/image';
import { useRouter } from 'next/navigation'
import React, { useState } from 'react';


export function TemplateForm({ template }: any) {
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

    const updateTemplate = async (e : React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        const formData = new FormData(e.currentTarget);

        const response = await fetch("/api/v1/templates/" + template.id, {
            method: 'PUT',
            body: formData,
        });
        router.push("/templates");
        
        if (response.ok) {
            router.push("/templates");
        } else {
            console.log(response.body);
            console.error('Failed to update the template');
        }
    };
    
    const removeTemplate = async () => {
        const response = await fetch("/api/v1/templates/" + template.id, {
            method: 'DELETE',
        });
        router.push("/templates");
        
        if (response.ok) {
            router.push("/templates");
        } else {
            console.error('Failed to create the template');
        }
    };

    return (
        <div>
            <h2>{template.friendly_name}</h2>
            <h3>Details</h3>
            <form onSubmit={updateTemplate}>
                <label htmlFor="friendly_name">Templatename</label>
                <input type="text" name="friendly_name" id="friendly_name" defaultValue={template?.friendly_name ?? ''} />
                <br />
                <label htmlFor="html">HTML</label>
                <br />
                <textarea name="html" id="html" rows={20} cols={97} onInput={handleChange} onPaste={handleChange} defaultValue={template?.html ?? ''} />
                < br />
                HTML Live Vorschau
                <div style={{width: '800px', height: '480px;'}} dangerouslySetInnerHTML={{__html: formData.html}}/>
                <button type="submit">Speichern</button>
            </form>

            <form onSubmit={removeTemplate}>
                <button type="submit">Löschen</button>
            </form>
        </div>
    );
}