import React from 'react';
import {
  Truck,
  Users,
  Wrench,
  Fuel,
  TrendingUp,
  AlertTriangle,
  CheckCircle2,
  Clock,
  ArrowUpRight,
  ShieldAlert,
  Plus,
  Navigation,
  Activity,
  Zap,
} from 'lucide-react';
import { useFleet } from '../../context/FleetContext';
import { StatusBadge } from '../common/StatusBadge';

export const DashboardView: React.FC<DashboardViewProps> = () => {
  const {
    vehicles,
    drivers,
    maintenanceRecords,
    fuelLogs,
    assignments,
    setCurrentTab,
    setSelectedVehicleId,
  } = useFleet();

  const totalVehicles = vehicles.length;
  const activeVehicles = vehicles.filter((v) => v.status === 'Active').length;
  const inMaintenance = vehicles.filter((v) => v.status === 'Maintenance').length;
  const outOfService = vehicles.filter((v) => v.status === 'Out of Service').length;
  const reservedVehicles = vehicles.filter((v) => v.status === 'Reserved').length;

  const operationalRate = totalVehicles > 0 ? Math.round((activeVehicles / totalVehicles) * 100) : 0;

  const activeDrivers = drivers.filter((d) => d.status === 'On Route').length;
  const availableDrivers = drivers.filter((d) => d.status === 'Available').length;

  // Cost summaries
  const totalFuelSpend = fuelLogs.reduce((acc, log) => acc + log.totalCost, 0);
  const totalFuelLiters = fuelLogs.reduce((acc, log) => acc + log.quantity, 0);
  const totalMaintenanceSpend = maintenanceRecords.reduce(
    (acc, m) => acc + (m.actualCost !== undefined ? m.actualCost : m.estimatedCost),
    0
  );

  const pendingMaintenance = maintenanceRecords.filter(
    (m) => m.status === 'Scheduled' || m.status === 'In Progress' || m.status === 'Overdue'
  );
  const overdueMaintenance = maintenanceRecords.filter((m) => m.status === 'Overdue');

  // Chart data for 6 months (mock trend based on real data)
  const monthlyFuelData = [
    { month: 'May', cost: 1120, liters: 780 },
    { month: 'Jun', cost: 1340, liters: 910 },
    { month: 'Jul', cost: 1280, liters: 860 },
    { month: 'Aug', cost: 1450, liters: 980 },
    { month: 'Sep', cost: 1390, liters: 940 },
    { month: 'Oct (MTD)', cost: Math.round(totalFuelSpend), liters: Math.round(totalFuelLiters) },
  ];

  const maxFuelCost = Math.max(...monthlyFuelData.map((d) => d.cost), 1600);

  return (
    <div className="space-y-6">
      {/* Top Banner Alert if Overdue items exist */}
      {overdueMaintenance.length > 0 && (
        <div className="p-4 bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900 rounded-xl flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-rose-600 text-white flex items-center justify-center shrink-0">
              <ShieldAlert className="w-5 h-5" />
            </div>
            <div>
              <div className="text-sm font-bold text-rose-900 dark:text-rose-200">
                Action Required: {overdueMaintenance.length} Overdue Maintenance Work Order{overdueMaintenance.length > 1 ? 's' : ''}
              </div>
              <p className="text-xs text-rose-700 dark:text-rose-300">
                Vehicle FL-107-AZ (Transmission Overhaul) is past scheduled service deadline.
              </p>
            </div>
          </div>
          <button
            onClick={() => setCurrentTab('maintenance')}
            className="px-3.5 py-1.5 bg-rose-600 hover:bg-rose-700 text-white text-xs font-semibold rounded-lg shrink-0 transition-colors shadow-xs"
          >
            Review Service Bay
          </button>
        </div>
      )}

      {/* KPI Cards Strip */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Fleet & Operational Rate */}
        <div
          onClick={() => setCurrentTab('vehicles')}
          className="p-5 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs hover:border-blue-400 transition-colors cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Fleet Capacity
            </span>
            <div className="w-8 h-8 rounded-lg bg-blue-50 dark:bg-blue-950 text-blue-600 dark:text-blue-400 flex items-center justify-center">
              <Truck className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-bold font-mono tabular-nums text-slate-900 dark:text-white">
              {totalVehicles}
            </span>
            <span className="text-xs font-medium text-emerald-600 dark:text-emerald-400">
              {operationalRate}% operational
            </span>
          </div>
          <div className="mt-2 text-xs text-slate-500 flex items-center gap-2">
            <span className="text-emerald-600 dark:text-emerald-400 font-medium font-mono tabular-nums">
              {activeVehicles} Active
            </span>
            <span>·</span>
            <span>{inMaintenance} in service</span>
            <span>·</span>
            <span>{outOfService} inactive</span>
          </div>
        </div>

        {/* Driver Deployment */}
        <div
          onClick={() => setCurrentTab('drivers')}
          className="p-5 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs hover:border-blue-400 transition-colors cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Active Drivers
            </span>
            <div className="w-8 h-8 rounded-lg bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-bold font-mono tabular-nums text-slate-900 dark:text-white">
              {activeDrivers}
            </span>
            <span className="text-xs text-slate-500">
              / {drivers.length} total drivers
            </span>
          </div>
          <div className="mt-2 text-xs text-slate-500 flex items-center gap-2">
            <span className="text-blue-600 dark:text-blue-400 font-medium font-mono tabular-nums">
              {availableDrivers} Available
            </span>
            <span>·</span>
            <span>Avg Rating 4.90/5</span>
          </div>
        </div>

        {/* Maintenance Queue */}
        <div
          onClick={() => setCurrentTab('maintenance')}
          className="p-5 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs hover:border-blue-400 transition-colors cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Service Work Orders
            </span>
            <div className="w-8 h-8 rounded-lg bg-amber-50 dark:bg-amber-950 text-amber-600 dark:text-amber-400 flex items-center justify-center">
              <Wrench className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-bold font-mono tabular-nums text-slate-900 dark:text-white">
              {pendingMaintenance.length}
            </span>
            <span className="text-xs font-medium text-amber-600 dark:text-amber-400">
              {overdueMaintenance.length > 0 ? `${overdueMaintenance.length} Overdue` : 'On schedule'}
            </span>
          </div>
          <div className="mt-2 text-xs text-slate-500 flex items-center gap-2">
            <span>Est. ${totalMaintenanceSpend.toLocaleString()}</span>
            <span>·</span>
            <span>Next in 12 days</span>
          </div>
        </div>

        {/* Fuel & Energy Spend */}
        <div
          onClick={() => setCurrentTab('fuel')}
          className="p-5 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs hover:border-blue-400 transition-colors cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Fuel Spend (MTD)
            </span>
            <div className="w-8 h-8 rounded-lg bg-emerald-50 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
              <Fuel className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-bold font-mono tabular-nums text-slate-900 dark:text-white">
              ${Math.round(totalFuelSpend).toLocaleString()}
            </span>
            <span className="text-xs text-emerald-600 dark:text-emerald-400 flex items-center">
              <TrendingUp className="w-3 h-3 mr-0.5" /> -4.2% vs Sep
            </span>
          </div>
          <div className="mt-2 text-xs text-slate-500 flex items-center gap-2">
            <span className="font-mono tabular-nums">{Math.round(totalFuelLiters).toLocaleString()} Liters</span>
            <span>·</span>
            <span>Avg $1.39/L</span>
          </div>
        </div>
      </div>

      {/* Quick Actions Bar */}
      <div className="p-4 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2 text-xs font-semibold text-slate-700 dark:text-slate-300">
          <Activity className="w-4 h-4 text-blue-600" />
          <span>Quick Dispatch Actions:</span>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => setCurrentTab('vehicles')}
            className="px-3 py-1.5 text-xs font-medium bg-blue-600 hover:bg-blue-700 text-white rounded-lg flex items-center gap-1.5 transition-colors"
          >
            <Plus className="w-3.5 h-3.5" />
            Register Vehicle
          </button>
          <button
            onClick={() => setCurrentTab('assignments')}
            className="px-3 py-1.5 text-xs font-medium bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 rounded-lg flex items-center gap-1.5 transition-colors"
          >
            <Users className="w-3.5 h-3.5 text-slate-500" />
            Assign Driver
          </button>
          <button
            onClick={() => setCurrentTab('maintenance')}
            className="px-3 py-1.5 text-xs font-medium bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 rounded-lg flex items-center gap-1.5 transition-colors"
          >
            <Wrench className="w-3.5 h-3.5 text-slate-500" />
            Book Service
          </button>
          <button
            onClick={() => setCurrentTab('fuel')}
            className="px-3 py-1.5 text-xs font-medium bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 rounded-lg flex items-center gap-1.5 transition-colors"
          >
            <Fuel className="w-3.5 h-3.5 text-slate-500" />
            Log Fuel
          </button>
          <button
            onClick={() => setCurrentTab('tracking')}
            className="px-3 py-1.5 text-xs font-medium bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 rounded-lg flex items-center gap-1.5 transition-colors"
          >
            <Navigation className="w-3.5 h-3.5 text-slate-500" />
            Open GPS Radar
          </button>
        </div>
      </div>

      {/* Two Column Section: Fuel Consumption Chart & Fleet Status Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Monthly Fuel Consumption & Cost Chart (2 cols) */}
        <div className="lg:col-span-2 p-5 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <div>
                <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                  Monthly Fuel & Energy Expenditure
                </h3>
                <p className="text-xs text-slate-500">
                  Fleet fuel spend ($) and volume (L) over the past 6 months
                </p>
              </div>
              <div className="flex items-center gap-4 text-xs">
                <div className="flex items-center gap-1.5 text-slate-600 dark:text-slate-400">
                  <span className="w-3 h-3 rounded-xs bg-blue-600" />
                  <span>Cost ($)</span>
                </div>
                <div className="flex items-center gap-1.5 text-slate-600 dark:text-slate-400">
                  <span className="w-3 h-3 rounded-xs bg-cyan-400" />
                  <span>Volume (L)</span>
                </div>
              </div>
            </div>

            {/* Interactive SVG Bar Chart */}
            <div className="mt-6 h-56 w-full flex items-end gap-3 sm:gap-6 justify-between px-2">
              {monthlyFuelData.map((item, idx) => {
                const costHeightPercent = Math.round((item.cost / maxFuelCost) * 100);
                const volumeHeightPercent = Math.round(((item.liters * 1.3) / maxFuelCost) * 100);
                return (
                  <div key={idx} className="flex-1 flex flex-col items-center gap-2 group h-full justify-end">
                    {/* Tooltip value */}
                    <div className="opacity-0 group-hover:opacity-100 transition-opacity text-[10px] font-mono bg-slate-900 text-white px-2 py-1 rounded pointer-events-none whitespace-nowrap shadow-md mb-1 z-10">
                      ${item.cost} / {item.liters}L
                    </div>

                    {/* Bars pair */}
                    <div className="w-full max-w-[42px] flex items-end justify-center gap-1.5 h-44">
                      {/* Cost bar */}
                      <div
                        style={{ height: `${costHeightPercent}%` }}
                        className="w-1/2 bg-blue-600 group-hover:bg-blue-500 rounded-t transition-all duration-300"
                        title={`Cost: $${item.cost}`}
                      />
                      {/* Liters bar */}
                      <div
                        style={{ height: `${volumeHeightPercent}%` }}
                        className="w-1/2 bg-cyan-400 group-hover:bg-cyan-300 rounded-t transition-all duration-300"
                        title={`Volume: ${item.liters} Liters`}
                      />
                    </div>

                    <span className="text-[11px] font-medium text-slate-500 dark:text-slate-400">
                      {item.month}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs text-slate-500">
            <span>Average Fleet Cost per 100km: <strong className="text-slate-900 dark:text-white font-mono tabular-nums">$14.20</strong></span>
            <button
              onClick={() => setCurrentTab('fuel')}
              className="text-blue-600 dark:text-blue-400 font-semibold hover:underline flex items-center gap-1"
            >
              Detailed Fuel Ledger <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Fleet Vehicle Status Distribution (1 col) */}
        <div className="p-5 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col justify-between">
          <div>
            <div className="pb-3 border-b border-slate-100 dark:border-slate-800">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                Vehicle Status Distribution
              </h3>
              <p className="text-xs text-slate-500">Real-time breakdown of {totalVehicles} registered assets</p>
            </div>

            {/* Progress Bar Visualization */}
            <div className="mt-6 space-y-4">
              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="flex items-center gap-1.5 font-medium text-emerald-700 dark:text-emerald-400">
                    <span className="w-2 h-2 rounded-full bg-emerald-500" /> Active Operational
                  </span>
                  <span className="font-mono tabular-nums font-semibold text-slate-900 dark:text-white">
                    {activeVehicles} ({Math.round((activeVehicles / totalVehicles) * 100)}%)
                  </span>
                </div>
                <div className="w-full h-2 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                  <div
                    className="h-full bg-emerald-500 rounded-full"
                    style={{ width: `${(activeVehicles / totalVehicles) * 100}%` }}
                  />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="flex items-center gap-1.5 font-medium text-amber-700 dark:text-amber-400">
                    <span className="w-2 h-2 rounded-full bg-amber-500" /> Under Maintenance
                  </span>
                  <span className="font-mono tabular-nums font-semibold text-slate-900 dark:text-white">
                    {inMaintenance} ({Math.round((inMaintenance / totalVehicles) * 100)}%)
                  </span>
                </div>
                <div className="w-full h-2 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                  <div
                    className="h-full bg-amber-500 rounded-full"
                    style={{ width: `${(inMaintenance / totalVehicles) * 100}%` }}
                  />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="flex items-center gap-1.5 font-medium text-rose-700 dark:text-rose-400">
                    <span className="w-2 h-2 rounded-full bg-rose-500" /> Out of Service
                  </span>
                  <span className="font-mono tabular-nums font-semibold text-slate-900 dark:text-white">
                    {outOfService} ({Math.round((outOfService / totalVehicles) * 100)}%)
                  </span>
                </div>
                <div className="w-full h-2 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                  <div
                    className="h-full bg-rose-500 rounded-full"
                    style={{ width: `${(outOfService / totalVehicles) * 100}%` }}
                  />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="flex items-center gap-1.5 font-medium text-slate-700 dark:text-slate-300">
                    <span className="w-2 h-2 rounded-full bg-slate-400" /> Reserved / Scheduled
                  </span>
                  <span className="font-mono tabular-nums font-semibold text-slate-900 dark:text-white">
                    {reservedVehicles} ({Math.round((reservedVehicles / totalVehicles) * 100)}%)
                  </span>
                </div>
                <div className="w-full h-2 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                  <div
                    className="h-full bg-slate-400 rounded-full"
                    style={{ width: `${(reservedVehicles / totalVehicles) * 100}%` }}
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="mt-6 pt-3 border-t border-slate-100 dark:border-slate-800 text-xs text-slate-500 flex items-center justify-between">
            <span>Electric Fleet Proportion:</span>
            <span className="font-mono font-bold text-blue-600 dark:text-blue-400 flex items-center gap-1">
              <Zap className="w-3.5 h-3.5" /> 20% EV / Hybrid
            </span>
          </div>
        </div>
      </div>

      {/* Bottom Grid: Live Active Vehicles on Road & Pending Maintenance Schedule */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Vehicles Currently On Route */}
        <div className="p-5 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Navigation className="w-4 h-4 text-blue-600" />
                Live Fleet Deployments
              </h3>
              <p className="text-xs text-slate-500">Vehicles currently dispatched with active telemetry</p>
            </div>
            <button
              onClick={() => setCurrentTab('tracking')}
              className="text-xs text-blue-600 dark:text-blue-400 hover:underline font-semibold"
            >
              Open Full Map →
            </button>
          </div>

          <div className="mt-4 divide-y divide-slate-100 dark:divide-slate-800">
            {vehicles
              .filter((v) => v.status === 'Active' && v.assignedDriverId)
              .slice(0, 4)
              .map((v) => {
                const driver = drivers.find((d) => d.id === v.assignedDriverId);
                return (
                  <div
                    key={v.id}
                    onClick={() => {
                      setSelectedVehicleId(v.id);
                      setCurrentTab('tracking');
                    }}
                    className="py-3 flex items-center justify-between gap-3 hover:bg-slate-50 dark:hover:bg-slate-800/50 px-2 rounded-lg cursor-pointer transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-lg bg-blue-50 dark:bg-blue-950/60 border border-blue-200 dark:border-blue-900 flex items-center justify-center text-blue-600 shrink-0 font-mono text-xs font-bold">
                        {v.licensePlate.split('-')[0]}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-semibold text-xs text-slate-900 dark:text-white">
                            {v.make} {v.model}
                          </span>
                          <span className="font-mono text-[11px] text-slate-500">
                            ({v.licensePlate})
                          </span>
                        </div>
                        <div className="text-[11px] text-slate-500 flex items-center gap-2 mt-0.5">
                          <span>Driver: <strong className="text-slate-700 dark:text-slate-300">{driver?.name || 'Unassigned'}</strong></span>
                          <span>·</span>
                          <span className="font-mono tabular-nums">{v.location.speed} km/h</span>
                        </div>
                      </div>
                    </div>

                    <div className="text-right shrink-0">
                      <div className="text-xs font-mono tabular-nums font-semibold text-slate-800 dark:text-slate-200">
                        {v.fuelLevel}% {v.fuelType === 'Electric' ? 'Batt' : 'Fuel'}
                      </div>
                      <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-medium">
                        On Route
                      </span>
                    </div>
                  </div>
                );
              })}
          </div>
        </div>

        {/* Upcoming Maintenance & Alerts */}
        <div className="p-5 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Wrench className="w-4 h-4 text-amber-500" />
                Service Bay Queue & Upcoming
              </h3>
              <p className="text-xs text-slate-500">Work orders requiring workshop inspection</p>
            </div>
            <button
              onClick={() => setCurrentTab('maintenance')}
              className="text-xs text-blue-600 dark:text-blue-400 hover:underline font-semibold"
            >
              All Records →
            </button>
          </div>

          <div className="mt-4 divide-y divide-slate-100 dark:divide-slate-800">
            {pendingMaintenance.slice(0, 4).map((m) => {
              const veh = vehicles.find((v) => v.id === m.vehicleId);
              return (
                <div key={m.id} className="py-3 flex items-center justify-between gap-3">
                  <div className="flex items-start gap-3">
                    <div className="mt-0.5">
                      <StatusBadge status={m.status} type="maintenance" />
                    </div>
                    <div>
                      <div className="text-xs font-semibold text-slate-900 dark:text-white">
                        {m.serviceType}
                      </div>
                      <div className="text-[11px] text-slate-500 flex items-center gap-2 mt-0.5">
                        <span>Vehicle: <strong className="text-slate-700 dark:text-slate-300">{veh?.licensePlate}</strong></span>
                        <span>·</span>
                        <span className="font-mono tabular-nums">{m.scheduledDate}</span>
                      </div>
                    </div>
                  </div>

                  <div className="text-right shrink-0">
                    <div className="text-xs font-mono tabular-nums font-semibold text-slate-800 dark:text-slate-200">
                      ${m.estimatedCost}
                    </div>
                    <span className="text-[10px] text-slate-500">
                      {m.serviceProvider.split(' ')[0]}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

interface DashboardViewProps {}
