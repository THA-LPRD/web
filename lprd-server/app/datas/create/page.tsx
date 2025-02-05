'use client';
export const dynamic = 'force-dynamic';
import { useRouter } from 'next/navigation'

// import { useRouter } from 'next/navigation'

export  default async function ShowDataDetails() {
    const router = useRouter();
    
    const createData = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        const formData = new FormData(e.currentTarget);

        const response = await fetch('/api/v1/datas', {
            method: 'PUT',
            body: formData, //JSON.stringify(body),
        });

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
            <h2>Create new Data</h2>
            <form onSubmit={createData}>
                <label htmlFor="friendly_name">ID</label>
                <input type="text" name="id" id="id"/>
                {/* <br />
                <input type="text" name="outdated_at" id="outdated_at"/> */}
                <br />
                <label htmlFor="json">JSON</label>
                <br />
                <textarea name="json" id="json" rows={20} cols={97}/>
                < br />
                <button type="submit">Speichern</button>
            </form>
        </div>
    );
}