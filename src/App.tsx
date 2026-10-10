/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { FleetProvider, useFleet } from './context/FleetContext';
import { Sidebar } from './components/layout/Sidebar';
import { Navbar } from './components/layout/Navbar';
import { DashboardView } from './components/dashboard/DashboardView';
import { VehicleManagementView } from './components/vehicles/VehicleManagementView';
import { DriverManagementView } from './components/drivers/DriverManagementView';
import { VehicleAssignmentView } from './components/assignments/VehicleAssignmentView';
import { MaintenanceView } from './components/maintenance/MaintenanceView';
import { FuelManagementView } from './components/fuel/FuelManagementView';
import { GpsTrackingView } from './components/tracking/GpsTrackingView';
import { ReportsView } from './components/reports/ReportsView';

const FleetAppContent: React.FC = () => {
  const { currentTab } = useFleet();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const renderActiveView = () => {
    switch (currentTab) {
      case 'dashboard':
        return <DashboardView />;
      case 'vehicles':
        return <VehicleManagementView />;
      case 'drivers':
        return <DriverManagementView />;
      case 'assignments':
        return <VehicleAssignmentView />;
      case 'maintenance':
        return <MaintenanceView />;
      case 'fuel':
        return <FuelManagementView />;
      case 'tracking':
        return <GpsTrackingView />;
      case 'reports':
        return <ReportsView />;
      default:
        return <DashboardView />;
    }
  };

  return (
    <div className="min-h-screen bg-[#F4F7FB] dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex">
      {/* Sidebar Navigation */}
      <Sidebar mobileOpen={mobileMenuOpen} setMobileOpen={setMobileMenuOpen} />

      {/* Main Workspace Frame */}
      <div className="flex-1 flex flex-col min-w-0 lg:pl-64">
        {/* Top Navigation Bar */}
        <Navbar onToggleMobileMenu={() => setMobileMenuOpen((prev) => !prev)} />

        {/* View Content Viewport */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
          {renderActiveView()}
        </main>

        {/* Quiet Footer */}
        <footer className="no-print py-4 px-6 border-t border-slate-200 dark:border-slate-800 text-xs text-slate-500 flex flex-col sm:flex-row items-center justify-between gap-2">
          <div>
            © {new Date().getFullYear()} FleetPro Management Platform · All operational telemetry verified.
          </div>
          <div className="flex items-center gap-4 text-slate-400">
            <span>Fleet Safety & Compliance</span>
            <span>·</span>
            <span>DOT Certified</span>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default function App() {
  return (
    <FleetProvider>
      <FleetAppContent />
    </FleetProvider>
  );
}
