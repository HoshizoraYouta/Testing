import { NextResponse } from 'next/server';
import { getServerLogs } from '@/lib/server-manager';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const serverId = searchParams.get('serverId');
    const lines = parseInt(searchParams.get('lines') || '100');
    
    if (!serverId) {
      return NextResponse.json(
        { error: 'Missing server ID' },
        { status: 400 }
      );
    }
    
    const logs = await getServerLogs(serverId, lines);
    
    return NextResponse.json({ logs });
  } catch (error) {
    console.error('Error getting server logs:', error);
    return NextResponse.json(
      { error: 'Failed to get server logs' },
      { status: 500 }
    );
  }
}
