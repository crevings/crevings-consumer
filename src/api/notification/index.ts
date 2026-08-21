/**
 * src/api/notification/index.ts
 *
 * Consumer notification API — list, mark read, mark all read.
 * SSE stream is handled separately in hooks/useNotificationStream.ts.
 */
import { get, request } from "@/api/fetcher";

export interface NotificationItem {
  notificationId: string;
  consumerId?: string;
  title: string;
  message: string;
  type: string;
  data?: Record<string, unknown>;
  createdAt: string;
  read: boolean;
}

export interface NotificationsResponse {
  success: boolean;
  data: NotificationItem[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
  unreadCount: number;
}

/** Fetch notifications for the authenticated consumer. */
export async function fetchNotifications(page = 1, limit = 20): Promise<NotificationsResponse> {
  return get<NotificationsResponse>(`/consumer/notifications?page=${page}&limit=${limit}`);
}

/** Mark a single notification as read. */
export async function markNotificationRead(notificationId: string): Promise<void> {
  await request(`/consumer/notifications/${notificationId}/read`, { method: "PATCH" });
}

/** Mark all notifications as read. */
export async function markAllNotificationsRead(): Promise<void> {
  await request("/consumer/notifications/read-all", { method: "PATCH" });
}
