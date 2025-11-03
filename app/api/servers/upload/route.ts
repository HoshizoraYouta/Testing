import { NextRequest, NextResponse } from 'next/server';
import { getServerById } from '@/lib/server-manager';
import path from 'path';
import fs from 'fs/promises';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const serverId = formData.get('serverId') as string;
    const file = formData.get('file') as File;
    const url = formData.get('url') as string;
    
    if (!serverId) {
      return NextResponse.json(
        { error: 'Missing server ID' },
        { status: 400 }
      );
    }
    
    const server = await getServerById(serverId);
    if (!server) {
      return NextResponse.json(
        { error: 'Server not found' },
        { status: 404 }
      );
    }
    
    // Handle file upload
    if (file) {
      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);
      
      // If it's a zip file, extract it
      if (file.name.endsWith('.zip')) {
        const zipPath = path.join('/tmp', `upload-${Date.now()}.zip`);
        await fs.writeFile(zipPath, buffer);
        
        // Extract zip to server directory
        const { execSync } = require('child_process');
        execSync(`unzip -o "${zipPath}" -d "${server.serverPath}"`, { stdio: 'inherit' });
        
        // Clean up
        await fs.unlink(zipPath);
      } else {
        // Save single file
        const filePath = path.join(server.serverPath, file.name);
        await fs.writeFile(filePath, buffer);
      }
      
      return NextResponse.json({ success: true, message: 'File uploaded successfully' });
    }
    
    // Handle URL download
    if (url) {
      const response = await fetch(url);
      if (!response.ok) {
        return NextResponse.json(
          { error: 'Failed to download file from URL' },
          { status: 400 }
        );
      }
      
      const buffer = Buffer.from(await response.arrayBuffer());
      const fileName = path.basename(new URL(url).pathname) || 'download.zip';
      
      if (fileName.endsWith('.zip')) {
        const zipPath = path.join('/tmp', `download-${Date.now()}.zip`);
        await fs.writeFile(zipPath, buffer);
        
        // Extract zip to server directory
        const { execSync } = require('child_process');
        execSync(`unzip -o "${zipPath}" -d "${server.serverPath}"`, { stdio: 'inherit' });
        
        // Clean up
        await fs.unlink(zipPath);
      } else {
        const filePath = path.join(server.serverPath, fileName);
        await fs.writeFile(filePath, buffer);
      }
      
      return NextResponse.json({ success: true, message: 'File downloaded successfully' });
    }
    
    return NextResponse.json(
      { error: 'No file or URL provided' },
      { status: 400 }
    );
  } catch (error) {
    console.error('Error uploading file:', error);
    return NextResponse.json(
      { error: 'Failed to upload file' },
      { status: 500 }
    );
  }
}
