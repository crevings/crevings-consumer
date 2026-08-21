/**
 * src/hooks/useNotificationStream.ts
 *
 * Live SSE feed for the consumer's notifications. On connect, the server
 * replays the most recent unread notifications (catch-up), then streams
 * new ones as they arrive via Redis pub/sub.
 *
 * Handles:
 * - Auto-reconnect with exponential backoff
 * - `event: reconnect` from server (30min max lifetime)
 * - Deduplication by notificationId
 */
import { useEffect, useRef, useState, useCallback } from "react";
import { BASE_URL } from "@/api/fetcher";
import { createSSEClient } from "@/lib/sse-client";
import type { NotificationItem } from "@/api/notification";

export function useNotificationStream(
  onNotification?: (notification: NotificationItem) => void
) {
  const handlerRef = useRef(onNotification);
  handlerRef.current = onNotification;
  const [connected, setConnected] = useState(false);

  const handleNotification = useCallback((data: any) => {
    try {
      const notification: NotificationItem = {
        notificationId: data.notificationId,
        consumerId: data.consumerId,
        title: data.title,
        message: data.message,
        type: data.type,
        data: data.data,
        createdAt: data.createdAt,
        read: data.read,
      };
      handlerRef.current?.(notification);
    } catch (err) {
      console.error("Error parsing notification stream event:", err);
    }
  }, []);

  useEffect(() => {
    const sseClient = createSSEClient({
      url: `${BASE_URL}/consumer/notifications/stream`,
      onConnectionChange: (isConnected) => setConnected(isConnected),
      events: {
        notification: handleNotification,
      },
      maxRetries: Infinity,
    });

    sseClient.connect();

    return () => {
      sseClient.close();
    };
  }, [handleNotification]);

  return { connected };
}
