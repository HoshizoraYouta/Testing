'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

interface FileEntry {
  name: string;
  path: string;
  isDirectory: boolean;
  size: number;
  modified: string;
}

export default function ServerFiles({ params }: { params: Promise<{ id: string }> }) {
  const [serverId, setServerId] = useState<string>('');
  const [files, setFiles] = useState<FileEntry[]>([]);
  const [currentPath, setCurrentPath] = useState('');
  const [loading, setLoading] = useState(true);
  const [fileContent, setFileContent] = useState<string | null>(null);
  const [viewingFile, setViewingFile] = useState<string | null>(null);

  useEffect(() => {
    params.then(p => {
      setServerId(p.id);
      fetchFiles(p.id, '');
    });
  }, []);

  const fetchFiles = async (id: string = serverId, path: string = '') => {
    if (!id) return;
    setLoading(true);
    try {
      const response = await fetch(
        `/api/servers/files?serverId=${id}&path=${encodeURIComponent(path)}`
      );
      const data = await response.json();
      setFiles(data.files || []);
      setCurrentPath(path);
    } catch (error) {
      console.error('Error fetching files:', error);
    } finally {
      setLoading(false);
    }
  };

  const viewFile = async (filePath: string) => {
    if (!serverId) return;
    try {
      const response = await fetch(
        `/api/servers/files?serverId=${serverId}&readFile=${encodeURIComponent(filePath)}`
      );
      const data = await response.json();
      setFileContent(data.content || 'Unable to read file');
      setViewingFile(filePath);
    } catch (error) {
      console.error('Error reading file:', error);
      setFileContent('Error reading file');
    }
  };

  const handleNavigate = (entry: FileEntry) => {
    if (entry.isDirectory) {
      fetchFiles(serverId, entry.path);
    } else {
      viewFile(entry.path);
    }
  };

  const handleGoUp = () => {
    const parts = currentPath.split('/').filter(p => p);
    parts.pop();
    fetchFiles(serverId, parts.join('/'));
  };

  const formatSize = (bytes: number) => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(2) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(2) + ' MB';
  };

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900">
      <nav className="bg-white dark:bg-gray-800 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <Link href="/" className="text-2xl font-bold text-gray-900 dark:text-white">
                Game Server Manager
              </Link>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6">
          <Link href="/" className="text-blue-600 hover:text-blue-700 dark:text-blue-400">
            ← Back to Servers
          </Link>
        </div>

        {viewingFile ? (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow">
            <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                {viewingFile}
              </h2>
              <button
                onClick={() => {
                  setViewingFile(null);
                  setFileContent(null);
                }}
                className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700"
              >
                Close
              </button>
            </div>
            <div className="p-6">
              <pre className="bg-gray-900 text-gray-100 p-4 rounded-md overflow-auto max-h-[70vh] text-sm">
                {fileContent}
              </pre>
            </div>
          </div>
        ) : (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow">
            <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
              <div>
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                  Server Files
                </h2>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                  Current path: /{currentPath || 'root'}
                </p>
              </div>
              {currentPath && (
                <button
                  onClick={handleGoUp}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                >
                  ← Go Up
                </button>
              )}
            </div>

            <div className="p-6">
              {loading ? (
                <div className="text-center text-gray-500 dark:text-gray-400">Loading files...</div>
              ) : files.length === 0 ? (
                <div className="text-center text-gray-500 dark:text-gray-400">
                  No files found in this directory.
                </div>
              ) : (
                <div className="space-y-2">
                  {files.map((file, index) => (
                    <div
                      key={index}
                      onClick={() => handleNavigate(file)}
                      className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-md hover:bg-gray-100 dark:hover:bg-gray-600 cursor-pointer"
                    >
                      <div className="flex items-center space-x-3">
                        <span className="text-2xl">
                          {file.isDirectory ? '📁' : '📄'}
                        </span>
                        <div>
                          <div className="font-medium text-gray-900 dark:text-white">
                            {file.name}
                          </div>
                          {!file.isDirectory && (
                            <div className="text-sm text-gray-500 dark:text-gray-400">
                              {formatSize(file.size)}
                            </div>
                          )}
                        </div>
                      </div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">
                        {new Date(file.modified).toLocaleString()}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
