import { NextResponse } from 'next/server';
import { listServerFiles, readServerFile } from '@/lib/server-manager';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const serverId = searchParams.get('serverId');
    const subPath = searchParams.get('path') || '';
    const readFile = searchParams.get('readFile');
    
    if (!serverId) {
      return NextResponse.json(
        { error: 'Missing server ID' },
        { status: 400 }
      );
    }
    
    if (readFile) {
      const content = await readServerFile(serverId, readFile);
      if (content === null) {
        return NextResponse.json(
          { error: 'File not found' },
          { status: 404 }
        );
      }
      return NextResponse.json({ content });
    }
    
    const files = await listServerFiles(serverId, subPath);
    
    return NextResponse.json({ files });
  } catch (error) {
    console.error('Error accessing server files:', error);
    return NextResponse.json(
      { error: 'Failed to access server files' },
      { status: 500 }
    );
  }
}
