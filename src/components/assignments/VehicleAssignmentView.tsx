import React, { useState } from 'react';
import {
  ArrowRightLeft,
  Plus,
  Truck,
  Users,
  Clock,
  CheckCircle2,
  AlertCircle,
  MapPin,
  Calendar,
  X,
  Route,
  LogOut,
} from 'lucide-react';
import { useFleet } from '../../context/FleetContext';
import { Assignment } from '../../types';
import { StatusBadge } from '../common/StatusBadge';

export const VehicleAssignmentView: React.FC = () => {
  const { vehicles, drivers, assignments, createAssignment, endAssignment } = useFleet();

  const [activeTab, setActiveTab] = useState<'active' | 'history'>('active');
  const [isAssignModalOpen, setIsAssignModalOpen] = useState(false);
  const [endingAssignment, setEndingAssignment] = useState<Assignment | null>(null);

  const activeAssignments = assignments.filter((a) => a.status === 'Active');
  const completedAssignments = assignments.filter((a) => a.status === 'Completed');

  return (
    <div className="space-y-6">
      {/* Metrics strip */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-4 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs">
          <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
            Active Deployments
          </div>
          <div className="mt-2 text-2xl font-bold font-mono text-slate-900 dark:text-white">
            {activeAssignments.length}
          </div>
          <div className="mt-1 text-xs text-emerald-600 dark:text-emerald-400">
            Vehicles actively on dispatch routes
          </div>
        </div>

        <div className="p-4 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs">
          <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
            Completed Trips
          </div>
          <div className="mt-2 text-2xl font-bold font-mono text-slate-900 dark:text-white">
            {completedAssignments.length}
          </div>
          <div className="mt-1 text-xs text-slate-500">
            Recorded route shift completions
          </div>
        </div>

        <div className="p-4 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs">
          <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
            Fleet Deployment Rate
          </div>
          <div className="mt-2 text-2xl font-bold font-mono text-slate-900 dark:text-white">
            {vehicles.length > 0 ? Math.round((activeAssignments.length / vehicles.length) * 100) : 0}%
          </div>
          <div className="mt-1 text-xs text-blue-600 dark:text-blue-400">
            Fleet allocation capacity
          </div>
        </div>
      </div>

      {/* Main Container */}
      <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs overflow-hidden">
        {/* Header Toolbar */}
        <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveTab('active')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
                activeTab === 'active'
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              Active Assignments ({activeAssignments.length})
            </button>
            <button
              onClick={() => setActiveTab('history')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
                activeTab === 'history'
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              Assignment History ({completedAssignments.length})
            </button>
          </div>

          <button
            onClick={() => setIsAssignModalOpen(true)}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 shadow-xs transition-colors"
          >
            <Plus className="w-4 h-4" />
            Dispatch New Assignment
          </button>
        </div>

        {/* Assignments Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 dark:bg-slate-800/60 border-b border-slate-200 dark:border-slate-800 text-slate-500 font-semibold uppercase tracking-wider">
              <tr>
                <th className="py-3 px-4">Vehicle</th>
                <th className="py-3 px-4">Driver Assigned</th>
                <th className="py-3 px-4">Route Purpose</th>
                <th className="py-3 px-4">Start Time</th>
                <th className="py-3 px-4">Odometer Log</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {(activeTab === 'active' ? activeAssignments : completedAssignments).map((item) => {
                const vehicle = vehicles.find((v) => v.id === item.vehicleId);
                const driver = drivers.find((d) => d.id === item.driverId);
                const tripKm = item.endOdometer ? item.endOdometer - item.startOdometer : null;

                return (
                  <tr key={item.id} className="hover:bg-slate-50/70 dark:hover:bg-slate-800/40">
                    {/* Vehicle */}
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-2.5">
                        <div className="w-7 h-7 rounded-lg bg-blue-50 dark:bg-blue-950 text-blue-600 flex items-center justify-center shrink-0">
                          <Truck className="w-4 h-4" />
                        </div>
                        <div>
                          <div className="font-semibold text-slate-900 dark:text-white">
                            {vehicle ? `${vehicle.make} ${vehicle.model}` : 'Unknown Vehicle'}
                          </div>
                          <div className="text-[11px] font-mono text-slate-500">
                            {vehicle?.licensePlate || item.vehicleId}
                          </div>
                        </div>
                      </div>
                    </td>

                    {/* Driver */}
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold text-[10px] flex items-center justify-center">
                          {driver ? driver.name.charAt(0) : '?'}
                        </div>
                        <div>
                          <div className="font-medium text-slate-900 dark:text-white">
                            {driver?.name || 'Unassigned'}
                          </div>
                          <div className="text-[10px] text-slate-400 font-mono">
                            {driver?.phone}
                          </div>
                        </div>
                      </div>
                    </td>

                    {/* Route purpose */}
                    <td className="py-3.5 px-4 max-w-xs">
                      <div className="font-medium text-slate-800 dark:text-slate-200">
                        {item.routePurpose}
                      </div>
                      {item.notes && (
                        <div className="text-[11px] text-slate-400 truncate mt-0.5">
                          {item.notes}
                        </div>
                      )}
                    </td>

                    {/* Start Time */}
                    <td className="py-3.5 px-4 font-mono text-[11px] tabular-nums text-slate-600 dark:text-slate-400">
                      <div>{item.startTime}</div>
                      {item.endTime && (
                        <div className="text-slate-400 text-[10px]">End: {item.endTime}</div>
                      )}
                    </td>

                    {/* Odometer */}
                    <td className="py-3.5 px-4 font-mono text-[11px] tabular-nums">
                      <div>Start: {item.startOdometer.toLocaleString()} km</div>
                      {item.endOdometer && (
                        <div className="text-emerald-600 dark:text-emerald-400 font-semibold">
                          End: {item.endOdometer.toLocaleString()} km ({tripKm} km driven)
                        </div>
                      )}
                    </td>

                    {/* Status */}
                    <td className="py-3.5 px-4">
                      {item.status === 'Active' ? (
                        <span className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-200 dark:border-emerald-800">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                          Active Shift
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-xs text-slate-600 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded border border-slate-200 dark:border-slate-700">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                          Completed
                        </span>
                      )}
                    </td>

                    {/* Actions */}
                    <td className="py-3.5 px-4 text-right">
                      {item.status === 'Active' ? (
                        <button
                          onClick={() => setEndingAssignment(item)}
                          className="px-2.5 py-1 text-xs font-semibold bg-slate-100 dark:bg-slate-800 hover:bg-rose-50 hover:text-rose-600 dark:hover:bg-rose-950/40 text-slate-700 dark:text-slate-300 rounded-md border border-slate-200 dark:border-slate-700 transition-colors"
                        >
                          Complete Shift
                        </button>
                      ) : (
                        <span className="text-xs text-slate-400">—</span>
                      )}
                    </td>
                  </tr>
                );
              })}

              {(activeTab === 'active' ? activeAssignments : completedAssignments).length === 0 && (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-slate-400 italic">
                    No {activeTab} assignments recorded in this log.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* CREATE ASSIGNMENT MODAL */}
      {isAssignModalOpen && (
        <CreateAssignmentModal
          isOpen={isAssignModalOpen}
          onClose={() => setIsAssignModalOpen(false)}
          vehicles={vehicles}
          drivers={drivers}
          onAssign={(data) => {
            createAssignment(data);
            setIsAssignModalOpen(false);
          }}
        />
      )}

      {/* END ASSIGNMENT MODAL */}
      {endingAssignment && (
        <EndAssignmentModal
          isOpen={!!endingAssignment}
          assignment={endingAssignment}
          vehicle={vehicles.find((v) => v.id === endingAssignment.vehicleId)}
          driver={drivers.find((d) => d.id === endingAssignment.driverId)}
          onClose={() => setEndingAssignment(null)}
          onComplete={(endOdo, notes) => {
            endAssignment(endingAssignment.id, endOdo, notes);
            setEndingAssignment(null);
          }}
        />
      )}
    </div>
  );
};

// Create Assignment Modal
interface CreateAssignmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  vehicles: any[];
  drivers: any[];
  onAssign: (data: {
    vehicleId: string;
    driverId: string;
    routePurpose: string;
    startOdometer: number;
    notes?: string;
  }) => void;
}

const CreateAssignmentModal: React.FC<CreateAssignmentModalProps> = ({
  isOpen,
  onClose,
  vehicles,
  drivers,
  onAssign,
}) => {
  // Filter available vehicles and drivers
  const availableVehicles = vehicles.filter(
    (v) => (v.status === 'Active' || v.status === 'Reserved') && !v.assignedDriverId
  );
  const availableDrivers = drivers.filter(
    (d) => d.status === 'Available' || !d.assignedVehicleId
  );

  const [selectedVehicleId, setSelectedVehicleId] = useState(
    availableVehicles[0]?.id || vehicles[0]?.id || ''
  );
  const [selectedDriverId, setSelectedDriverId] = useState(
    availableDrivers[0]?.id || drivers[0]?.id || ''
  );
  const [routePurpose, setRoutePurpose] = useState('');
  const [notes, setNotes] = useState('');

  const currentVehicle = vehicles.find((v) => v.id === selectedVehicleId);
  const [startOdometer, setStartOdometer] = useState(currentVehicle?.mileage || 0);

  // Update odometer when vehicle changes
  React.useEffect(() => {
    if (currentVehicle) {
      setStartOdometer(currentVehicle.mileage);
    }
  }, [selectedVehicleId, currentVehicle]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedVehicleId || !selectedDriverId || !routePurpose) return;

    onAssign({
      vehicleId: selectedVehicleId,
      driverId: selectedDriverId,
      routePurpose,
      startOdometer: Number(startOdometer),
      notes,
    });
  };

  const isVehicleMaintenanceOrOut =
    currentVehicle?.status === 'Maintenance' || currentVehicle?.status === 'Out of Service';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <div className="w-full max-w-lg bg-white dark:bg-slate-900 rounded-xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Route className="w-5 h-5 text-blue-600" />
            <h3 className="font-bold text-slate-900 dark:text-white">Dispatch New Vehicle Shift</h3>
          </div>
          <button onClick={onClose} className="p-1 rounded text-slate-400 hover:text-slate-600">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Vehicle select */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Select Fleet Vehicle *
            </label>
            <select
              value={selectedVehicleId}
              onChange={(e) => setSelectedVehicleId(e.target.value)}
              className="w-full px-3 py-2 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
            >
              {vehicles.map((v) => (
                <option key={v.id} value={v.id}>
                  {v.licensePlate} - {v.make} {v.model} ({v.status}) {v.assignedDriverId ? '[Currently Assigned]' : ''}
                </option>
              ))}
            </select>
            {isVehicleMaintenanceOrOut && (
              <p className="mt-1 text-xs text-rose-600 font-medium flex items-center gap-1">
                <AlertCircle className="w-3.5 h-3.5" /> Warning: This vehicle is currently {currentVehicle?.status}!
              </p>
            )}
          </div>

          {/* Driver select */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Select Driver *
            </label>
            <select
              value={selectedDriverId}
              onChange={(e) => setSelectedDriverId(e.target.value)}
              className="w-full px-3 py-2 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
            >
              {drivers.map((d) => (
                <option key={d.id} value={d.id}>
                  {d.name} ({d.status}) - {d.licenseCategory}
                </option>
              ))}
            </select>
          </div>

          {/* Route purpose */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Route Destination / Shift Purpose *
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Daily Metro Delivery Loop - North Sector"
              value={routePurpose}
              onChange={(e) => setRoutePurpose(e.target.value)}
              className="w-full px-3 py-2 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
            />
          </div>

          {/* Start Odometer */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Starting Odometer (km)
            </label>
            <input
              type="number"
              value={startOdometer}
              onChange={(e) => setStartOdometer(Number(e.target.value))}
              className="w-full px-3 py-2 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-mono"
            />
          </div>

          {/* Notes */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Special Route Instructions
            </label>
            <textarea
              rows={2}
              placeholder="e.g. Must carry hazardous transport badge, check refrigeration seal..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full px-3 py-2 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
            />
          </div>

          {/* Actions */}
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
              Confirm Dispatch
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// End Assignment Modal
interface EndAssignmentModalProps {
  isOpen: boolean;
  assignment: Assignment;
  vehicle?: any;
  driver?: any;
  onClose: () => void;
  onComplete: (endOdo: number, notes?: string) => void;
}

const EndAssignmentModal: React.FC<EndAssignmentModalProps> = ({
  isOpen,
  assignment,
  vehicle,
  driver,
  onClose,
  onComplete,
}) => {
  const [endOdometer, setEndOdometer] = useState(assignment.startOdometer + 45);
  const [returnNotes, setReturnNotes] = useState('');

  if (!isOpen) return null;

  const tripDistance = endOdometer - assignment.startOdometer;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (endOdometer < assignment.startOdometer) {
      alert('End odometer reading cannot be less than starting odometer!');
      return;
    }
    onComplete(Number(endOdometer), returnNotes);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <div className="w-full max-w-md bg-white dark:bg-slate-900 rounded-xl shadow-2xl border border-slate-200 dark:border-slate-800 p-6 space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
          <h3 className="font-bold text-slate-900 dark:text-white text-sm">
            Complete Shift & Check In Vehicle
          </h3>
          <button onClick={onClose} className="p-1 rounded text-slate-400 hover:text-slate-600">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-lg text-xs space-y-1">
          <div>
            <strong>Vehicle:</strong> {vehicle?.make} {vehicle?.model} ({vehicle?.licensePlate})
          </div>
          <div>
            <strong>Driver:</strong> {driver?.name}
          </div>
          <div>
            <strong>Departure Odometer:</strong>{' '}
            <span className="font-mono">{assignment.startOdometer.toLocaleString()} km</span>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Final Return Odometer (km) *
            </label>
            <input
              type="number"
              required
              min={assignment.startOdometer}
              value={endOdometer}
              onChange={(e) => setEndOdometer(Number(e.target.value))}
              className="w-full px-3 py-2 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-mono"
            />
            <div className="mt-1 text-xs text-emerald-600 font-semibold font-mono">
              Trip Distance: +{tripDistance} km
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Return Inspection Notes (Optional)
            </label>
            <textarea
              rows={2}
              placeholder="e.g. Returned cleanly, tank at 75%, no damage..."
              value={returnNotes}
              onChange={(e) => setReturnNotes(e.target.value)}
              className="w-full px-3 py-2 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
            />
          </div>

          <div className="pt-2 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-semibold shadow-xs"
            >
              Finish Shift
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
