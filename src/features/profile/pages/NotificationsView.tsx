import React, { useEffect, useState, useCallback, useRef } from "react";
import { ArrowLeft, Check, ShoppingBag, Truck, Package, Clock, X, AlertCircle } from "lucide-react";
import {
  fetchNotifications,
  markNotificationRead,
  markAllNotificationsRead,
  type NotificationItem,
} from "@/api/notification";
import { useNotificationStream } from "@/hooks/useNotificationStream";

interface NotificationsViewProps {
  onBack: () => void;
}

/** Map notification type to icon + color. */
const NOTIFICATION_STYLES: Record<string, { icon: React.ElementType; color: string }> = {
  ORDER_PLACED: { icon: ShoppingBag, color: "bg-blue-100 text-blue-600" },
  ORDER_ACCEPTED: { icon: Check, color: "bg-green-100 text-green-600" },
  ORDER_PREPARING: { icon: Clock, color: "bg-amber-100 text-amber-600" },
  ORDER_READY: { icon: Package, color: "bg-purple-100 text-purple-600" },
  ORDER_OUT_FOR_DELIVERY: { icon: Truck, color: "bg-indigo-100 text-indigo-600" },
  ORDER_DELIVERED: { icon: Check, color: "bg-green-100 text-green-600" },
  ORDER_CANCELLED: { icon: X, color: "bg-red-100 text-red-600" },
  ORDER_REJECTED: { icon: AlertCircle, color: "bg-red-100 text-red-600" },
};

function getStyle(type: string) {
  return NOTIFICATION_STYLES[type] || { icon: Bell, color: "bg-slate-100 text-slate-600" };
}

/** Format relative time (e.g. "2 mins ago", "1 hour ago", "Yesterday"). */
function timeAgo(dateStr: string): string {
  const now = Date.now();
  const then = new Date(dateStr).getTime();
  const diffMs = now - then;
  const mins = Math.floor(diffMs / 60000);
  if (mins < 1) return "Just now";
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days === 1) return "Yesterday";
  if (days < 7) return `${days}d ago`;
  return new Date(dateStr).toLocaleDateString("en-IN", { day: "numeric", month: "short" });
}

/** Import Bell icon for fallback */
import { Bell } from "lucide-react";

export const NotificationsView: React.FC<NotificationsViewProps> = ({ onBack }) => {
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const seenIdsRef = useRef<Set<string>>(new Set());

  // Merge a new notification into the list (deduped by notificationId)
  const mergeNotification = useCallback((n: NotificationItem) => {
    if (seenIdsRef.current.has(n.notificationId)) return;
    seenIdsRef.current.add(n.notificationId);
    setNotifications((prev) => {
      if (prev.some((p) => p.notificationId === n.notificationId)) return prev;
      return [n, ...prev];
    });
    if (!n.read) {
      setUnreadCount((c) => c + 1);
    }
  }, []);

  // SSE stream for live notifications
  useNotificationStream(mergeNotification);

  // Initial fetch
  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        setLoading(true);
        const res = await fetchNotifications(1, 50);
        if (cancelled) return;
        if (res.success) {
          setNotifications(res.data);
          setUnreadCount(res.unreadCount);
          setHasMore(res.pagination.page < res.pagination.totalPages);
          res.data.forEach((n) => seenIdsRef.current.add(n.notificationId));
        }
      } catch (err) {
        console.error("Failed to load notifications:", err);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, []);

  const handleMarkAllRead = async () => {
    try {
      await markAllNotificationsRead();
      setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
      setUnreadCount(0);
    } catch (err) {
      console.error("Failed to mark all as read:", err);
    }
  };

  const handleMarkRead = async (notificationId: string) => {
    try {
      await markNotificationRead(notificationId);
      setNotifications((prev) =>
        prev.map((n) => (n.notificationId === notificationId ? { ...n, read: true } : n))
      );
      setUnreadCount((c) => Math.max(0, c - 1));
    } catch (err) {
      console.error("Failed to mark as read:", err);
    }
  };

  const loadMore = async () => {
    if (!hasMore || loading) return;
    try {
      const nextPage = page + 1;
      const res = await fetchNotifications(nextPage, 50);
      if (res.success) {
        setNotifications((prev) => [...prev, ...res.data]);
        setPage(nextPage);
        setHasMore(res.pagination.page < res.pagination.totalPages);
        res.data.forEach((n) => seenIdsRef.current.add(n.notificationId));
      }
    } catch (err) {
      console.error("Failed to load more notifications:", err);
    }
  };

  return (
    <div className="min-h-screen bg-white animate-[slideUp_0.3s_ease-out]">
      <div className="px-5 py-6 flex items-center justify-between border-b border-slate-100 sticky top-0 bg-white/90 backdrop-blur-md z-10">
        <div className="flex items-center gap-4">
          <button onClick={onBack} className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center text-slate-700 hover:bg-slate-100">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h1 className="font-bold text-xl text-slate-900">Notifications</h1>
          {unreadCount > 0 && (
            <span className="bg-blue-100 text-blue-700 text-xs font-bold px-2 py-0.5 rounded-full">
              {unreadCount}
            </span>
          )}
        </div>
        {unreadCount > 0 && (
          <button onClick={handleMarkAllRead} className="text-blue-600 text-xs font-bold hover:text-blue-700">
            Mark all read
          </button>
        )}
      </div>

      {loading && notifications.length === 0 ? (
        <div className="flex items-center justify-center py-20">
          <div className="w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
        </div>
      ) : notifications.length === 0 ? (
        <div className="text-center py-20">
          <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Bell className="w-8 h-8 text-slate-300" />
          </div>
          <p className="text-slate-500 font-medium">No notifications yet</p>
          <p className="text-xs text-slate-400 mt-1">You'll see order updates and offers here.</p>
        </div>
      ) : (
        <div className="divide-y divide-slate-50">
          {notifications.map((notif) => {
            const style = getStyle(notif.type);
            const Icon = style.icon;
            return (
              <div
                key={notif.notificationId}
                className={`p-5 flex gap-4 ${!notif.read ? "bg-blue-50/30" : ""}`}
                onClick={() => !notif.read && handleMarkRead(notif.notificationId)}
              >
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 ${style.color}`}>
                  <Icon className="w-6 h-6" />
                </div>
                <div className="flex-1">
                  <div className="flex justify-between items-start mb-1">
                    <h4 className={`text-sm font-bold ${!notif.read ? "text-slate-900" : "text-slate-700"}`}>
                      {notif.title}
                    </h4>
                    <span className="text-[10px] text-slate-400 font-medium whitespace-nowrap ml-2">
                      {timeAgo(notif.createdAt)}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 leading-relaxed">{notif.message}</p>
                </div>
                {!notif.read && (
                  <div className="w-2 h-2 bg-blue-500 rounded-full shrink-0 mt-2" />
                )}
              </div>
            );
          })}
          {hasMore && (
            <div className="p-4 text-center">
              <button
                onClick={loadMore}
                className="text-blue-600 text-sm font-semibold hover:text-blue-700"
              >
                Load more
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
