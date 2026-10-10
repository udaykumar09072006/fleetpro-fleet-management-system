import React, { useState, useMemo } from 'react';
import {
  Wrench,
  Plus,
  Search,
  Filter,
  CheckCircle2,
  Clock,
  AlertTriangle,
  Calendar,
  DollarSign,
  Truck,
  Edit2,
  Trash2,
  X,
  Sparkles,
  ShieldAlert,
} from 'lucide-react';
import { useFleet } from '../../context/FleetContext';
import { MaintenanceRecord, MaintenanceStatus, MaintenancePriority } from '../../types';
import { StatusBadge } from '../common/StatusBadge';

export const MaintenanceView: React.FC = () => {
  const {
    maintenanceRecords,
    vehicles,
    addMaintenance,
    updateMaintenance,
    completeMaintenance,
    deleteMaintenance,
    searchQuery,
  } = useFleet();

  const [activeTab, setActiveTab] = useState<'upcoming' | 'completed' | 'all'>('upcoming');
  const [priorityFilter, setPriorityFilter] = useState<string>('All');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [completingRecord, setCompletingRecord] = useState<MaintenanceRecord | null>(null);
  const [editingRecord, setEditingRecord] = useState<MaintenanceRecord | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  // Filtered maintenance list
  const filteredRecords = useMemo(() => {
    return maintenanceRecords.filter((m) => {
      const vehicle = vehicles.find((v) => v.id === m.vehicleId);
      const q = searchQuery.toLowerCase();
      const matchSearch =
        !q ||
        m.serviceType.toLowerCase().includes(q) ||
        m.serviceProvider.toLowerCase().includes(q) ||
        vehicle?.licensePlate.toLowerCase().includes(q) ||
        vehicle?.make.toLowerCase().includes(q);

      const matchTab =
        activeTab === 'all'
          ? true
          : activeTab === 'completed'
          ? m.status === 'Completed'
          : m.status !== 'Completed';

      const matchPriority = priorityFilter === 'All' || m.priority === priorityFilter;

      return matchSearch && matchTab && matchPriority;
    });
  }, [maintenanceRecords, vehicles, searchQuery, activeTab, priorityFilter]);

  // Calculations
  const completedSpend = maintenanceRecords
    .filter((m) => m.status === 'Completed')
    .reduce((acc, m) => acc + (m.actualCost || m.estimatedCost), 0);

  const pendingEstimate = maintenanceRecords
    .filter((m) => m.status !== 'Completed')
    .reduce((acc, m) => acc + m.estimatedCost, 0);

  const overdueCount = maintenanceRecords.filter((m) => m.status === 'Overdue').length;

  return (
    <div className="space-y-6">
      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-4 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs">
          <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
            Active / Scheduled Services
          </div>
          <div className="mt-2 text-2xl font-bold font-mono text-slate-900 dark:text-white">
            {maintenanceRecords.filter((m) => m.status !== 'Completed').length}
          </div>
          <div className="mt-1 text-xs text-amber-600 dark:text-amber-400">
            Est. Cost: ${pendingEstimate.toLocaleString()}
          </div>
        </div>

        <div className="p-4 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs">
          <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
            Completed Repairs (YTD)
          </div>
          <div className="mt-2 text-2xl font-bold font-mono text-slate-900 dark:text-white">
            {maintenanceRecords.filter((m) => m.status === 'Completed').length}
          </div>
          <div className="mt-1 text-xs text-emerald-600 dark:text-emerald-400">
            Total Incurred: ${completedSpend.toLocaleString()}
          </div>
        </div>

        <div className="p-4 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs">
          <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
            Urgent Attention Required
          </div>
          <div className="mt-2 text-2xl font-bold font-mono text-rose-600">
            {overdueCount}
          </div>
          <div className="mt-1 text-xs text-rose-600 dark:text-rose-400 font-medium">
            Overdue maintenance work orders
          </div>
        </div>
      </div>

      {/* Main Table Container */}
      <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs overflow-hidden">
        {/* Toolbar */}
        <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex flex-wrap items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-3">
            {/* Tabs */}
            <div className="flex items-center p-0.5 rounded-lg bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
              <button
                onClick={() => setActiveTab('upcoming')}
                className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors ${
                  activeTab === 'upcoming'
                    ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs'
                    : 'text-slate-500 hover:text-slate-900'
                }`}
              >
                Upcoming & In Progress
              </button>
              <button
                onClick={() => setActiveTab('completed')}
                className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors ${
                  activeTab === 'completed'
                    ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs'
                    : 'text-slate-500 hover:text-slate-900'
                }`}
              >
                Service History
              </button>
              <button
                onClick={() => setActiveTab('all')}
                className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors ${
                  activeTab === 'all'
                    ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs'
                    : 'text-slate-500 hover:text-slate-900'
                }`}
              >
                All Records
              </button>
            </div>

            {/* Priority filter */}
            <div className="flex items-center gap-1.5 text-xs text-slate-500">
              <span>Priority:</span>
              <select
                value={priorityFilter}
                onChange={(e) => setPriorityFilter(e.target.value)}
                className="px-2.5 py-1 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white font-medium"
              >
                <option value="All">All Priorities</option>
                <option value="Urgent">Urgent</option>
                <option value="High">High</option>
                <option value="Medium">Medium</option>
                <option value="Low">Low</option>
              </select>
            </div>
          </div>

          <button
            onClick={() => setIsAddModalOpen(true)}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 shadow-xs transition-colors"
          >
            <Plus className="w-4 h-4" />
            Schedule Service
          </button>
        </div>

        {/* Maintenance Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 dark:bg-slate-800/60 border-b border-slate-200 dark:border-slate-800 text-slate-500 font-semibold uppercase tracking-wider">
              <tr>
                <th className="py-3 px-4">Service Type</th>
                <th className="py-3 px-4">Vehicle</th>
                <th className="py-3 px-4">Priority</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4">Scheduled Date</th>
                <th className="py-3 px-4">Provider</th>
                <th className="py-3 px-4 text-right">Cost</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {filteredRecords.map((m) => {
                const vehicle = vehicles.find((v) => v.id === m.vehicleId);

                return (
                  <tr key={m.id} className="hover:bg-slate-50/70 dark:hover:bg-slate-800/40">
                    {/* Service Type */}
                    <td className="py-3.5 px-4 font-semibold text-slate-900 dark:text-white">
                      <div>{m.serviceType}</div>
                      {m.notes && (
                        <div className="text-[11px] font-normal text-slate-500 truncate max-w-xs mt-0.5">
                          {m.notes}
                        </div>
                      )}
                    </td>

                    {/* Vehicle */}
                    <td className="py-3.5 px-4">
                      <div className="font-semibold text-slate-900 dark:text-white">
                        {vehicle?.licensePlate || m.vehicleId}
                      </div>
                      <div className="text-[11px] text-slate-500">
                        {vehicle ? `${vehicle.make} ${vehicle.model}` : 'Unknown'}
                      </div>
                    </td>

                    {/* Priority */}
                    <td className="py-3.5 px-4">
                      <StatusBadge status={m.priority} type="priority" />
                    </td>

                    {/* Status */}
                    <td className="py-3.5 px-4">
                      <StatusBadge status={m.status} type="maintenance" />
                    </td>

                    {/* Scheduled Date */}
                    <td className="py-3.5 px-4 font-mono tabular-nums text-slate-600 dark:text-slate-400">
                      <div>{m.scheduledDate}</div>
                      {m.completedDate && (
                        <div className="text-[10px] text-emerald-600">Done: {m.completedDate}</div>
                      )}
                    </td>

                    {/* Provider */}
                    <td className="py-3.5 px-4 text-slate-700 dark:text-slate-300">
                      <div>{m.serviceProvider}</div>
                      {m.invoiceNumber && (
                        <div className="text-[10px] font-mono text-slate-400">
                          Ref: {m.invoiceNumber}
                        </div>
                      )}
                    </td>

                    {/* Cost */}
                    <td className="py-3.5 px-4 text-right font-mono tabular-nums">
                      {m.actualCost !== undefined ? (
                        <div>
                          <span className="font-semibold text-emerald-600 dark:text-emerald-400">
                            ${m.actualCost}
                          </span>
                          <span className="text-[10px] text-slate-400 block">Actual</span>
                        </div>
                      ) : (
                        <div>
                          <span className="font-semibold text-slate-800 dark:text-slate-200">
                            ${m.estimatedCost}
                          </span>
                          <span className="text-[10px] text-slate-400 block">Estimated</span>
                        </div>
                      )}
                    </td>

                    {/* Actions */}
                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-1">
                        {m.status !== 'Completed' && (
                          <button
                            onClick={() => setCompletingRecord(m)}
                            className="px-2 py-1 text-xs font-semibold bg-emerald-50 dark:bg-emerald-950/60 hover:bg-emerald-100 text-emerald-700 dark:text-emerald-400 rounded-md border border-emerald-200 dark:border-emerald-800 transition-colors"
                            title="Mark as Completed"
                          >
                            Complete
                          </button>
                        )}
                        <button
                          onClick={() => setEditingRecord(m)}
                          className="p-1.5 rounded text-slate-400 hover:text-amber-600 hover:bg-slate-100"
                          title="Edit Service Record"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => setDeletingId(m.id)}
                          className="p-1.5 rounded text-slate-400 hover:text-rose-600 hover:bg-slate-100"
                          title="Delete Service Record"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}

              {filteredRecords.length === 0 && (
                <tr>
                  <td colSpan={8} className="py-10 text-center text-slate-400 italic">
                    No maintenance records found matching this view.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* SCHEDULE MAINTENANCE MODAL */}
      {isAddModalOpen && (
        <MaintenanceFormModal
          isOpen={isAddModalOpen}
          vehicles={vehicles}
          onClose={() => setIsAddModalOpen(false)}
          onSave={(data) => {
            addMaintenance(data);
            setIsAddModalOpen(false);
          }}
          title="Schedule Vehicle Maintenance"
        />
      )}

      {/* EDIT MAINTENANCE MODAL */}
      {editingRecord && (
        <MaintenanceFormModal
          isOpen={!!editingRecord}
          vehicles={vehicles}
          initialData={editingRecord}
          onClose={() => setEditingRecord(null)}
          onSave={(data) => {
            updateMaintenance(editingRecord.id, data);
            setEditingRecord(null);
          }}
          title="Edit Maintenance Work Order"
        />
      )}

      {/* COMPLETE MAINTENANCE MODAL */}
      {completingRecord && (
        <CompleteMaintenanceModal
          isOpen={!!completingRecord}
          record={completingRecord}
          vehicle={vehicles.find((v) => v.id === completingRecord.vehicleId)}
          onClose={() => setCompletingRecord(null)}
          onComplete={(actualCost, notes) => {
            completeMaintenance(completingRecord.id, actualCost, notes);
            setCompletingRecord(null);
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
              <h3 className="font-bold text-slate-900 dark:text-white">Delete Service Record</h3>
              <p className="text-xs text-slate-500 mt-1">
                Are you sure you want to remove this maintenance entry from the fleet history?
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
                  deleteMaintenance(deletingId);
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

// Form Modal for Maintenance
interface MaintenanceFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  vehicles: any[];
  onSave: (data: Omit<MaintenanceRecord, 'id'>) => void;
  initialData?: MaintenanceRecord;
  title: string;
}

const MaintenanceFormModal: React.FC<MaintenanceFormModalProps> = ({
  isOpen,
  onClose,
  vehicles,
  onSave,
  initialData,
  title,
}) => {
  const [vehicleId, setVehicleId] = useState(initialData?.vehicleId || vehicles[0]?.id || '');
  const [serviceType, setServiceType] = useState(
    initialData?.serviceType || 'Oil Change & Comprehensive Safety Inspection'
  );
  const [scheduledDate, setScheduledDate] = useState(
    initialData?.scheduledDate || new Date().toISOString().slice(0, 10)
  );
  const [priority, setPriority] = useState<MaintenancePriority>(initialData?.priority || 'Medium');
  const [status, setStatus] = useState<MaintenanceStatus>(initialData?.status || 'Scheduled');
  const [estimatedCost, setEstimatedCost] = useState(initialData?.estimatedCost || 250);
  const [serviceProvider, setServiceProvider] = useState(
    initialData?.serviceProvider || 'Metro Fleet Maintenance Center'
  );
  const [notes, setNotes] = useState(initialData?.notes || '');

  if (!isOpen) return null;

  const handleQuickPreset = (type: string, cost: number, prio: MaintenancePriority) => {
    setServiceType(type);
    setEstimatedCost(cost);
    setPriority(prio);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!vehicleId || !serviceType || !scheduledDate) return;

    onSave({
      vehicleId,
      serviceType,
      scheduledDate,
      priority,
      status,
      estimatedCost: Number(estimatedCost),
      actualCost: initialData?.actualCost,
      serviceProvider,
      notes,
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <div className="w-full max-w-xl bg-white dark:bg-slate-900 rounded-xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden flex flex-col max-h-[90vh]">
        <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Wrench className="w-5 h-5 text-blue-600" />
            <h3 className="font-bold text-slate-900 dark:text-white">{title}</h3>
          </div>
          <button onClick={onClose} className="p-1 rounded text-slate-400 hover:text-slate-600">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-4">
          {/* Quick presets */}
          <div>
            <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
              Common Service Presets
            </div>
            <div className="flex flex-wrap gap-1.5">
              <button
                type="button"
                onClick={() =>
                  handleQuickPreset('Synthetic Oil Change & Filter Renewal', 180, 'Low')
                }
                className="px-2.5 py-1 text-xs rounded-md bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-300"
              >
                Oil Change ($180)
              </button>
              <button
                type="button"
                onClick={() =>
                  handleQuickPreset('Brake Pads & Rotor Replacement', 750, 'High')
                }
                className="px-2.5 py-1 text-xs rounded-md bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-300"
              >
                Brake Service ($750)
              </button>
              <button
                type="button"
                onClick={() =>
                  handleQuickPreset('Tire Rotation & Balance Alignment', 140, 'Low')
                }
                className="px-2.5 py-1 text-xs rounded-md bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-300"
              >
                Tire Rotation ($140)
              </button>
              <button
                type="button"
                onClick={() =>
                  handleQuickPreset('Annual DOT Commercial Inspection', 550, 'Urgent')
                }
                className="px-2.5 py-1 text-xs rounded-md bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-300"
              >
                DOT Inspection ($550)
              </button>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Select Fleet Vehicle *
            </label>
            <select
              value={vehicleId}
              onChange={(e) => setVehicleId(e.target.value)}
              className="w-full px-3 py-2 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-mono"
            >
              {vehicles.map((v) => (
                <option key={v.id} value={v.id}>
                  {v.licensePlate} - {v.make} {v.model} ({v.mileage.toLocaleString()} km)
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Service Type & Description *
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Front axle brake pad replacement"
              value={serviceType}
              onChange={(e) => setServiceType(e.target.value)}
              className="w-full px-3 py-2 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Scheduled Date *
              </label>
              <input
                type="date"
                required
                value={scheduledDate}
                onChange={(e) => setScheduledDate(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Priority
              </label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value as MaintenancePriority)}
                className="w-full px-3 py-2 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
              >
                <option value="Low">Low</option>
                <option value="Medium">Medium</option>
                <option value="High">High</option>
                <option value="Urgent">Urgent</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Service Status
              </label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as MaintenanceStatus)}
                className="w-full px-3 py-2 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
              >
                <option value="Scheduled">Scheduled</option>
                <option value="In Progress">In Progress</option>
                <option value="Completed">Completed</option>
                <option value="Overdue">Overdue</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Estimated Cost ($)
              </label>
              <input
                type="number"
                min="0"
                value={estimatedCost}
                onChange={(e) => setEstimatedCost(Number(e.target.value))}
                className="w-full px-3 py-2 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-mono"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Service Provider / Repair Bay
              </label>
              <input
                type="text"
                value={serviceProvider}
                onChange={(e) => setServiceProvider(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Work Order Notes
            </label>
            <textarea
              rows={2}
              placeholder="e.g. Driver reported steering wobble at highway speeds..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full px-3 py-2 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
            />
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
              Save Work Order
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// Complete Maintenance Modal
interface CompleteMaintenanceModalProps {
  isOpen: boolean;
  record: MaintenanceRecord;
  vehicle?: any;
  onClose: () => void;
  onComplete: (actualCost: number, notes?: string) => void;
}

const CompleteMaintenanceModal: React.FC<CompleteMaintenanceModalProps> = ({
  isOpen,
  record,
  vehicle,
  onClose,
  onComplete,
}) => {
  const [actualCost, setActualCost] = useState(record.estimatedCost);
  const [notes, setNotes] = useState(record.notes || 'Service successfully completed and verified.');

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <div className="w-full max-w-md bg-white dark:bg-slate-900 rounded-xl shadow-2xl border border-slate-200 dark:border-slate-800 p-6 space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
          <h3 className="font-bold text-slate-900 dark:text-white text-sm">
            Finalize & Close Work Order
          </h3>
          <button onClick={onClose} className="p-1 rounded text-slate-400 hover:text-slate-600">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-lg text-xs space-y-1">
          <div>
            <strong>Service:</strong> {record.serviceType}
          </div>
          <div>
            <strong>Vehicle:</strong> {vehicle?.licensePlate} ({vehicle?.make} {vehicle?.model})
          </div>
          <div>
            <strong>Estimated Cost:</strong> ${record.estimatedCost}
          </div>
        </div>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            onComplete(Number(actualCost), notes);
          }}
          className="space-y-4"
        >
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Actual Invoiced Cost ($) *
            </label>
            <input
              type="number"
              required
              min="0"
              value={actualCost}
              onChange={(e) => setActualCost(Number(e.target.value))}
              className="w-full px-3 py-2 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-mono"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Mechanic / Sign-off Notes
            </label>
            <textarea
              rows={2}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full px-3 py-2 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
            />
          </div>

          <p className="text-[11px] text-slate-500">
            Completing this record will automatically return the vehicle to Active operational status and record today as the last service date.
          </p>

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
              Confirm Completion
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
