import React from 'react';
import {
  LayoutDashboard,
  Truck,
  Users,
  ArrowRightLeft,
  Wrench,
  Fuel,
  Navigation,
  BarChart3,
  ChevronRight,
  ShieldAlert,
  Car,
} from 'lucide-react';
import { useFleet } from '../../context/FleetContext';

interface SidebarProps {
  mobileOpen: boolean;
  setMobileOpen: (open: boolean) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ mobileOpen, setMobileOpen }) => {
  const { currentTab, setCurrentTab, vehicles, drivers, maintenanceRecords } = useFleet();

  const activeVehicles = vehicles.filter((v) => v.status === 'Active').length;
  const inMaintenance = vehicles.filter((v) => v.status === 'Maintenance').length;
  const overdueCount = maintenanceRecords.filter((m) => m.status === 'Overdue').length;

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'vehicles', label: 'Vehicles', icon: Truck, badge: vehicles.length },
    { id: 'drivers', label: 'Drivers', icon: Users, badge: drivers.length },
    { id: 'assignments', label: 'Assignments', icon: ArrowRightLeft },
    { id: 'maintenance', label: 'Maintenance', icon: Wrench, alert: overdueCount > 0 },
    { id: 'fuel', label: 'Fuel Logs', icon: Fuel },
    { id: 'tracking', label: 'Live GPS', icon: Navigation },
    { id: 'reports', label: 'Reports', icon: BarChart3 },
  ];

  return (
    <>
      {/* Mobile backdrop */}
      {mobileOpen && (
        <div
          className="fixed inset-0 bg-slate-900/60 z-40 lg:hidden backdrop-blur-xs transition-opacity"
          onClick={() => setMobileOpen(false)}
        />
      )}

      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 w-64 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 flex flex-col transition-transform duration-200 ease-in-out lg:translate-x-0 ${
          mobileOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Brand header */}
        <div className="h-16 px-6 flex items-center justify-between border-b border-slate-200 dark:border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-blue-600 flex items-center justify-center text-white shadow-xs">
              <Truck className="w-5 h-5" />
            </div>
            <div>
              <span className="text-lg font-bold tracking-tight text-slate-900 dark:text-white">
                FleetPro
              </span>
              <span className="block text-[11px] font-medium text-slate-500 dark:text-slate-400 -mt-1">
                Fleet Operating System
              </span>
            </div>
          </div>
        </div>

        {/* Navigation list */}
        <div className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
          <div className="px-3 pb-2 text-[11px] font-semibold tracking-wider text-slate-600 dark:text-slate-400">
            FLEET MODULES
          </div>

          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  setCurrentTab(item.id);
                  setMobileOpen(false);
                }}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                  isActive
                    ? 'bg-blue-600 text-white font-semibold shadow-xs'
                    : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon
                    className={`w-4 h-4 ${
                      isActive ? 'text-white' : 'text-slate-600 dark:text-slate-400'
                    }`}
                  />
                  <span>{item.label}</span>
                </div>

                <div className="flex items-center gap-1.5">
                  {item.alert && (
                    <span className="w-2 h-2 rounded-full bg-rose-500" title="Overdue maintenance alerts" />
                  )}
                  {item.badge !== undefined && (
                    <span
                      className={`text-xs px-2 py-0.5 rounded font-mono tabular-nums ${
                        isActive
                          ? 'bg-blue-700 text-white'
                          : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                </div>
              </button>
            );
          })}
        </div>

        {/* Fleet health mini panel */}
        <div className="p-4 border-t border-slate-200 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-950/30">
          <div className="text-xs font-semibold text-slate-700 dark:text-slate-300 mb-2 flex items-center justify-between">
            <span>Fleet Status</span>
            <span className="text-[11px] font-mono tabular-nums text-slate-500">
              {vehicles.length} Units
            </span>
          </div>

          <div className="space-y-1.5 text-xs text-slate-600 dark:text-slate-400 font-mono tabular-nums">
            <div className="flex justify-between items-center">
              <span className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-500" />
                Operational
              </span>
              <span className="font-semibold text-slate-900 dark:text-white">
                {activeVehicles}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-amber-500" />
                In Maintenance
              </span>
              <span className="font-semibold text-slate-900 dark:text-white">
                {inMaintenance}
              </span>
            </div>
            {overdueCount > 0 && (
              <div className="flex justify-between items-center text-rose-600 dark:text-rose-400 font-medium">
                <span className="flex items-center gap-1">
                  <ShieldAlert className="w-3 h-3" />
                  Overdue
                </span>
                <span>{overdueCount}</span>
              </div>
            )}
          </div>
        </div>
      </aside>
    </>
  );
};
