import { NextResponse } from 'next/server';

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
  return NextResponse.json(displays);
}