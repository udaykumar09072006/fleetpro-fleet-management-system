import React, { useState, useMemo } from 'react';
import {
  Fuel,
  Plus,
  Search,
  Filter,
  DollarSign,
  TrendingDown,
  Gauge,
  Calendar,
  Building,
  CheckCircle2,
  Trash2,
  X,
  Sparkles,
  Zap,
} from 'lucide-react';
import { useFleet } from '../../context/FleetContext';
import { FuelLog } from '../../types';

export const FuelManagementView: React.FC = () => {
  const { fuelLogs, vehicles, drivers, addFuelLog, deleteFuelLog, searchQuery } = useFleet();

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [vehicleFilter, setVehicleFilter] = useState<string>('All');
  const [deletingId, setDeletingId] = useState<string | null>(null);

  // Calculations
  const totalSpend = fuelLogs.reduce((acc, log) => acc + log.totalCost, 0);
  const totalVolume = fuelLogs.reduce((acc, log) => acc + log.quantity, 0);
  const avgUnitCost = totalVolume > 0 ? (totalSpend / totalVolume).toFixed(2) : '0.00';

  // Filtered fuel records
  const filteredLogs = useMemo(() => {
    return fuelLogs.filter((log) => {
      const vehicle = vehicles.find((v) => v.id === log.vehicleId);
      const driver = drivers.find((d) => d.id === log.driverId);
      const q = searchQuery.toLowerCase();

      const matchSearch =
        !q ||
        log.fuelStation.toLowerCase().includes(q) ||
        vehicle?.licensePlate.toLowerCase().includes(q) ||
        driver?.name.toLowerCase().includes(q);

      const matchVehicle = vehicleFilter === 'All' || log.vehicleId === vehicleFilter;

      return matchSearch && matchVehicle;
    });
  }, [fuelLogs, vehicles, drivers, searchQuery, vehicleFilter]);

  return (
    <div className="space-y-6">
      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs">
          <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
            Total Fuel Expenditure
          </div>
          <div className="mt-2 text-2xl font-bold font-mono text-slate-900 dark:text-white">
            ${Math.round(totalSpend).toLocaleString()}
          </div>
          <div className="mt-1 text-xs text-slate-500">Across {fuelLogs.length} logged fill-ups</div>
        </div>

        <div className="p-4 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs">
          <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
            Total Fuel Volume
          </div>
          <div className="mt-2 text-2xl font-bold font-mono text-slate-900 dark:text-white">
            {Math.round(totalVolume).toLocaleString()}{' '}
            <span className="text-sm font-normal text-slate-500">Liters</span>
          </div>
          <div className="mt-1 text-xs text-slate-500">Diesel, Unleaded & EV units</div>
        </div>

        <div className="p-4 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs">
          <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
            Average Unit Cost
          </div>
          <div className="mt-2 text-2xl font-bold font-mono text-slate-900 dark:text-white">
            ${avgUnitCost}{' '}
            <span className="text-sm font-normal text-slate-500">/ Liter</span>
          </div>
          <div className="mt-1 text-xs text-emerald-600 dark:text-emerald-400">
            Bulk commercial fleet rate
          </div>
        </div>

        <div className="p-4 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs">
          <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
            Fleet Fuel Economy
          </div>
          <div className="mt-2 text-2xl font-bold font-mono text-blue-600 dark:text-blue-400">
            12.8{' '}
            <span className="text-sm font-normal text-slate-500">L/100km</span>
          </div>
          <div className="mt-1 text-xs text-slate-500">≈ 18.4 MPG average</div>
        </div>
      </div>

      {/* Main Table Container */}
      <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs overflow-hidden">
        {/* Table Header toolbar */}
        <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5 text-xs text-slate-500">
              <span>Filter Vehicle:</span>
              <select
                value={vehicleFilter}
                onChange={(e) => setVehicleFilter(e.target.value)}
                className="px-2.5 py-1.5 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white font-medium"
              >
                <option value="All">All Vehicles</option>
                {vehicles.map((v) => (
                  <option key={v.id} value={v.id}>
                    {v.licensePlate} ({v.make} {v.model})
                  </option>
                ))}
              </select>
            </div>
          </div>

          <button
            onClick={() => setIsAddModalOpen(true)}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 shadow-xs transition-colors"
          >
            <Plus className="w-4 h-4" />
            Log Fuel Fill-Up
          </button>
        </div>

        {/* Fuel Logs Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 dark:bg-slate-800/60 border-b border-slate-200 dark:border-slate-800 text-slate-500 font-semibold uppercase tracking-wider">
              <tr>
                <th className="py-3 px-4">Date</th>
                <th className="py-3 px-4">Vehicle</th>
                <th className="py-3 px-4">Driver</th>
                <th className="py-3 px-4">Station / Location</th>
                <th className="py-3 px-4 text-right">Odometer</th>
                <th className="py-3 px-4 text-right">Volume</th>
                <th className="py-3 px-4 text-right">Price / L</th>
                <th className="py-3 px-4 text-right">Total Cost</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {filteredLogs.map((log) => {
                const vehicle = vehicles.find((v) => v.id === log.vehicleId);
                const driver = drivers.find((d) => d.id === log.driverId);
                const isEV = vehicle?.fuelType === 'Electric';

                return (
                  <tr key={log.id} className="hover:bg-slate-50/70 dark:hover:bg-slate-800/40">
                    {/* Date */}
                    <td className="py-3.5 px-4 font-mono tabular-nums text-slate-600 dark:text-slate-400">
                      {log.date}
                    </td>

                    {/* Vehicle */}
                    <td className="py-3.5 px-4 font-semibold text-slate-900 dark:text-white">
                      <div>{vehicle?.licensePlate || log.vehicleId}</div>
                      <div className="text-[11px] font-normal text-slate-500">
                        {vehicle ? `${vehicle.make} ${vehicle.model}` : 'Vehicle'}
                      </div>
                    </td>

                    {/* Driver */}
                    <td className="py-3.5 px-4 text-slate-800 dark:text-slate-200">
                      {driver?.name || 'Unassigned'}
                    </td>

                    {/* Station */}
                    <td className="py-3.5 px-4 text-slate-700 dark:text-slate-300">
                      <div className="flex items-center gap-1.5">
                        {isEV ? (
                          <Zap className="w-3.5 h-3.5 text-blue-500 shrink-0" />
                        ) : (
                          <Fuel className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                        )}
                        <span>{log.fuelStation}</span>
                      </div>
                      {log.notes && (
                        <div className="text-[10px] text-slate-400 italic mt-0.5 truncate max-w-xs">
                          {log.notes}
                        </div>
                      )}
                    </td>

                    {/* Odometer */}
                    <td className="py-3.5 px-4 text-right font-mono tabular-nums text-slate-800 dark:text-slate-200">
                      {log.odometer.toLocaleString()} km
                    </td>

                    {/* Volume */}
                    <td className="py-3.5 px-4 text-right font-mono tabular-nums font-semibold text-slate-900 dark:text-white">
                      {log.quantity.toFixed(1)} {isEV ? 'kWh' : 'L'}
                    </td>

                    {/* Unit Cost */}
                    <td className="py-3.5 px-4 text-right font-mono tabular-nums text-slate-600 dark:text-slate-400">
                      ${log.unitCost.toFixed(2)}
                    </td>

                    {/* Total Cost */}
                    <td className="py-3.5 px-4 text-right font-mono tabular-nums font-bold text-slate-900 dark:text-white">
                      ${log.totalCost.toFixed(2)}
                    </td>

                    {/* Actions */}
                    <td className="py-3.5 px-4 text-right">
                      <button
                        onClick={() => setDeletingId(log.id)}
                        className="p-1.5 rounded text-slate-400 hover:text-rose-600 hover:bg-slate-100"
                        title="Delete log"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                );
              })}

              {filteredLogs.length === 0 && (
                <tr>
                  <td colSpan={9} className="py-10 text-center text-slate-400 italic">
                    No fuel logs recorded matching this filter.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* LOG FUEL MODAL */}
      {isAddModalOpen && (
        <FuelLogModal
          isOpen={isAddModalOpen}
          vehicles={vehicles}
          drivers={drivers}
          onClose={() => setIsAddModalOpen(false)}
          onSave={(data) => {
            addFuelLog(data);
            setIsAddModalOpen(false);
          }}
        />
      )}

      {/* DELETE CONFIRMATION */}
      {deletingId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="w-full max-w-sm bg-white dark:bg-slate-900 rounded-xl shadow-xl border border-slate-200 dark:border-slate-800 p-6 space-y-4">
            <div className="w-10 h-10 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center mx-auto">
              <Trash2 className="w-5 h-5" />
            </div>
            <div className="text-center">
              <h3 className="font-bold text-slate-900 dark:text-white">Delete Fuel Log</h3>
              <p className="text-xs text-slate-500 mt-1">
                Are you sure you want to remove this fuel fill-up transaction?
              </p>
            </div>
            <div className="flex items-center gap-3 pt-2">
              <button
                onClick={() => setDeletingId(null)}
                className="w-1/2 py-2 text-xs font-semibold rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-50"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  deleteFuelLog(deletingId);
                  setDeletingId(null);
                }}
                className="w-1/2 py-2 text-xs font-semibold rounded-lg bg-rose-600 hover:bg-rose-700 text-white"
              >
                Yes, Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// Fuel Log Form Modal
interface FuelLogModalProps {
  isOpen: boolean;
  vehicles: any[];
  drivers: any[];
  onClose: () => void;
  onSave: (data: Omit<FuelLog, 'id'>) => void;
}

const FuelLogModal: React.FC<FuelLogModalProps> = ({
  isOpen,
  vehicles,
  drivers,
  onClose,
  onSave,
}) => {
  const [vehicleId, setVehicleId] = useState(vehicles[0]?.id || '');
  const [driverId, setDriverId] = useState(drivers[0]?.id || '');
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10));
  const selectedVehicle = vehicles.find((v) => v.id === vehicleId);

  const [odometer, setOdometer] = useState(selectedVehicle?.mileage || 50000);
  const [quantity, setQuantity] = useState(65.0);
  const [unitCost, setUnitCost] = useState(1.48);
  const [fuelStation, setFuelStation] = useState('Shell Commercial Fleet Hub');
  const [fullTank, setFullTank] = useState(true);
  const [notes, setNotes] = useState('');

  // Update odometer when vehicle changes
  React.useEffect(() => {
    if (selectedVehicle) {
      setOdometer(selectedVehicle.mileage);
    }
  }, [vehicleId, selectedVehicle]);

  const totalCost = Number((quantity * unitCost).toFixed(2));

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!vehicleId || !driverId || quantity <= 0 || unitCost <= 0) return;

    onSave({
      vehicleId,
      driverId,
      date,
      odometer: Number(odometer),
      quantity: Number(quantity),
      unitCost: Number(unitCost),
      totalCost,
      fuelStation,
      fullTank,
      notes,
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <div className="w-full max-w-lg bg-white dark:bg-slate-900 rounded-xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Fuel className="w-5 h-5 text-blue-600" />
            <h3 className="font-bold text-slate-900 dark:text-white">Record Fuel Fill-Up</h3>
          </div>
          <button onClick={onClose} className="p-1 rounded text-slate-400 hover:text-slate-600">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Vehicle *
              </label>
              <select
                value={vehicleId}
                onChange={(e) => setVehicleId(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-mono"
              >
                {vehicles.map((v) => (
                  <option key={v.id} value={v.id}>
                    {v.licensePlate} - {v.make} ({v.fuelType})
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Driver *
              </label>
              <select
                value={driverId}
                onChange={(e) => setDriverId(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
              >
                {drivers.map((d) => (
                  <option key={d.id} value={d.id}>
                    {d.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Transaction Date *
              </label>
              <input
                type="date"
                required
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Odometer Reading (km) *
              </label>
              <input
                type="number"
                required
                min="0"
                value={odometer}
                onChange={(e) => setOdometer(Number(e.target.value))}
                className="w-full px-3 py-2 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-mono"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Quantity (L) *
              </label>
              <input
                type="number"
                step="0.1"
                min="0.1"
                required
                value={quantity}
                onChange={(e) => setQuantity(Number(e.target.value))}
                className="w-full px-3 py-2 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-mono"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Cost per Liter ($) *
              </label>
              <input
                type="number"
                step="0.01"
                min="0.01"
                required
                value={unitCost}
                onChange={(e) => setUnitCost(Number(e.target.value))}
                className="w-full px-3 py-2 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-mono"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Calculated Total ($)
              </label>
              <div className="px-3 py-2 text-xs font-mono font-bold text-slate-900 dark:text-white bg-slate-50 dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700">
                ${totalCost}
              </div>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Fuel Station / Charging Hub
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Shell Commercial #42, Love's Travel Stop"
              value={fuelStation}
              onChange={(e) => setFuelStation(e.target.value)}
              className="w-full px-3 py-2 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
            />
          </div>

          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="fullTank"
              checked={fullTank}
              onChange={(e) => setFullTank(e.target.checked)}
              className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500"
            />
            <label htmlFor="fullTank" className="text-xs text-slate-700 dark:text-slate-300 font-medium">
              Filled to full tank (resets vehicle fuel gauge to 100%)
            </label>
          </div>

          <div className="pt-3 border-t border-slate-200 dark:border-slate-800 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-semibold shadow-xs"
            >
              Record Fuel Log
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
