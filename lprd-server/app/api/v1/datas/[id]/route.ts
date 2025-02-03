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
      // Starte den npx-Prozess
      const process = spawn('npx', ['tsx', 'scheduler/prepareJSONAssets.ts'], {
        // detached: false,
        // stdio: ['ignore', 'pipe', 'pipe'] 
        detached: true, // Prozess läuft unabhängig vom Parent
        stdio: 'ignore' // Ignoriere Standard I/O streams
    });

  //   // Logging für stdout
  //   process.stdout.on('data', (data) => {
  //     const output = data.toString();
  //     // logStream.write(`[STDOUT] ${output}`);
  //     console.log(`[NPX] ${output}`);
  // });

  // // Logging für stderr
  // process.stderr.on('data', (data) => {
  //     const output = data.toString();
  //     // logStream.write(`[STDERR] ${output}`);
  //     console.error(`[NPX] Error: ${output}`);
  // });

  // // Log wenn Prozess beendet
  // process.on('close', (code) => {
  //     console.log(`[NPX] Prozess beendet mit Code ${code}`);
  // });

    // Entkopple den Prozess vom Parent
    process.unref();

    // Gib sofort eine Antwort zurück
    return NextResponse.json({ 
        success: true,
        message: 'Prozess gestartet',
        pid: process.pid 
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