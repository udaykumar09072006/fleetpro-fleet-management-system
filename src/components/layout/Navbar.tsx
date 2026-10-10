import React, { useState } from 'react';
import {
  Menu,
  Search,
  Bell,
  Sun,
  Moon,
  User as UserIcon,
  Play,
  Pause,
  RotateCcw,
} from 'lucide-react';
import { useFleet } from '../../context/FleetContext';
import { NotificationDrawer } from './NotificationDrawer';
import { AuthModal } from '../auth/AuthModal';

interface NavbarProps {
  onToggleMobileMenu: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onToggleMobileMenu }) => {
  const {
    currentTab,
    searchQuery,
    setSearchQuery,
    darkMode,
    toggleDarkMode,
    currentUser,
    notifications,
    gpsSimulationActive,
    toggleGpsSimulation,
    resetToDemoData,
  } = useFleet();

  const [notificationOpen, setNotificationOpen] = useState(false);
  const [authOpen, setAuthOpen] = useState(false);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const tabTitles: Record<string, { title: string; subtitle: string }> = {
    dashboard: { title: 'Fleet Overview Dashboard', subtitle: 'Live telemetry, operational status & cost overview' },
    vehicles: { title: 'Vehicle Management', subtitle: 'Fleet inventory, registrations, VIN & statuses' },
    drivers: { title: 'Driver Management', subtitle: 'Personnel profiles, license verification & safety records' },
    assignments: { title: 'Vehicle Assignments', subtitle: 'Active driver allocations, routes & shift tracking' },
    maintenance: { title: 'Maintenance & Service', subtitle: 'Preventative work orders, repair schedules & cost history' },
    fuel: { title: 'Fuel Management', subtitle: 'Fill-up logs, mileage tracking & fuel efficiency metrics' },
    tracking: { title: 'Live GPS Telemetry', subtitle: 'Simulated real-time vehicle tracking & route monitoring' },
    reports: { title: 'Fleet Reports & Analytics', subtitle: 'Operational KPIs, cost breakdowns & exportable reports' },
  };

  const currentInfo = tabTitles[currentTab] || { title: 'Fleet Operations', subtitle: 'System Console' };

  return (
    <>
      <header className="sticky top-0 z-30 h-16 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between px-4 sm:px-6">
        {/* Left: Mobile button + Title & Breadcrumb */}
        <div className="flex items-center gap-3">
          <button
            onClick={onToggleMobileMenu}
            className="p-2 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 lg:hidden"
            aria-label="Toggle Navigation"
          >
            <Menu className="w-5 h-5" />
          </button>

          <div>
            <div className="flex items-center gap-2 text-xs text-slate-500">
              <span>Fleet Operations</span>
              <span>/</span>
              <span className="font-semibold text-blue-600 dark:text-blue-400 capitalize">{currentTab}</span>
            </div>
            <h1 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white leading-tight">
              {currentInfo.title}
            </h1>
          </div>
        </div>

        {/* Center: Search input */}
        <div className="hidden md:flex items-center max-w-xs w-full mx-4">
          <div className="relative w-full">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search vehicles, plates, drivers..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-1.5 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-hidden focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        {/* Right Action zone */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* GPS Simulation Quick Toggle */}
          <button
            onClick={toggleGpsSimulation}
            className={`hidden sm:inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium border transition-colors ${
              gpsSimulationActive
                ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-700'
            }`}
            title={gpsSimulationActive ? 'Pause simulated GPS movement' : 'Start simulated GPS movement'}
          >
            {gpsSimulationActive ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
            <span className="hidden lg:inline">{gpsSimulationActive ? 'GPS Sim: Active' : 'GPS Sim: Paused'}</span>
          </button>

          {/* Reset Demo Data button */}
          <button
            onClick={() => {
              if (window.confirm('Reset all demo data back to default initial state?')) {
                resetToDemoData();
              }
            }}
            className="hidden xl:inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-medium text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-700"
            title="Reset to factory demo state"
          >
            <RotateCcw className="w-3 h-3" />
            <span>Reset Demo</span>
          </button>

          {/* Dark Mode toggle */}
          <button
            onClick={toggleDarkMode}
            className="p-2 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800"
            aria-label="Toggle Dark Mode"
            title="Toggle Dark Mode"
          >
            {darkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-600" />}
          </button>

          {/* Notifications bell */}
          <button
            onClick={() => setNotificationOpen(true)}
            className="p-2 relative rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800"
            aria-label="Notifications"
          >
            <Bell className="w-4 h-4" />
            {unreadCount > 0 && (
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-rose-500 ring-2 ring-white dark:ring-slate-900" />
            )}
          </button>

          {/* User profile dropdown button */}
          <button
            onClick={() => setAuthOpen(true)}
            className="flex items-center gap-2 pl-2 pr-2.5 py-1 rounded-lg border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors text-left"
          >
            <div className="w-7 h-7 rounded-full bg-blue-600 text-white font-semibold text-xs flex items-center justify-center shrink-0 overflow-hidden">
              {currentUser.avatar ? (
                <img
                  src={currentUser.avatar}
                  alt={currentUser.name}
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                  onError={(e) => {
                    (e.target as HTMLElement).style.display = 'none';
                  }}
                />
              ) : (
                currentUser.name.charAt(0)
              )}
            </div>
            <div className="hidden sm:block">
              <div className="text-xs font-semibold text-slate-900 dark:text-white leading-tight truncate max-w-[100px]">
                {currentUser.name}
              </div>
              <div className="text-[10px] text-slate-500 dark:text-slate-400 leading-tight">
                {currentUser.role}
              </div>
            </div>
          </button>
        </div>
      </header>

      {/* Notification Drawer */}
      <NotificationDrawer isOpen={notificationOpen} onClose={() => setNotificationOpen(false)} />

      {/* Auth Modal */}
      <AuthModal isOpen={authOpen} onClose={() => setAuthOpen(false)} />
    </>
  );
};
