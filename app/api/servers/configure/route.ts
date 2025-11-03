import { NextResponse } from 'next/server';
import { updateServer, startServer, stopServer, deleteServer } from '@/lib/server-manager';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { serverId, action, updates } = body;
    
    if (!serverId) {
      return NextResponse.json(
        { error: 'Missing server ID' },
        { status: 400 }
      );
    }
    
    switch (action) {
      case 'update':
        if (!updates) {
          return NextResponse.json(
            { error: 'Missing updates' },
            { status: 400 }
          );
        }
        const updatedServer = await updateServer(serverId, updates);
        return NextResponse.json({ success: true, server: updatedServer });
        
      case 'start':
        const started = await startServer(serverId);
        return NextResponse.json({ success: started });
        
      case 'stop':
        const stopped = await stopServer(serverId);
        return NextResponse.json({ success: stopped });
        
      case 'delete':
        const deleted = await deleteServer(serverId);
        return NextResponse.json({ success: deleted });
        
      default:
        return NextResponse.json(
          { error: 'Invalid action' },
          { status: 400 }
        );
    }
  } catch (error) {
    console.error('Error configuring server:', error);
    return NextResponse.json(
      { error: 'Failed to configure server' },
      { status: 500 }
    );
  }
}
