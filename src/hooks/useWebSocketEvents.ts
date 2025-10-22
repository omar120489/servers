import { useCallback, useEffect, useRef, useState } from 'react';
import { io, Socket } from 'socket.io-client';

type WebSocketEventHandler = (data: unknown) => void;

interface UseWebSocketEventsResult {
  connected: boolean;
  subscribe: (event: string, handler: WebSocketEventHandler) => () => void;
  emit: (event: string, data?: unknown) => void;
  disconnect: () => void;
}

// Singleton socket instance
let socketInstance: Socket | null = null;
let connectionCount = 0;

/**
 * Derive WebSocket URL from HTTP API URL
 * http://localhost:8787 → ws://localhost:8787
 * https://api.example.com → wss://api.example.com
 */
function getWebSocketUrl(): string {
  // Allow override via env
  const envWsUrl = import.meta.env.VITE_APP_WS_URL;
  if (envWsUrl) {
    return envWsUrl;
  }

  // Derive from HTTP API URL
  const apiUrl = import.meta.env.VITE_APP_API_URL || 'http://localhost:8787';
  const url = new URL(apiUrl);
  const wsProtocol = url.protocol === 'https:' ? 'wss:' : 'ws:';
  return `${wsProtocol}//${url.host}`;
}

/**
 * Get or create the singleton socket connection
 */
function getSocket(): Socket {
  if (!socketInstance) {
    const wsUrl = getWebSocketUrl();
    socketInstance = io(wsUrl, {
      transports: ['websocket', 'polling'],
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,
      reconnectionAttempts: Infinity
    });

    // Log connection events in development
    if (import.meta.env.DEV) {
      socketInstance.on('connect', () => {
        console.log('[WebSocket] Connected to', wsUrl);
      });

      socketInstance.on('disconnect', (reason) => {
        console.log('[WebSocket] Disconnected:', reason);
      });

      socketInstance.on('connect_error', (error) => {
        console.error('[WebSocket] Connection error:', error.message);
      });
    }
  }
  return socketInstance;
}

/**
 * Hook to manage WebSocket connection and event subscriptions
 *
 * Features:
 * - Singleton connection (shared across all components using this hook)
 * - Auto-connect on mount
 * - Auto-reconnect on disconnect
 * - Subscribe/unsubscribe to events with stable handlers
 * - Clean up on unmount
 *
 * @example
 * ```tsx
 * const { connected, subscribe } = useWebSocketEvents();
 *
 * useEffect(() => {
 *   const unsubscribe = subscribe('comment:new', (data) => {
 *     console.log('New comment:', data);
 *   });
 *   return unsubscribe;
 * }, [subscribe]);
 * ```
 */
export function useWebSocketEvents(): UseWebSocketEventsResult {
  const [connected, setConnected] = useState(false);
  const socketRef = useRef<Socket | null>(null);
  const handlersRef = useRef<Map<string, Set<WebSocketEventHandler>>>(new Map());

  // Initialize socket connection
  useEffect(() => {
    connectionCount++;
    const socket = getSocket();
    socketRef.current = socket;

    // Update connected state
    const handleConnect = () => setConnected(true);
    const handleDisconnect = () => setConnected(false);

    socket.on('connect', handleConnect);
    socket.on('disconnect', handleDisconnect);

    // Set initial state
    setConnected(socket.connected);

    // Connect if not already connected
    if (!socket.connected) {
      socket.connect();
    }

    return () => {
      connectionCount--;
      socket.off('connect', handleConnect);
      socket.off('disconnect', handleDisconnect);

      // Only disconnect if this is the last component using the socket
      if (connectionCount === 0 && socketInstance) {
        socketInstance.disconnect();
        socketInstance = null;
      }
    };
  }, []);

  /**
   * Subscribe to a WebSocket event
   * Returns an unsubscribe function
   */
  const subscribe = useCallback((event: string, handler: WebSocketEventHandler) => {
    const socket = socketRef.current;
    if (!socket) {
      console.warn('[WebSocket] Cannot subscribe: socket not initialized');
      return () => {};
    }

    // Store handler reference
    if (!handlersRef.current.has(event)) {
      handlersRef.current.set(event, new Set());
    }
    handlersRef.current.get(event)?.add(handler);

    // Create wrapper to avoid stale closures
    const wrapper = (data: unknown) => {
      const handlers = handlersRef.current.get(event);
      if (handlers?.has(handler)) {
        handler(data);
      }
    };

    socket.on(event, wrapper);

    // Return unsubscribe function
    return () => {
      socket.off(event, wrapper);
      const handlers = handlersRef.current.get(event);
      handlers?.delete(handler);
      if (handlers?.size === 0) {
        handlersRef.current.delete(event);
      }
    };
  }, []);

  /**
   * Emit an event to the server
   */
  const emit = useCallback((event: string, data?: unknown) => {
    const socket = socketRef.current;
    if (!socket?.connected) {
      console.warn('[WebSocket] Cannot emit: socket not connected');
      return;
    }
    socket.emit(event, data);
  }, []);

  /**
   * Manually disconnect (usually not needed, handled by useEffect cleanup)
   */
  const disconnect = useCallback(() => {
    const socket = socketRef.current;
    if (socket) {
      socket.disconnect();
    }
  }, []);

  return {
    connected,
    subscribe,
    emit,
    disconnect
  };
}

export default useWebSocketEvents;

