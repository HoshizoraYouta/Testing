import { NextResponse } from 'next/server';
import { loadServers } from '@/lib/server-manager';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const statusFilter = searchParams.get('status');
    const gameFilter = searchParams.get('game');
    
    let servers = await loadServers();
    
    // Apply filters
    if (statusFilter) {
      servers = servers.filter(s => s.status === statusFilter);
    }
    
    if (gameFilter) {
      servers = servers.filter(s => s.game.toLowerCase().includes(gameFilter.toLowerCase()));
    }
    
    return NextResponse.json({ servers });
  } catch (error) {
    console.error('Error listing servers:', error);
    return NextResponse.json(
      { error: 'Failed to list servers' },
      { status: 500 }
    );
  }
}
