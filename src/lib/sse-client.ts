/**
 * SSE Client Utility — shared across the consumer frontend.
 *
 * Handles:
 * - Auto-reconnect with exponential backoff on network errors
 * - `event: reconnect` from server (30min max lifetime)
 * - Connection state tracking
 *
 * Usage:
 *   import { createSSEClient } from '@/lib/sse-client';
 *   const client = createSSEClient({
 *     url: '/api/consumer/restaurants/.../orders/.../live',
 *     events: {
 *       message: (data) => handleStatusUpdate(data),
 *     },
 *   });
 *   client.connect();
 *   // client.close(); // cleanup
 */

interface SSEClientOptions {
  /** The SSE endpoint URL */
  url: string;
  /** Map of event names to handlers. 'message' catches untyped events. */
  events?: Record<string, (data: any) => void>;
  /** Called on each successful connection or reconnect */
  onConnected?: () => void;
  /** Called when the connection state changes */
  onConnectionChange?: (connected: boolean) => void;
  /** Maximum reconnect attempts before giving up (default: Infinity for order tracking) */
  maxRetries?: number;
  /** Base delay in ms for exponential backoff (default: 1000) */
  baseDelay?: number;
  /** Maximum delay in ms (default: 10000) */
  maxDelay?: number;
}

interface SSEClient {
  connect: () => void;
  close: () => void;
  reconnect: () => void;
}

export function createSSEClient(options: SSEClientOptions): SSEClient {
  const {
    url,
    events = {},
    onConnected,
    onConnectionChange,
    maxRetries = Infinity,
    baseDelay = 1000,
    maxDelay = 10000,
  } = options;

  let eventSource: EventSource | null = null;
  let retryCount = 0;
  let reconnectTimer: ReturnType<typeof setTimeout> | null = null;
  let closed = false;

  function getDelay(): number {
    return Math.min(baseDelay * Math.pow(2, retryCount), maxDelay);
  }

  function connect() {
    if (closed) return;
    if (eventSource) {
      eventSource.close();
    }

    eventSource = new EventSource(url, { withCredentials: true });

    // Register custom event listeners
    for (const [eventName, handler] of Object.entries(events)) {
      eventSource.addEventListener(eventName, (e: MessageEvent) => {
        try {
          const data = JSON.parse(e.data);
          handler(data);
        } catch {
          handler(e.data);
        }
      });
    }

    // Handle reconnect event from server (30min max lifetime)
    eventSource.addEventListener('reconnect', () => {
      console.log('[SSE] Server requested reconnect');
      eventSource?.close();
      eventSource = null;
      retryCount = 0;
      onConnectionChange?.(false);
      setTimeout(connect, 1000);
    });

    // Handle connection opened
    eventSource.addEventListener('open', () => {
      retryCount = 0;
      onConnectionChange?.(true);
      onConnected?.();
    });

    // Handle errors — auto-reconnect with exponential backoff
    eventSource.onerror = () => {
      if (closed) return;

      eventSource?.close();
      eventSource = null;
      onConnectionChange?.(false);

      if (retryCount >= maxRetries) {
        console.error(`[SSE] Max retries (${maxRetries}) reached`);
        return;
      }

      const delay = getDelay();
      console.warn(`[SSE] Connection lost. Reconnecting in ${delay}ms (attempt ${retryCount + 1})`);
      retryCount++;

      reconnectTimer = setTimeout(connect, delay);
    };
  }

  function close() {
    closed = true;
    if (reconnectTimer) {
      clearTimeout(reconnectTimer);
      reconnectTimer = null;
    }
    if (eventSource) {
      eventSource.close();
      eventSource = null;
    }
    onConnectionChange?.(false);
  }

  function reconnect() {
    retryCount = 0;
    close();
    closed = false;
    connect();
  }

  return { connect, close, reconnect };
}
