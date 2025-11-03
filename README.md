# Game Server Manager

A modern web application for managing game servers deployed on your local machine. Built with Next.js, TypeScript, and Tailwind CSS.

## Features

### 🎮 Server Management
- **Create Servers**: Set up new game servers with customizable configurations
- **Configure Servers**: Update server settings including name, game type, port, and start commands
- **Start/Stop Control**: Manage server lifecycle directly from the dashboard
- **Delete Servers**: Remove servers and their associated files

### 📦 File Management
- **Upload Files**: Direct file upload to server directories
- **ZIP Support**: Automatic extraction of ZIP packages
- **URL Downloads**: Download and extract server files from URLs
- **File Explorer**: Browse server directories and view file contents

### 📊 Monitoring
- **Server Dashboard**: View all servers with status indicators
- **Filtering**: Filter servers by status (running/stopped/error) and game type
- **Live Logs**: View server logs with configurable line count
- **Auto-refresh**: Automatic log updates for real-time monitoring

## Screenshots

### Dashboard
![Dashboard](https://github.com/user-attachments/assets/09094f20-1963-4af7-a70c-c51086226271)

### Create New Server
![Create Server](https://github.com/user-attachments/assets/16d5e246-3399-4c10-aed7-e8c3c8a01a2a)

### Server List
![Server List](https://github.com/user-attachments/assets/9f3f0a65-a6d6-41a4-9227-cb3a47a68839)

### Configure Server
![Configure](https://github.com/user-attachments/assets/7b4a174b-809a-4447-a2cc-7d01fafb719c)

### Server Logs
![Logs](https://github.com/user-attachments/assets/5c859a6b-7e50-4be6-a4df-aea7d9060159)

## Getting Started

### Prerequisites
- Node.js 18 or higher
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone https://github.com/HoshizoraYouta/Testing.git
cd Testing
```

2. Install dependencies:
```bash
npm install
```

3. Run the development server:
```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser

### Production Build

```bash
npm run build
npm start
```

## Usage

### Creating a Server

1. Click "Create New Server" on the dashboard
2. Fill in the server details:
   - **Server Name**: A friendly name for your server
   - **Game**: The game type (e.g., Minecraft, Counter-Strike)
   - **Port**: The port number the server will run on
   - **Start Command** (optional): The command to start the server
3. Click "Create Server"

### Configuring a Server

1. Click "Configure" on any server in the dashboard
2. Update server settings as needed
3. Upload server files:
   - Choose "Upload File" to upload directly from your computer
   - Choose "Download from URL" to download files from a URL
   - ZIP files are automatically extracted
4. Click "Save Changes" to apply updates

### Managing Servers

- **Start**: Click "Start" to run the server (requires start command)
- **Stop**: Click "Stop" to terminate a running server
- **Logs**: View server output and errors
- **Files**: Browse and view server files
- **Delete**: Remove the server and all its files (requires confirmation)

### Viewing Logs

1. Click "Logs" on any server
2. Use the dropdown to change the number of lines displayed
3. Enable "Auto-refresh" for live log updates
4. Click "Refresh" to manually reload logs

### Exploring Files

1. Click "Files" on any server
2. Click on folders to navigate
3. Click on files to view their contents
4. Use "Go Up" to navigate to parent directories

## Technical Stack

- **Framework**: Next.js 16 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI**: React 19
- **Process Management**: Node.js child_process
- **File System**: Node.js fs/promises

## Project Structure

```
├── app/
│   ├── api/
│   │   └── servers/        # API routes for server operations
│   ├── configure/[id]/     # Server configuration page
│   ├── create/             # Create server page
│   ├── files/[id]/         # File explorer page
│   ├── logs/[id]/          # Server logs page
│   ├── page.tsx            # Dashboard
│   ├── layout.tsx          # Root layout
│   └── globals.css         # Global styles
├── lib/
│   └── server-manager.ts   # Server management logic
└── game-servers/           # Server data directory (created at runtime)
```

## API Endpoints

- `POST /api/servers/create` - Create a new server
- `GET /api/servers/list` - List all servers with optional filters
- `POST /api/servers/configure` - Update, start, stop, or delete a server
- `GET /api/servers/logs` - Get server logs
- `GET /api/servers/files` - List files or read file content
- `POST /api/servers/upload` - Upload files or download from URL

## Security Considerations

- Server files are stored in isolated directories
- Path traversal protection prevents access outside server directories
- File operations are validated before execution
- Process management is isolated per server

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

ISC