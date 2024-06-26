import { NextRequest, NextResponse } from 'next/server';
import { revalidatePath } from "next/cache";
import { prisma } from '@/lib/prisma';
import nodeHtmlToImage from 'node-html-to-image'
import fs from "node:fs/promises";

export async function Generate(type: String) {
    // Get one specific Asset
    //const url = new URL(request.url);
    //const type = url.pathname.split("/").slice(-1)[0];

    const htmlContent = await fs.readFile("./components/html_templates/THA_Timetable_2.html");

    switch (type) {
        case 'projectday': {
            const file_path = "/uploads/projectday.png";
            await nodeHtmlToImage({
                output: "./public" + file_path,
                html: htmlContent.toString(),
                //content: { name: 'Mario' }
              })
                .then(() => console.log('The image was created successfully!'))

            return { file_path: file_path, valid_for: 900 };
        }
        // default: {
        //     return NextResponse.error(new Error('No type provided'), { status: 400 });
        // }
    }
}