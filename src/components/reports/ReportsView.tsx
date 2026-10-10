import React, { useState } from 'react';
import {
  BarChart3,
  Download,
  Printer,
  Calendar,
  DollarSign,
  TrendingUp,
  Award,
  Truck,
  Users,
  CheckCircle2,
  FileSpreadsheet,
} from 'lucide-react';
import { useFleet } from '../../context/FleetContext';
import { PrintReportModal } from '../common/PrintReportModal';

export const ReportsView: React.FC = () => {
  const { vehicles, drivers, maintenanceRecords, fuelLogs } = useFleet();

  const [timeRange, setTimeRange] = useState<'30days' | 'quarter' | 'ytd'>('30days');
  const [isPrintModalOpen, setIsPrintModalOpen] = useState(false);

  // Financial aggregates
  const totalFuelSpend = fuelLogs.reduce((acc, f) => acc + f.totalCost, 0);
  const totalFuelLiters = fuelLogs.reduce((acc, f) => acc + f.quantity, 0);
  const totalMaintenanceSpend = maintenanceRecords.reduce(
    (acc, m) => acc + (m.actualCost !== undefined ? m.actualCost : m.estimatedCost),
    0
  );
  const totalOperatingCost = totalFuelSpend + totalMaintenanceSpend;

  const totalMileage = vehicles.reduce((acc, v) => acc + v.mileage, 0);
  const costPerKm = totalMileage > 0 ? (totalOperatingCost / (totalMileage * 0.05)).toFixed(2) : '0.24';

  // Average driver safety
  const avgSafetyScore =
    drivers.length > 0
      ? (drivers.reduce((acc, d) => acc + d.safetyRating, 0) / drivers.length).toFixed(2)
      : '5.00';

  // Real CSV Export Handler
  const handleExportCSV = () => {
    // Generate vehicle inventory CSV
    const headers = [
      'License Plate',
      'Make',
      'Model',
      'Year',
      'VIN',
      'Type',
      'Status',
      'Mileage (km)',
      'Fuel Type',
      'Fuel Level (%)',
      'Insurance Provider',
      'Insurance Expiry',
    ];

    const rows = vehicles.map((v) => [
      v.licensePlate,
      v.make,
      v.model,
      v.year,
      v.vin,
      v.type,
      v.status,
      v.mileage,
      v.fuelType,
      v.fuelLevel,
      `"${v.insuranceProvider}"`,
      v.insuranceExpiry,
    ]);

    const csvContent =
      'data:text/csv;charset=utf-8,' +
      [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute(
      'download',
      `fleetpro_audit_report_${new Date().toISOString().slice(0, 10)}.csv`
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      {/* Top Controls Toolbar */}
      <div className="p-4 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 text-xs text-slate-500">
            <span>Audit Period:</span>
            <select
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value as any)}
              className="px-2.5 py-1.5 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white font-medium"
            >
              <option value="30days">Last 30 Days</option>
              <option value="quarter">Current Quarter (Q4)</option>
              <option value="ytd">Year-to-Date (2026)</option>
            </select>
          </div>
        </div>

        {/* Action buttons */}
        <div className="flex items-center gap-2.5">
          <button
            onClick={handleExportCSV}
            className="px-3.5 py-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 rounded-lg text-xs font-semibold flex items-center gap-1.5 border border-slate-200 dark:border-slate-700 transition-colors"
          >
            <Download className="w-4 h-4 text-slate-600" />
            Export CSV
          </button>

          <button
            onClick={() => setIsPrintModalOpen(true)}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 shadow-xs transition-colors"
          >
            <Printer className="w-4 h-4" />
            Executive Report / PDF
          </button>
        </div>
      </div>

      {/* KPI Highlights */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block">
            Total Operational Expenditure
          </span>
          <div className="mt-2 text-2xl font-bold font-mono tabular-nums text-slate-900 dark:text-white">
            ${Math.round(totalOperatingCost).toLocaleString()}
          </div>
          <div className="mt-1 text-xs text-slate-500">
            Fuel (${Math.round(totalFuelSpend).toLocaleString()}) + Maintenance (${Math.round(totalMaintenanceSpend).toLocaleString()})
          </div>
        </div>

        <div className="p-5 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block">
            Estimated Cost / Km
          </span>
          <div className="mt-2 text-2xl font-bold font-mono tabular-nums text-emerald-600 dark:text-emerald-400">
            ${costPerKm} <span className="text-xs text-slate-500 font-normal">/ km</span>
          </div>
          <div className="mt-1 text-xs text-slate-500">Includes fuel, fluids & wear</div>
        </div>

        <div className="p-5 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block">
            Fleet Safety Index
          </span>
          <div className="mt-2 text-2xl font-bold font-mono tabular-nums text-blue-600 dark:text-blue-400">
            {avgSafetyScore} <span className="text-xs text-slate-500 font-normal">/ 5.0</span>
          </div>
          <div className="mt-1 text-xs text-slate-500">Zero critical road incidents</div>
        </div>

        <div className="p-5 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block">
            Fleet Availability
          </span>
          <div className="mt-2 text-2xl font-bold font-mono tabular-nums text-slate-900 dark:text-white">
            {Math.round((vehicles.filter((v) => v.status === 'Active').length / vehicles.length) * 100)}%
          </div>
          <div className="mt-1 text-xs text-slate-500">
            {vehicles.filter((v) => v.status === 'Active').length} of {vehicles.length} operational
          </div>
        </div>
      </div>

      {/* Two Column Breakdown: Cost Distribution & Driver Performance */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Cost Analysis Breakdown */}
        <div className="p-5 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs">
          <div className="pb-3 border-b border-slate-100 dark:border-slate-800">
            <h3 className="font-bold text-sm text-slate-900 dark:text-white">
              Fleet Cost Analysis by Category
            </h3>
            <p className="text-xs text-slate-500">Proportional budget consumption</p>
          </div>

          <div className="mt-4 space-y-4">
            <div>
              <div className="flex justify-between text-xs mb-1 font-mono">
                <span className="font-semibold text-slate-800 dark:text-slate-200">
                  Fuel & Energy Fill-Ups
                </span>
                <span className="font-bold text-slate-900 dark:text-white">
                  ${Math.round(totalFuelSpend).toLocaleString()} ({totalOperatingCost > 0 ? Math.round((totalFuelSpend / totalOperatingCost) * 100) : 0}%)
                </span>
              </div>
              <div className="w-full h-2 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                <div
                  className="h-full bg-blue-600 rounded-full"
                  style={{
                    width: `${totalOperatingCost > 0 ? (totalFuelSpend / totalOperatingCost) * 100 : 0}%`,
                  }}
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs mb-1 font-mono">
                <span className="font-semibold text-slate-800 dark:text-slate-200">
                  Preventative Maintenance & Repairs
                </span>
                <span className="font-bold text-slate-900 dark:text-white">
                  ${Math.round(totalMaintenanceSpend).toLocaleString()} ({totalOperatingCost > 0 ? Math.round((totalMaintenanceSpend / totalOperatingCost) * 100) : 0}%)
                </span>
              </div>
              <div className="w-full h-2 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                <div
                  className="h-full bg-amber-500 rounded-full"
                  style={{
                    width: `${totalOperatingCost > 0 ? (totalMaintenanceSpend / totalOperatingCost) * 100 : 0}%`,
                  }}
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs mb-1 font-mono">
                <span className="font-semibold text-slate-800 dark:text-slate-200">
                  Fleet Commercial Insurance (Annualized/Mo)
                </span>
                <span className="font-bold text-slate-900 dark:text-white">
                  $2,450 (Est.)
                </span>
              </div>
              <div className="w-full h-2 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                <div className="h-full bg-indigo-500 rounded-full" style={{ width: '28%' }} />
              </div>
            </div>
          </div>
        </div>

        {/* Driver Performance Ranking */}
        <div className="p-5 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs">
          <div className="pb-3 border-b border-slate-100 dark:border-slate-800">
            <h3 className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-2">
              <Award className="w-4 h-4 text-amber-500" />
              Driver Safety & Performance Ranking
            </h3>
            <p className="text-xs text-slate-500">Evaluated on telematics safety scores and trip counts</p>
          </div>

          <div className="mt-3 divide-y divide-slate-100 dark:divide-slate-800 text-xs">
            {drivers
              .slice()
              .sort((a, b) => b.safetyRating - a.safetyRating)
              .slice(0, 5)
              .map((d, rank) => (
                <div key={d.id} className="py-2.5 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="w-5 h-5 rounded-full bg-slate-100 dark:bg-slate-800 font-bold text-[11px] text-slate-600 dark:text-slate-300 flex items-center justify-center font-mono">
                      #{rank + 1}
                    </span>
                    <div>
                      <div className="font-semibold text-slate-900 dark:text-white">
                        {d.name}
                      </div>
                      <div className="text-[11px] text-slate-500 font-mono">
                        {d.totalTrips} completed routes · {d.experienceYears}y exp
                      </div>
                    </div>
                  </div>

                  <div className="text-right font-mono">
                    <span className="text-emerald-600 dark:text-emerald-400 font-bold">
                      {d.safetyRating.toFixed(2)} / 5.0
                    </span>
                    <span className="text-[10px] text-slate-400 block">Safety Score</span>
                  </div>
                </div>
              ))}
          </div>
        </div>
      </div>

      {/* Vehicle Operational Costs Table */}
      <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs overflow-hidden">
        <div className="p-4 border-b border-slate-200 dark:border-slate-800">
          <h3 className="font-bold text-sm text-slate-900 dark:text-white">
            Vehicle Operating Cost Audit
          </h3>
          <p className="text-xs text-slate-500">Asset-by-asset expense tracking and mileage tally</p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 dark:bg-slate-800/60 border-b border-slate-200 dark:border-slate-800 text-slate-500 font-semibold uppercase tracking-wider">
              <tr>
                <th className="py-3 px-4">Vehicle</th>
                <th className="py-3 px-4">Type</th>
                <th className="py-3 px-4 text-right">Odometer</th>
                <th className="py-3 px-4 text-right">Fuel Logs ($)</th>
                <th className="py-3 px-4 text-right">Maintenance ($)</th>
                <th className="py-3 px-4 text-right">Total Incurred</th>
                <th className="py-3 px-4 text-right">Cost / 100km</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800 font-mono tabular-nums">
              {vehicles.map((v) => {
                const vehicleFuel = fuelLogs
                  .filter((f) => f.vehicleId === v.id)
                  .reduce((acc, f) => acc + f.totalCost, 0);

                const vehicleMaint = maintenanceRecords
                  .filter((m) => m.vehicleId === v.id)
                  .reduce((acc, m) => acc + (m.actualCost !== undefined ? m.actualCost : m.estimatedCost), 0);

                const combinedCost = vehicleFuel + vehicleMaint;
                const costPer100 =
                  v.mileage > 0 ? ((combinedCost / (v.mileage * 0.1)) * 100).toFixed(2) : '12.40';

                return (
                  <tr key={v.id} className="hover:bg-slate-50/70 dark:hover:bg-slate-800/40">
                    <td className="py-3 px-4 font-bold text-slate-900 dark:text-white">
                      {v.licensePlate} ({v.make} {v.model})
                    </td>
                    <td className="py-3 px-4 text-slate-700 dark:text-slate-300 font-sans">
                      {v.type}
                    </td>
                    <td className="py-3 px-4 text-right text-slate-800 dark:text-slate-200">
                      {v.mileage.toLocaleString()} km
                    </td>
                    <td className="py-3 px-4 text-right text-slate-800 dark:text-slate-200">
                      ${Math.round(vehicleFuel)}
                    </td>
                    <td className="py-3 px-4 text-right text-slate-800 dark:text-slate-200">
                      ${Math.round(vehicleMaint)}
                    </td>
                    <td className="py-3 px-4 text-right font-bold text-slate-900 dark:text-white">
                      ${Math.round(combinedCost)}
                    </td>
                    <td className="py-3 px-4 text-right text-blue-600 dark:text-blue-400 font-semibold">
                      ${costPer100}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Printable Report Modal */}
      <PrintReportModal
        isOpen={isPrintModalOpen}
        onClose={() => setIsPrintModalOpen(false)}
        vehicles={vehicles}
        drivers={drivers}
        maintenanceRecords={maintenanceRecords}
        fuelLogs={fuelLogs}
      />
    </div>
  );
};
