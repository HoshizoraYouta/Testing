'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function ServerLogs({ params }: { params: Promise<{ id: string }> }) {
  const [serverId, setServerId] = useState<string>('');
  const [logs, setLogs] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [autoRefresh, setAutoRefresh] = useState(false);
  const [lines, setLines] = useState('100');

  useEffect(() => {
    params.then(p => {
      setServerId(p.id);
      fetchLogs(p.id, '100');
    });
  }, []);

  const fetchLogs = async (id: string = serverId, numLines: string = lines) => {
    if (!id) return;
    try {
      const response = await fetch(`/api/servers/logs?serverId=${id}&lines=${numLines}`);
      const data = await response.json();
      setLogs(data.logs || []);
    } catch (error) {
      console.error('Error fetching logs:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (serverId) {
      fetchLogs(serverId, lines);
    }
  }, [lines, serverId]);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (autoRefresh && serverId) {
      interval = setInterval(() => fetchLogs(serverId, lines), 2000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [autoRefresh, lines]);

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

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow">
          <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Server Logs</h2>
            <div className="flex items-center space-x-4">
              <div className="flex items-center">
                <label className="text-sm text-gray-700 dark:text-gray-300 mr-2">Lines:</label>
                <select
                  value={lines}
                  onChange={(e) => setLines(e.target.value)}
                  className="px-2 py-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white text-sm"
                >
                  <option value="50">50</option>
                  <option value="100">100</option>
                  <option value="500">500</option>
                  <option value="1000">1000</option>
                </select>
              </div>
              <label className="flex items-center text-sm text-gray-700 dark:text-gray-300">
                <input
                  type="checkbox"
                  checked={autoRefresh}
                  onChange={(e) => setAutoRefresh(e.target.checked)}
                  className="mr-2"
                />
                Auto-refresh
              </label>
              <button
                onClick={() => fetchLogs(serverId, lines)}
                className="px-3 py-1 bg-blue-600 text-white rounded-md hover:bg-blue-700 text-sm"
              >
                Refresh
              </button>
            </div>
          </div>

          <div className="p-6">
            {loading ? (
              <div className="text-center text-gray-500 dark:text-gray-400">Loading logs...</div>
            ) : logs.length === 0 ? (
              <div className="text-center text-gray-500 dark:text-gray-400">
                No logs available. Start the server to see logs.
              </div>
            ) : (
              <div className="bg-gray-900 text-green-400 p-4 rounded-md font-mono text-sm overflow-auto max-h-[70vh]">
                {logs.map((log, index) => (
                  <div key={index} className="whitespace-pre-wrap break-all">
                    {log}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
