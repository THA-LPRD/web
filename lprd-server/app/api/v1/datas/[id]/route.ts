export const dynamic = 'force-dynamic';
import { NextRequest, NextResponse } from 'next/server';
import { revalidatePath } from "next/cache";
import { prisma } from '@/lib/prisma';
import { Worker } from 'worker_threads';
import { resolve } from 'path';
import { fileURLToPath } from 'url';
import path from 'path';
import { spawn } from 'child_process';
import { exec } from 'child_process';
import { promisify } from 'util';

export async function GET(request: Request) {
    // Get one specific Data
    const url = new URL(request.url);
    const id = url.pathname.split("/").slice(-1)[0];

    const oneData = await prisma.data.findUnique({
        where: {
            id: id!,
        }
    });

    return NextResponse.json(oneData);
}

// Wandele exec in eine Promise-basierte Funktion um
const execAsync = promisify(exec);

export async function PUT(request: Request) {
    // Update a specific Data
    const url = new URL(request.url);
    const id = url.pathname.split("/").slice(-1)[0];

    const formData = await request.formData();
    

    // const friendly_name_input = formData.get('friendly_name')! as string;
    const jsonString = formData.get('json') as string;
    const jsonObject = JSON.parse(jsonString);

    const updatedData = await prisma.data.update({
        where: {
            id: id,
        },
        data: {
            id: formData.get('id')! as string,
            json: jsonObject,
            // outdated_at: parseInt(formData.get('outdated_at')! as string),
        },
    });

    try {
      // Pfad zum C-Programm (relativ zum Projektroot)
      const programPath = path.join('npx');

      // Führe Programm mit Argumenten aus
      const { stdout, stderr } = await execAsync(`${programPath} tsx scheduler/preparePresenceAssets.ts`);
      
      if (stderr) {
          console.error('Stderr:', stderr);
          return NextResponse.json({ 
            success: true,
            output: stdout 
        });
      }
      
      return NextResponse.json({ 
          success: true,
          output: stdout 
      });
      
  } catch (error) {
      console.error('Error:', error);
      return NextResponse.json(
          { error: 'Interner Server Fehler' },
          { status: 500 }
      );
  }
}

// Konfiguration für die API-Route
export const runtime = 'nodejs'; // Verwende Node.js Runtime

export async function DELETE(request: Request) {
    // Delete a specific Data
    const url = new URL(request.url);
    const id = url.pathname.split("/").slice(-1)[0];
    
    const oneData = await prisma.data.findUnique({
        where: {
            id: id!,
        }
    });
    
    await prisma.data.delete({
        where: {
            id: oneData!.id,
        },
    });

    revalidatePath("/datas");
    return NextResponse.json({ message: 'Removed Data' }, { status: 200 });
}