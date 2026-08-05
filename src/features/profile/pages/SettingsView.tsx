import React, { useState, useEffect } from "react";
import {
  ChevronLeft,
  Bell,
  Lock,
  MapPin,
  Trash2,
  ChevronRight,
  Mic,
  Mail,
  MessageSquare,
  Phone,
  MessageCircle,
  AlertTriangle,
  Share2,
  Moon,
} from "lucide-react";
import { requestLocationAndGetPosition, isCapacitorNative, openLocationSettings } from "@/services/geolocation";

interface SettingsViewProps {
  onBack: () => void;
  onDataSharingClick: () => void;
}

export const SettingsView: React.FC<SettingsViewProps> = ({
  onBack,
  onDataSharingClick,
}) => {
  const [toggles, setToggles] = useState({
    push: false,
    email: false,
    sms: false,
    call: false,
    rcs: false,
    location: false,
    mic: false,
    darkMode: false,
  });

  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [modalAlert, setModalAlert] = useState<{
    isOpen: boolean;
    title: string;
    message: string;
    isLocation?: boolean;
  }>({
    isOpen: false,
    title: "",
    message: "",
  });

  useEffect(() => {
    const isDark = document.documentElement.classList.contains("dark");

    const syncPermissions = async () => {
      const perms: any = { darkMode: isDark };

      if ("Notification" in window) {
        perms.push = Notification.permission === "granted";
      }

      if (typeof navigator !== "undefined" && "permissions" in navigator) {
        try {
          const loc = await navigator.permissions.query({
            name: "geolocation" as PermissionName,
          });
          perms.location = loc.state === "granted";

          const mic = await navigator.permissions.query({
            name: "microphone" as PermissionName,
          });
          perms.mic = mic.state === "granted";
        } catch (e) {
          console.debug("Some permissions queries not supported");
        }
      }

      setToggles((prev) => ({ ...prev, ...perms }));
    };

    syncPermissions();
  }, []);

  const handleToggle = async (key: keyof typeof toggles) => {
    // If turning OFF, just do it
    if (toggles[key]) {
      if (key === "darkMode") {
        document.documentElement.classList.remove("dark");
        localStorage.setItem("theme", "light");
      }
      setToggles((prev) => ({ ...prev, [key]: false }));
      return;
    }

    // If turning ON, check for device permissions where applicable
    try {
      switch (key) {
        case "location":
          await requestLocationAndGetPosition();
          break;
        case "mic":
          if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
            setModalAlert({
              isOpen: true,
              title: "Microphone Access",
              message: "Microphone is not supported by your browser or device.",
            });
            return;
          }
          const stream = await navigator.mediaDevices.getUserMedia({
            audio: true,
          });
          stream.getTracks().forEach((track) => track.stop());
          break;
        case "push":
          if (!("Notification" in window)) {
            setModalAlert({
              isOpen: true,
              title: "Notifications",
              message: "Notifications are not supported by your browser or device.",
            });
            return;
          }
          const perm = await Notification.requestPermission();
          if (perm !== "granted") {
            setModalAlert({
              isOpen: true,
              title: "Notification Permission",
              message: "Notification permission was denied. Please enable notifications in device settings.",
            });
            return;
          }
          break;
        case "darkMode":
          document.documentElement.classList.add("dark");
          localStorage.setItem("theme", "dark");
          break;
        case "sms":
        case "email":
        case "call":
        case "rcs":
          break;
      }

      // Success or no permission needed (like darkMode/sms/etc)
      setToggles((prev) => ({ ...prev, [key]: true }));
    } catch (err: any) {
      console.warn(`Could not enable ${key}:`, err);
      setModalAlert({
        isOpen: true,
        title: `${key === "location" ? "Location" : key} Access Needed`,
        message:
          err?.code === 1
            ? `${key === "location" ? "Location" : key} permission was denied. Please allow permission to proceed.`
            : `Could not access ${key}. Please check your device permission settings.`,
        isLocation: key === "location",
      });
    }
  };

  const SettingItem = ({
    icon: Icon,
    title,
    desc,
    toggleKey,
    isDestructive = false,
  }: any) => (
    <div className="flex items-center justify-between py-4 border-b border-slate-100 dark:border-slate-800 last:border-0">
      <div className="flex items-center gap-4">
        <div
          className={`w-12 h-12 rounded-[16px] flex items-center justify-center ${
            isDestructive
              ? "bg-red-50 text-red-500 dark:bg-red-900/20 dark:text-red-400"
              : "bg-slate-50 text-slate-500 dark:bg-slate-800 dark:text-slate-400"
          }`}
        >
          <Icon className="w-5 h-5" />
        </div>
        <div>
          <h4
            className={`text-sm font-bold ${isDestructive ? "text-red-600 dark:text-red-400" : "text-slate-900 dark:text-slate-100"}`}
          >
            {title}
          </h4>
          {desc && (
            <p className="text-xs font-medium text-slate-500 dark:text-slate-400">
              {desc}
            </p>
          )}
        </div>
      </div>
      {toggleKey ? (
        <button
          onClick={() => handleToggle(toggleKey)}
          className={`w-12 h-7 rounded-full transition-colors relative ${toggles[toggleKey as keyof typeof toggles] ? "bg-[#00bd6f]" : "bg-slate-200 dark:bg-slate-700"}`}
        >
          <div
            className={`absolute top-1 w-5 h-5 rounded-full bg-white transition-transform ${toggles[toggleKey as keyof typeof toggles] ? "left-6" : "left-1"}`}
          ></div>
        </button>
      ) : (
        <ChevronRight className="w-5 h-5 text-slate-400 dark:text-slate-500" />
      )}
    </div>
  );

  return (
    <div className="min-h-screen bg-[#f4f5f7] dark:bg-slate-900 font-sans animate-[fadeInUp_0.3s_ease-out] relative transition-colors duration-300">
      {/* Header */}
      <div className="bg-white dark:bg-slate-900 px-4 py-4 flex items-center gap-3 sticky top-0 z-20 shadow-sm border-b border-slate-100 dark:border-slate-800">
        <button
          onClick={onBack}
          className="p-2 -ml-2 bg-white dark:bg-slate-900 rounded-full active:scale-95 transition-transform"
        >
          <ChevronLeft className="w-6 h-6 text-slate-800 dark:text-slate-200" />
        </button>
        <h1 className="text-lg font-bold text-slate-900 dark:text-white">
          Settings
        </h1>
      </div>

      <div className="p-4 space-y-4">
        <div className="bg-white dark:bg-slate-800 rounded-[24px] p-6 shadow-sm border border-slate-100 dark:border-slate-700">
          <h3 className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2 px-1">
            Preferences
          </h3>
          <SettingItem
            icon={Moon}
            title="Dark Mode"
            desc="Switch between light and dark themes"
            toggleKey="darkMode"
          />
        </div>

        <div className="bg-white dark:bg-slate-800 rounded-[24px] p-6 shadow-sm border border-slate-100 dark:border-slate-700">
          <h3 className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2 px-1">
            Communication
          </h3>
          <SettingItem
            icon={Bell}
            title="Push Notifications"
            desc="Order updates & offers"
            toggleKey="push"
          />
          <SettingItem
            icon={Mail}
            title="Email Notifications"
            desc="Invoices & summaries"
            toggleKey="email"
          />
          <SettingItem
            icon={MessageSquare}
            title="SMS"
            desc="Text updates for orders"
            toggleKey="sms"
          />
          <SettingItem
            icon={Phone}
            title="Call"
            desc="Delivery partner calls"
            toggleKey="call"
          />
          <SettingItem
            icon={MessageCircle}
            title="RCS Messaging"
            desc="Rich media updates"
            toggleKey="rcs"
          />
        </div>

        <div className="bg-white dark:bg-slate-800 rounded-[24px] p-6 shadow-sm border border-slate-100 dark:border-slate-700">
          <h3 className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2 px-1">
            Privacy & Security
          </h3>
          <SettingItem
            icon={MapPin}
            title="Location Access"
            desc="For better delivery tracking"
            toggleKey="location"
          />
          <SettingItem
            icon={Mic}
            title="Microphone Access"
            desc="Voice search & commands"
            toggleKey="mic"
          />
          <button className="w-full text-left" onClick={onDataSharingClick}>
            <SettingItem
              icon={Share2}
              title="Data Sharing"
              desc="Share number with food partners"
            />
          </button>
        </div>

        <div className="bg-white dark:bg-slate-800 rounded-[24px] p-6 shadow-sm border border-slate-100 dark:border-slate-700">
          <h3 className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2 px-1">
            Account
          </h3>
          <button
            className="w-full text-left"
            onClick={() => setShowDeleteConfirm(true)}
          >
            <SettingItem
              icon={Trash2}
              title="Delete Account"
              desc="Permanently remove your data"
              isDestructive={true}
            />
          </button>
        </div>
      </div>

      {showDeleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm transition-opacity"
            onClick={() => setShowDeleteConfirm(false)}
          ></div>
          <div className="bg-white dark:bg-slate-800 w-full max-w-sm rounded-[24px] p-6 relative z-10 animate-[fadeInUp_0.2s_ease-out] shadow-xl">
            <div className="w-16 h-16 bg-red-50 dark:bg-red-900/20 rounded-[16px] flex items-center justify-center mx-auto mb-4">
              <AlertTriangle className="w-8 h-8 text-red-500 dark:text-red-400" />
            </div>
            <h3 className="text-xl font-bold text-slate-900 dark:text-white text-center mb-2">
              Delete Account?
            </h3>
            <p className="text-slate-500 dark:text-slate-400 text-center text-sm mb-6 leading-relaxed font-medium">
              Are you sure you want to delete your account? This action cannot
              be undone.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="flex-1 py-4 rounded-[16px] font-bold text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors"
              >
                Cancel
              </button>
              <button className="flex-1 py-4 rounded-[16px] font-bold text-white bg-red-500 hover:bg-red-600 transition-colors">
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Permission Alert Popup Modal */}
      {modalAlert.isOpen && (
        <div className="fixed inset-0 z-[600] flex items-center justify-center bg-black/50 backdrop-blur-[2px] px-6">
          <div className="w-full max-w-[340px] bg-white rounded-3xl shadow-2xl p-6 text-center animate-[slideUp_0.25s_ease-out]">
            <div className="mx-auto w-14 h-14 rounded-full bg-green-50 flex items-center justify-center">
              <MapPin className="w-7 h-7 text-[#00bd6f]" />
            </div>
            <h3 className="text-[16px] font-bold text-slate-900 mt-4">
              {modalAlert.title}
            </h3>
            <p className="text-[13px] text-slate-500 mt-1.5 leading-relaxed font-medium">
              {modalAlert.message}
            </p>
            <div className="mt-5 space-y-2">
              {modalAlert.isLocation && isCapacitorNative() && (
                <button
                  onClick={openLocationSettings}
                  className="w-full bg-[#00bd6f] text-white py-3 rounded-xl font-bold text-[13px] active:scale-[0.99] transition-all shadow-md shadow-green-500/20"
                >
                  Open Device Settings
                </button>
              )}
              <button
                onClick={() => setModalAlert((prev) => ({ ...prev, isOpen: false }))}
                className="w-full border border-slate-200 text-slate-700 py-3 rounded-xl font-bold text-[13px] hover:bg-slate-50 active:scale-[0.99] transition-all"
              >
                Got it
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
