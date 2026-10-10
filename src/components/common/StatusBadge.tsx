import React from 'react';
import { VehicleStatus, DriverStatus, MaintenanceStatus, MaintenancePriority } from '../../types';

interface StatusBadgeProps {
  status: VehicleStatus | DriverStatus | MaintenanceStatus | MaintenancePriority | string;
  type?: 'vehicle' | 'driver' | 'maintenance' | 'priority';
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status, type = 'vehicle' }) => {
  // Vehicle Status styles matching requirements:
  // Active: 🟢 Vehicle is operational
  // Maintenance: 🟡 Under maintenance
  // Out of Service: 🔴 Not operational
  // Reserved: ⚪ Assigned/scheduled
  if (type === 'vehicle') {
    switch (status) {
      case 'Active':
        return (
          <span className="inline-flex items-center gap-1.5 text-xs font-medium text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-200 dark:border-emerald-800/60">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" aria-hidden="true" />
            Active
          </span>
        );
      case 'Maintenance':
        return (
          <span className="inline-flex items-center gap-1.5 text-xs font-medium text-amber-700 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/60 px-2 py-0.5 rounded border border-amber-200 dark:border-amber-800/60">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-500" aria-hidden="true" />
            Maintenance
          </span>
        );
      case 'Out of Service':
        return (
          <span className="inline-flex items-center gap-1.5 text-xs font-medium text-rose-700 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/60 px-2 py-0.5 rounded border border-rose-200 dark:border-rose-800/60">
            <span className="w-1.5 h-1.5 rounded-full bg-rose-500" aria-hidden="true" />
            Out of Service
          </span>
        );
      case 'Reserved':
        return (
          <span className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded border border-slate-200 dark:border-slate-700">
            <span className="w-1.5 h-1.5 rounded-full bg-slate-400" aria-hidden="true" />
            Reserved
          </span>
        );
      default:
        return <span className="text-xs text-slate-600 dark:text-slate-400">{status}</span>;
    }
  }

  if (type === 'driver') {
    switch (status) {
      case 'Available':
        return (
          <span className="inline-flex items-center gap-1.5 text-xs font-medium text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/50 px-2 py-0.5 rounded border border-emerald-200 dark:border-emerald-800">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" aria-hidden="true" />
            Available
          </span>
        );
      case 'On Route':
        return (
          <span className="inline-flex items-center gap-1.5 text-xs font-medium text-blue-700 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/50 px-2 py-0.5 rounded border border-blue-200 dark:border-blue-800">
            <span className="w-1.5 h-1.5 rounded-full bg-blue-500" aria-hidden="true" />
            On Route
          </span>
        );
      case 'Off Duty':
        return (
          <span className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-600 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded border border-slate-200 dark:border-slate-700">
            <span className="w-1.5 h-1.5 rounded-full bg-slate-400" aria-hidden="true" />
            Off Duty
          </span>
        );
    }
  }

  if (type === 'maintenance') {
    switch (status) {
      case 'Completed':
        return (
          <span className="inline-flex items-center gap-1.5 text-xs font-medium text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/50 px-2 py-0.5 rounded border border-emerald-200 dark:border-emerald-800">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" aria-hidden="true" />
            Completed
          </span>
        );
      case 'In Progress':
        return (
          <span className="inline-flex items-center gap-1.5 text-xs font-medium text-amber-700 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/50 px-2 py-0.5 rounded border border-amber-200 dark:border-amber-800">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-500" aria-hidden="true" />
            In Progress
          </span>
        );
      case 'Overdue':
        return (
          <span className="inline-flex items-center gap-1.5 text-xs font-medium text-rose-700 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/50 px-2 py-0.5 rounded border border-rose-200 dark:border-rose-800">
            <span className="w-1.5 h-1.5 rounded-full bg-rose-500" aria-hidden="true" />
            Overdue
          </span>
        );
      case 'Scheduled':
      default:
        return (
          <span className="inline-flex items-center gap-1.5 text-xs font-medium text-blue-700 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/50 px-2 py-0.5 rounded border border-blue-200 dark:border-blue-800">
            <span className="w-1.5 h-1.5 rounded-full bg-blue-500" aria-hidden="true" />
            Scheduled
          </span>
        );
    }
  }

  if (type === 'priority') {
    switch (status) {
      case 'Urgent':
        return (
          <span className="text-xs font-semibold text-rose-700 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/60 px-2 py-0.5 rounded border border-rose-200 dark:border-rose-800">
            Urgent
          </span>
        );
      case 'High':
        return (
          <span className="text-xs font-medium text-amber-700 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/60 px-2 py-0.5 rounded border border-amber-200 dark:border-amber-800">
            High
          </span>
        );
      case 'Medium':
        return (
          <span className="text-xs font-medium text-blue-700 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/60 px-2 py-0.5 rounded border border-blue-200 dark:border-blue-800">
            Medium
          </span>
        );
      default:
        return (
          <span className="text-xs font-medium text-slate-600 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded border border-slate-200 dark:border-slate-700">
            Low
          </span>
        );
    }
  }

  return <span className="text-xs text-slate-600">{status}</span>;
};
