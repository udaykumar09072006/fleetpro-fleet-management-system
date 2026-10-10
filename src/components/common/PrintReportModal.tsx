import React from 'react';
import { X, Printer, Truck, FileText } from 'lucide-react';
import { Vehicle, Driver, MaintenanceRecord, FuelLog } from '../../types';

interface PrintReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  vehicles: Vehicle[];
  drivers: Driver[];
  maintenanceRecords: MaintenanceRecord[];
  fuelLogs: FuelLog[];
}

export const PrintReportModal: React.FC<PrintReportModalProps> = ({
  isOpen,
  onClose,
  vehicles,
  drivers,
  maintenanceRecords,
  fuelLogs,
}) => {
  if (!isOpen) return null;

  const totalFuel = fuelLogs.reduce((acc, f) => acc + f.totalCost, 0);
  const totalMaint = maintenanceRecords.reduce(
    (acc, m) => acc + (m.actualCost !== undefined ? m.actualCost : m.estimatedCost),
    0
  );
  const totalCost = totalFuel + totalMaint;
  const activeCount = vehicles.filter((v) => v.status === 'Active').length;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="w-full max-w-4xl bg-white dark:bg-slate-900 rounded-xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden flex flex-col max-h-[92vh]">
        {/* Top Action bar (hidden on print) */}
        <div className="no-print px-6 py-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50 dark:bg-slate-950">
          <div className="flex items-center gap-2">
            <FileText className="w-5 h-5 text-blue-600" />
            <h3 className="font-bold text-slate-900 dark:text-white text-sm">
              Executive Fleet Operations Report Preview
            </h3>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={handlePrint}
              className="px-4 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 shadow-xs transition-colors"
            >
              <Printer className="w-4 h-4" />
              Print / Save as PDF
            </button>
            <button
              onClick={onClose}
              className="p-1 rounded text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Document Body */}
        <div className="flex-1 overflow-y-auto p-8 bg-white text-slate-900 font-sans print:p-0 print:m-0 print:overflow-visible">
          {/* Document Header */}
          <div className="flex items-start justify-between border-b pb-6 mb-6">
            <div>
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white">
                  <Truck className="w-5 h-5" />
                </div>
                <h1 className="text-2xl font-bold tracking-tight text-slate-900">
                  FleetPro Operations Report
                </h1>
              </div>
              <p className="text-xs text-slate-500 mt-1">
                Official Fleet Utilization, Maintenance & Cost Auditing Summary
              </p>
            </div>
            <div className="text-right text-xs text-slate-500 font-mono">
              <div>Date: {new Date().toLocaleDateString()}</div>
              <div>Report Ref: FLT-REP-{Date.now().toString().slice(-6)}</div>
              <div>Status: Verified Official</div>
            </div>
          </div>

          {/* KPI Summary Block */}
          <div className="grid grid-cols-4 gap-4 mb-6">
            <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
              <span className="text-[10px] uppercase font-bold text-slate-500 block">Fleet Size</span>
              <span className="text-xl font-bold font-mono">{vehicles.length} Units</span>
              <span className="text-[10px] text-emerald-600 block">{activeCount} Operational</span>
            </div>
            <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
              <span className="text-[10px] uppercase font-bold text-slate-500 block">Active Drivers</span>
              <span className="text-xl font-bold font-mono">{drivers.length} Drivers</span>
              <span className="text-[10px] text-blue-600 block">Full CDL Compliance</span>
            </div>
            <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
              <span className="text-[10px] uppercase font-bold text-slate-500 block">Fuel Expenditure</span>
              <span className="text-xl font-bold font-mono">${Math.round(totalFuel).toLocaleString()}</span>
              <span className="text-[10px] text-slate-500 block">{fuelLogs.length} fill-up logs</span>
            </div>
            <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
              <span className="text-[10px] uppercase font-bold text-slate-500 block">Total Op Cost</span>
              <span className="text-xl font-bold font-mono text-blue-600">${Math.round(totalCost).toLocaleString()}</span>
              <span className="text-[10px] text-slate-500 block">Fuel + Maintenance</span>
            </div>
          </div>

          {/* Section 1: Fleet Inventory Ledger */}
          <div className="mb-6">
            <h2 className="text-sm font-bold uppercase tracking-wider text-slate-800 border-b pb-1 mb-3">
              1. Fleet Assets & Status Overview
            </h2>
            <table className="w-full text-left text-xs border border-slate-200">
              <thead className="bg-slate-100 font-semibold text-slate-700">
                <tr>
                  <th className="p-2 border">Plate</th>
                  <th className="p-2 border">Make / Model</th>
                  <th className="p-2 border">Type</th>
                  <th className="p-2 border">Status</th>
                  <th className="p-2 border text-right">Odometer</th>
                  <th className="p-2 border">Insurance Carrier</th>
                  <th className="p-2 border">Expiry</th>
                </tr>
              </thead>
              <tbody>
                {vehicles.map((v) => (
                  <tr key={v.id} className="border-b">
                    <td className="p-2 font-mono font-bold border">{v.licensePlate}</td>
                    <td className="p-2 border">{v.make} {v.model}</td>
                    <td className="p-2 border">{v.type}</td>
                    <td className="p-2 border">{v.status}</td>
                    <td className="p-2 font-mono text-right border">{v.mileage.toLocaleString()} km</td>
                    <td className="p-2 border">{v.insuranceProvider}</td>
                    <td className="p-2 font-mono border">{v.insuranceExpiry}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Section 2: Maintenance Work Orders */}
          <div className="mb-6">
            <h2 className="text-sm font-bold uppercase tracking-wider text-slate-800 border-b pb-1 mb-3">
              2. Maintenance & Safety Inspections
            </h2>
            <table className="w-full text-left text-xs border border-slate-200">
              <thead className="bg-slate-100 font-semibold text-slate-700">
                <tr>
                  <th className="p-2 border">Service Description</th>
                  <th className="p-2 border">Vehicle</th>
                  <th className="p-2 border">Scheduled</th>
                  <th className="p-2 border">Status</th>
                  <th className="p-2 border">Provider</th>
                  <th className="p-2 border text-right">Cost ($)</th>
                </tr>
              </thead>
              <tbody>
                {maintenanceRecords.map((m) => {
                  const veh = vehicles.find((v) => v.id === m.vehicleId);
                  return (
                    <tr key={m.id} className="border-b">
                      <td className="p-2 font-medium border">{m.serviceType}</td>
                      <td className="p-2 font-mono border">{veh?.licensePlate}</td>
                      <td className="p-2 font-mono border">{m.scheduledDate}</td>
                      <td className="p-2 border">{m.status}</td>
                      <td className="p-2 border">{m.serviceProvider}</td>
                      <td className="p-2 font-mono text-right border">${m.actualCost ?? m.estimatedCost}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Signatures */}
          <div className="pt-8 mt-8 border-t flex justify-between text-xs text-slate-600">
            <div>
              <div className="w-48 border-b border-slate-400 mb-1" />
              <div>Fleet Director Authorization</div>
            </div>
            <div>
              <div className="w-48 border-b border-slate-400 mb-1" />
              <div>Compliance Officer Review</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
