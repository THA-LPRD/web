'use client';
export const dynamic = 'force-dynamic';
import { useRouter } from 'next/navigation'

// import { useRouter } from 'next/navigation'

export  default async function showTemplateDetails() {
    const router = useRouter();
    
    const createTemplate = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        const formData = new FormData(e.currentTarget);

        const response = await fetch('/api/v1/templates', {
            method: 'PUT',
            body: formData, //JSON.stringify(body),
        });

        if (response.ok) {
            router.push("/templates");
        } else {
            console.error('Failed to create the template');
        }
    };

    return (
        <div>
            <h2>Create new Template</h2>
            <form onSubmit={createTemplate}>
                <label htmlFor="friendly_name">Templatename</label>
                <input type="text" name="friendly_name" />
                <label htmlFor="html">HTML</label>
                <textarea rows={20} cols={97} name="html" /*onInput={}*/ />
                <button type="submit">Speichern</button>
            </form>
        </div>
    );
}