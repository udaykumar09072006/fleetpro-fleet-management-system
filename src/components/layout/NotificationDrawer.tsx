import React from 'react';
import { X, CheckCheck, AlertTriangle, ShieldCheck, Wrench, FileText } from 'lucide-react';
import { useFleet } from '../../context/FleetContext';

interface NotificationDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export const NotificationDrawer: React.FC<NotificationDrawerProps> = ({ isOpen, onClose }) => {
  const { notifications, markNotificationAsRead, markAllNotificationsAsRead, setCurrentTab } = useFleet();

  if (!isOpen) return null;

  const unreadCount = notifications.filter((n) => !n.read).length;

  const getIcon = (type: string, severity: string) => {
    if (type === 'maintenance') {
      return <Wrench className={`w-4 h-4 ${severity === 'urgent' ? 'text-rose-500' : 'text-amber-500'}`} />;
    }
    if (type === 'insurance' || type === 'license') {
      return <AlertTriangle className="w-4 h-4 text-amber-500" />;
    }
    return <ShieldCheck className="w-4 h-4 text-blue-500" />;
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-slate-900/40 backdrop-blur-xs">
      <div className="absolute inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white dark:bg-slate-900 shadow-xl border-l border-slate-200 dark:border-slate-800 flex flex-col">
          {/* Header */}
          <div className="px-5 py-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <h3 className="font-semibold text-slate-900 dark:text-white">Notifications & Alerts</h3>
              {unreadCount > 0 && (
                <span className="text-xs bg-rose-100 text-rose-700 dark:bg-rose-950/70 dark:text-rose-400 font-mono px-2 py-0.5 rounded-full font-semibold">
                  {unreadCount} new
                </span>
              )}
            </div>

            <div className="flex items-center gap-2">
              {unreadCount > 0 && (
                <button
                  onClick={markAllNotificationsAsRead}
                  className="text-xs text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1 font-medium"
                >
                  <CheckCheck className="w-3.5 h-3.5" />
                  Mark all read
                </button>
              )}
              <button
                onClick={onClose}
                className="p-1 rounded-md text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* List */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {notifications.length === 0 ? (
              <div className="text-center py-12 text-slate-500 text-sm">
                No active notifications or alerts.
              </div>
            ) : (
              notifications.map((n) => (
                <div
                  key={n.id}
                  onClick={() => {
                    markNotificationAsRead(n.id);
                    if (n.type === 'maintenance') setCurrentTab('maintenance');
                    if (n.type === 'insurance') setCurrentTab('vehicles');
                    if (n.type === 'license') setCurrentTab('drivers');
                  }}
                  className={`p-3.5 rounded-lg border text-sm transition-colors cursor-pointer ${
                    n.read
                      ? 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 opacity-75'
                      : 'bg-blue-50/50 dark:bg-blue-950/20 border-blue-200 dark:border-blue-900/50 shadow-xs'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div className="p-2 rounded-md bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shrink-0">
                      {getIcon(n.type, n.severity)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2">
                        <span className="font-semibold text-slate-900 dark:text-slate-100 truncate">
                          {n.title}
                        </span>
                        <span className="text-[11px] text-slate-400 shrink-0 tabular-nums">
                          {n.timestamp}
                        </span>
                      </div>
                      <p className="text-xs text-slate-600 dark:text-slate-300 mt-1 leading-relaxed">
                        {n.message}
                      </p>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer note */}
          <div className="p-4 border-t border-slate-200 dark:border-slate-800 text-xs text-slate-500 text-center">
            Fleet telematics telemetry & compliance alerts update automatically.
          </div>
        </div>
      </div>
    </div>
  );
};
