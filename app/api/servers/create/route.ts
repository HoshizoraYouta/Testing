import { NextResponse } from 'next/server';
import { createServer } from '@/lib/server-manager';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, game, port, startCommand } = body;
    
    if (!name || !game || !port) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }
    
    const server = await createServer(name, game, port, startCommand);
    
    return NextResponse.json({ success: true, server });
  } catch (error) {
    console.error('Error creating server:', error);
    return NextResponse.json(
      { error: 'Failed to create server' },
      { status: 500 }
    );
  }
}
