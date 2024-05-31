import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// Dummy data
const displays = [
  {
    mac_adr: '11DEADBEEF11',
    friendly_name: 'J1.01',
  },
  {
    mac_adr: '22DEADBEEF22',
    friendly_name: 'J1.19',
  },
  {
    mac_adr: '33DEADBEEF33',
    friendly_name: 'J2.18',
  },
];

export async function GET() {
    const displays = await prisma.display.findMany();

    return NextResponse.json(displays);
    //return NextResponse.json(displays);
  
}