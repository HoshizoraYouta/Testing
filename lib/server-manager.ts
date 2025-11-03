import { spawn, ChildProcess } from 'child_process';
import fs from 'fs/promises';
import path from 'path';

export interface GameServer {
  id: string;
  name: string;
  game: string;
  port: number;
  status: 'running' | 'stopped' | 'error';
  configPath: string;
  serverPath: string;
  createdAt: string;
  pid?: number;
  startCommand?: string;
}

const SERVERS_DIR = path.join(process.cwd(), 'game-servers');
const CONFIG_FILE = path.join(SERVERS_DIR, 'servers.json');

// Store running processes
const runningProcesses = new Map<string, ChildProcess>();

// Ensure servers directory exists
async function ensureServersDir() {
  try {
    await fs.mkdir(SERVERS_DIR, { recursive: true });
  } catch (error) {
    console.error('Error creating servers directory:', error);
  }
}

// Load servers configuration
export async function loadServers(): Promise<GameServer[]> {
  await ensureServersDir();
  try {
    const data = await fs.readFile(CONFIG_FILE, 'utf-8');
    return JSON.parse(data);
  } catch (error) {
    return [];
  }
}

// Save servers configuration
export async function saveServers(servers: GameServer[]): Promise<void> {
  await ensureServersDir();
  await fs.writeFile(CONFIG_FILE, JSON.stringify(servers, null, 2));
}

// Get server by ID
export async function getServerById(id: string): Promise<GameServer | null> {
  const servers = await loadServers();
  return servers.find(s => s.id === id) || null;
}

// Create new server
export async function createServer(
  name: string,
  game: string,
  port: number,
  startCommand?: string
): Promise<GameServer> {
  await ensureServersDir();
  
  const id = `server-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  const serverPath = path.join(SERVERS_DIR, id);
  
  await fs.mkdir(serverPath, { recursive: true });
  
  const server: GameServer = {
    id,
    name,
    game,
    port,
    status: 'stopped',
    configPath: path.join(serverPath, 'config'),
    serverPath,
    createdAt: new Date().toISOString(),
    startCommand,
  };
  
  const servers = await loadServers();
  servers.push(server);
  await saveServers(servers);
  
  return server;
}

// Update server configuration
export async function updateServer(id: string, updates: Partial<GameServer>): Promise<GameServer | null> {
  const servers = await loadServers();
  const index = servers.findIndex(s => s.id === id);
  
  if (index === -1) return null;
  
  servers[index] = { ...servers[index], ...updates };
  await saveServers(servers);
  
  return servers[index];
}

// Delete server
export async function deleteServer(id: string): Promise<boolean> {
  const server = await getServerById(id);
  if (!server) return false;
  
  // Stop if running
  if (server.status === 'running') {
    await stopServer(id);
  }
  
  // Delete directory
  try {
    await fs.rm(server.serverPath, { recursive: true, force: true });
  } catch (error) {
    console.error('Error deleting server directory:', error);
  }
  
  // Remove from config
  const servers = await loadServers();
  const filtered = servers.filter(s => s.id !== id);
  await saveServers(filtered);
  
  return true;
}

// Start server
export async function startServer(id: string): Promise<boolean> {
  const server = await getServerById(id);
  if (!server || !server.startCommand) return false;
  
  if (server.status === 'running') return true;
  
  try {
    const process = spawn(server.startCommand, {
      cwd: server.serverPath,
      shell: true,
      detached: true,
      stdio: ['ignore', 'pipe', 'pipe'],
    });
    
    // Store process
    runningProcesses.set(id, process);
    
    // Update status
    await updateServer(id, { status: 'running', pid: process.pid });
    
    // Handle process exit
    process.on('exit', async () => {
      runningProcesses.delete(id);
      await updateServer(id, { status: 'stopped', pid: undefined });
    });
    
    return true;
  } catch (error) {
    console.error('Error starting server:', error);
    await updateServer(id, { status: 'error' });
    return false;
  }
}

// Stop server
export async function stopServer(id: string): Promise<boolean> {
  const server = await getServerById(id);
  if (!server) return false;
  
  const process = runningProcesses.get(id);
  if (process && !process.killed) {
    process.kill('SIGTERM');
    runningProcesses.delete(id);
    await updateServer(id, { status: 'stopped', pid: undefined });
    return true;
  }
  
  return false;
}

// Get server logs
export async function getServerLogs(id: string, lines: number = 100): Promise<string[]> {
  const server = await getServerById(id);
  if (!server) return [];
  
  const logPath = path.join(server.serverPath, 'server.log');
  
  try {
    const content = await fs.readFile(logPath, 'utf-8');
    const allLines = content.split('\n').filter(line => line.trim());
    return allLines.slice(-lines);
  } catch (error) {
    return [];
  }
}

// List files in server directory
export async function listServerFiles(id: string, subPath: string = ''): Promise<any[]> {
  const server = await getServerById(id);
  if (!server) return [];
  
  const fullPath = path.join(server.serverPath, subPath);
  
  // Security check: ensure path is within server directory
  if (!fullPath.startsWith(server.serverPath)) {
    throw new Error('Invalid path');
  }
  
  try {
    const entries = await fs.readdir(fullPath, { withFileTypes: true });
    
    return Promise.all(
      entries.map(async entry => {
        const entryPath = path.join(fullPath, entry.name);
        const stats = await fs.stat(entryPath);
        
        return {
          name: entry.name,
          path: path.relative(server.serverPath, entryPath),
          isDirectory: entry.isDirectory(),
          size: stats.size,
          modified: stats.mtime,
        };
      })
    );
  } catch (error) {
    return [];
  }
}

// Read file content
export async function readServerFile(id: string, filePath: string): Promise<string | null> {
  const server = await getServerById(id);
  if (!server) return null;
  
  const fullPath = path.join(server.serverPath, filePath);
  
  // Security check
  if (!fullPath.startsWith(server.serverPath)) {
    throw new Error('Invalid path');
  }
  
  try {
    return await fs.readFile(fullPath, 'utf-8');
  } catch (error) {
    return null;
  }
}
