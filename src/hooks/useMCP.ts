import { useEffect, useState, useCallback } from 'react';
import { Client } from '@modelcontextprotocol/sdk/client/index.js';
import { SSEClientTransport } from '@modelcontextprotocol/sdk/client/sse.js';

/**
 * Hook untuk mengintegrasikan Model Context Protocol (MCP) di Frontend UIS-OTAK.
 * Memungkinkan aplikasi untuk berinteraksi langsung dengan tool-tool intelijen pasar.
 */
export const useMCP = () => {
  const [client, setClient] = useState<Client | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [tools, setTools] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);

  const connect = useCallback(async () => {
    try {
      const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api/v1';
      const sseUrl = new URL(`${baseUrl}/mcp/sse`);
      
      const transport = new SSEClientTransport(sseUrl);
      const mcpClient = new Client(
        {
          name: "uis-otak-frontend",
          version: "1.0.0",
        },
        {
          capabilities: {
            prompts: {},
            resources: {},
            tools: {},
          },
        }
      );

      await mcpClient.connect(transport);
      
      // Ambil daftar tool yang tersedia
      const { tools: availableTools } = await mcpClient.listTools();
      
      setClient(mcpClient);
      setTools(availableTools);
      setIsConnected(true);
      setError(null);
      console.log('✅ Connected to MCP Server via SSE');
    } catch (err: any) {
      setError(err.message);
      setIsConnected(false);
      console.error('❌ Failed to connect to MCP Server:', err);
    }
  }, []);

  const disconnect = useCallback(async () => {
    if (client) {
      await client.close();
      setClient(null);
      setIsConnected(false);
    }
  }, [client]);

  const callTool = useCallback(async (name: string, args: any) => {
    if (!client) throw new Error('MCP Client not connected');
    return await client.callTool({
      name,
      arguments: args,
    });
  }, [client]);

  useEffect(() => {
    // connect(); // Uncomment to connect on mount
    return () => {
      disconnect();
    };
  }, []);

  return {
    client,
    isConnected,
    tools,
    error,
    connect,
    disconnect,
    callTool
  };
};
