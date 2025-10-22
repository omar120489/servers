import { renderHook, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { io, Socket } from 'socket.io-client';

import { useWebSocketEvents } from './useWebSocketEvents';

// Mock socket.io-client
vi.mock('socket.io-client', () => ({
  io: vi.fn()
}));

describe('useWebSocketEvents', () => {
  let mockSocket: Partial<Socket>;
  const mockOn = vi.fn();
  const mockOff = vi.fn();
  const mockEmit = vi.fn();
  const mockConnect = vi.fn();
  const mockDisconnect = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    
    // Create a mock socket instance
    mockSocket = {
      on: mockOn,
      off: mockOff,
      emit: mockEmit,
      connect: mockConnect,
      disconnect: mockDisconnect,
      connected: false
    };

    // Mock io to return our mock socket
    vi.mocked(io).mockReturnValue(mockSocket);
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('should initialize WebSocket connection on mount', () => {
    const { result } = renderHook(() => useWebSocketEvents());

    expect(io).toHaveBeenCalledWith(
      expect.stringContaining('ws://'),
      expect.objectContaining({
        transports: ['websocket', 'polling'],
        reconnection: true
      })
    );

    expect(mockOn).toHaveBeenCalledWith('connect', expect.any(Function));
    expect(mockOn).toHaveBeenCalledWith('disconnect', expect.any(Function));
    expect(result.current.connected).toBe(false);
  });

  it('should update connected state when socket connects', async () => {
    // Set socket as connected before rendering
    mockSocket.connected = true;
    const { result } = renderHook(() => useWebSocketEvents());

    // Initially should reflect the mock socket's connected state
    await waitFor(() => {
      expect(result.current.connected).toBe(true);
    });
  });

  it('should subscribe to WebSocket events', () => {
    const { result } = renderHook(() => useWebSocketEvents());
    const handler = vi.fn();

    const unsubscribe = result.current.subscribe('test:event', handler);

    expect(mockOn).toHaveBeenCalledWith('test:event', expect.any(Function));
    expect(typeof unsubscribe).toBe('function');
  });

  it('should unsubscribe from WebSocket events', () => {
    const { result } = renderHook(() => useWebSocketEvents());
    const handler = vi.fn();

    const unsubscribe = result.current.subscribe('test:event', handler);
    unsubscribe();

    expect(mockOff).toHaveBeenCalledWith('test:event', expect.any(Function));
  });

  it('should emit events to the server', () => {
    mockSocket.connected = true;
    const { result } = renderHook(() => useWebSocketEvents());

    result.current.emit('test:event', { data: 'test' });

    expect(mockEmit).toHaveBeenCalledWith('test:event', { data: 'test' });
  });

  it('should handle disconnect', () => {
    const { result } = renderHook(() => useWebSocketEvents());

    result.current.disconnect();

    expect(mockDisconnect).toHaveBeenCalled();
  });

  it('should not emit when socket is not connected', () => {
    mockSocket.connected = false;
    const { result } = renderHook(() => useWebSocketEvents());

    const consoleSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
    
    result.current.emit('test:event', { data: 'test' });

    expect(mockEmit).not.toHaveBeenCalled();
    expect(consoleSpy).toHaveBeenCalledWith(
      expect.stringContaining('Cannot emit: socket not connected')
    );

    consoleSpy.mockRestore();
  });

  it('should clean up subscriptions on unmount', () => {
    const { result, unmount } = renderHook(() => useWebSocketEvents());
    const handler = vi.fn();

    result.current.subscribe('test:event', handler);
    unmount();

    expect(mockOff).toHaveBeenCalledWith('connect', expect.any(Function));
    expect(mockOff).toHaveBeenCalledWith('disconnect', expect.any(Function));
  });

  it('should handle multiple subscriptions to the same event', () => {
    const { result } = renderHook(() => useWebSocketEvents());
    const handler1 = vi.fn();
    const handler2 = vi.fn();

    result.current.subscribe('test:event', handler1);
    result.current.subscribe('test:event', handler2);

    // Should register two handlers
    const testEventCalls = mockOn.mock.calls.filter((call) => call[0] === 'test:event');
    expect(testEventCalls).toHaveLength(2);
  });
});

