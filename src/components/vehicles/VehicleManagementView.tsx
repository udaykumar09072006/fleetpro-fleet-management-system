import React, { useState, useMemo } from 'react';
import {
  Truck,
  Plus,
  Search,
  Filter,
  ArrowUpDown,
  MoreVertical,
  Edit2,
  Trash2,
  Eye,
  Fuel,
  Gauge,
  Calendar,
  ShieldCheck,
  AlertTriangle,
  FileText,
  X,
  Check,
  Sparkles,
} from 'lucide-react';
import { useFleet } from '../../context/FleetContext';
import { Vehicle, VehicleStatus, VehicleType, FuelType } from '../../types';
import { StatusBadge } from '../common/StatusBadge';

export const VehicleManagementView: React.FC = () => {
  const {
    vehicles,
    drivers,
    maintenanceRecords,
    addVehicle,
    updateVehicle,
    deleteVehicle,
    searchQuery,
    setSearchQuery,
  } = useFleet();

  const [statusFilter, setStatusFilter] = useState<string>('All');
  const [typeFilter, setTypeFilter] = useState<string>('All');
  const [sortBy, setSortBy] = useState<'mileage' | 'year' | 'make'>('mileage');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [viewMode, setViewMode] = useState<'table' | 'grid'>('table');

  // Modal states
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingVehicle, setEditingVehicle] = useState<Vehicle | null>(null);
  const [inspectingVehicle, setInspectingVehicle] = useState<Vehicle | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  // Filtered and sorted vehicles
  const filteredVehicles = useMemo(() => {
    return vehicles
      .filter((v) => {
        // Search query
        const q = searchQuery.toLowerCase();
        const matchSearch =
          !q ||
          v.make.toLowerCase().includes(q) ||
          v.model.toLowerCase().includes(q) ||
          v.licensePlate.toLowerCase().includes(q) ||
          v.vin.toLowerCase().includes(q);

        // Status filter
        const matchStatus = statusFilter === 'All' || v.status === statusFilter;

        // Type filter
        const matchType = typeFilter === 'All' || v.type === typeFilter;

        return matchSearch && matchStatus && matchType;
      })
      .sort((a, b) => {
        let diff = 0;
        if (sortBy === 'mileage') diff = a.mileage - b.mileage;
        if (sortBy === 'year') diff = a.year - b.year;
        if (sortBy === 'make') diff = a.make.localeCompare(b.make);
        return sortOrder === 'asc' ? diff : -diff;
      });
  }, [vehicles, searchQuery, statusFilter, typeFilter, sortBy, sortOrder]);

  return (
    <div className="space-y-6">
      {/* Action and Filter Toolbar */}
      <div className="p-4 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Left: Filters */}
        <div className="flex flex-wrap items-center gap-2.5">
          {/* Status selector */}
          <div className="flex items-center gap-1.5 text-xs text-slate-500">
            <span>Status:</span>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-2.5 py-1.5 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white font-medium"
            >
              <option value="All">All Statuses ({vehicles.length})</option>
              <option value="Active">Active ({vehicles.filter((v) => v.status === 'Active').length})</option>
              <option value="Maintenance">Maintenance ({vehicles.filter((v) => v.status === 'Maintenance').length})</option>
              <option value="Out of Service">Out of Service ({vehicles.filter((v) => v.status === 'Out of Service').length})</option>
              <option value="Reserved">Reserved ({vehicles.filter((v) => v.status === 'Reserved').length})</option>
            </select>
          </div>

          {/* Vehicle Type selector */}
          <div className="flex items-center gap-1.5 text-xs text-slate-500">
            <span>Type:</span>
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="px-2.5 py-1.5 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white font-medium"
            >
              <option value="All">All Types</option>
              <option value="Van">Van</option>
              <option value="Semi-Truck">Semi-Truck</option>
              <option value="Light Truck">Light Truck</option>
              <option value="Sedan">Sedan</option>
              <option value="SUV">SUV</option>
              <option value="Electric Cargo">Electric Cargo</option>
            </select>
          </div>

          {/* Sort selector */}
          <div className="flex items-center gap-1.5 text-xs text-slate-500">
            <span>Sort:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="px-2.5 py-1.5 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white font-medium"
            >
              <option value="mileage">Mileage</option>
              <option value="year">Year</option>
              <option value="make">Make</option>
            </select>
            <button
              onClick={() => setSortOrder((prev) => (prev === 'asc' ? 'desc' : 'asc'))}
              className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-100"
              title="Toggle sort direction"
            >
              <ArrowUpDown className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Right: View Mode & Add Button */}
        <div className="flex items-center gap-3">
          <div className="flex items-center p-0.5 rounded-lg bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
            <button
              onClick={() => setViewMode('table')}
              className={`px-2.5 py-1 text-xs font-medium rounded-md transition-colors ${
                viewMode === 'table'
                  ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs'
                  : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              Table View
            </button>
            <button
              onClick={() => setViewMode('grid')}
              className={`px-2.5 py-1 text-xs font-medium rounded-md transition-colors ${
                viewMode === 'grid'
                  ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs'
                  : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              Grid View
            </button>
          </div>

          <button
            onClick={() => setIsAddModalOpen(true)}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 shadow-xs transition-colors shrink-0"
          >
            <Plus className="w-4 h-4" />
            Add Vehicle
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      {filteredVehicles.length === 0 ? (
        <div className="p-12 text-center bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800">
          <Truck className="w-12 h-12 text-slate-300 dark:text-slate-600 mx-auto mb-3" />
          <h3 className="text-base font-semibold text-slate-900 dark:text-white">
            No vehicles match your criteria
          </h3>
          <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
            Try adjusting your search query, status filter, or add a new vehicle to the fleet.
          </p>
          <button
            onClick={() => {
              setStatusFilter('All');
              setTypeFilter('All');
              setSearchQuery('');
            }}
            className="mt-4 px-3 py-1.5 text-xs text-blue-600 hover:underline font-medium"
          >
            Clear all filters
          </button>
        </div>
      ) : viewMode === 'table' ? (
        /* TABLE VIEW */
        <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 dark:bg-slate-800/60 border-b border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 font-semibold uppercase tracking-wider">
                <tr>
                  <th className="py-3 px-4">Vehicle / Model</th>
                  <th className="py-3 px-4">Plate & VIN</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4">Type & Fuel</th>
                  <th className="py-3 px-4 text-right">Odometer</th>
                  <th className="py-3 px-4">Driver Assigned</th>
                  <th className="py-3 px-4">Insurance Expiry</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800 font-normal">
                {filteredVehicles.map((vehicle) => {
                  const driver = drivers.find((d) => d.id === vehicle.assignedDriverId);
                  const isInsuranceExpiringSoon =
                    new Date(vehicle.insuranceExpiry).getTime() - new Date().getTime() <
                    30 * 24 * 60 * 60 * 1000;

                  return (
                    <tr
                      key={vehicle.id}
                      className="hover:bg-slate-50/70 dark:hover:bg-slate-800/40 transition-colors"
                    >
                      {/* Vehicle Make/Model */}
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-lg bg-blue-50 dark:bg-blue-950/80 border border-blue-200 dark:border-blue-900 flex items-center justify-center text-blue-600 shrink-0">
                            <Truck className="w-4 h-4" />
                          </div>
                          <div>
                            <div className="font-semibold text-slate-900 dark:text-white">
                              {vehicle.make} {vehicle.model}
                            </div>
                            <div className="text-[11px] text-slate-500">
                              Year {vehicle.year}
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* Plate & VIN */}
                      <td className="py-3.5 px-4 font-mono tabular-nums">
                        <div className="font-semibold text-slate-900 dark:text-white">
                          {vehicle.licensePlate}
                        </div>
                        <div className="text-[11px] text-slate-500 truncate max-w-[130px]" title={vehicle.vin}>
                          {vehicle.vin}
                        </div>
                      </td>

                      {/* Status */}
                      <td className="py-3.5 px-4">
                        <StatusBadge status={vehicle.status} type="vehicle" />
                      </td>

                      {/* Type & Fuel Level */}
                      <td className="py-3.5 px-4">
                        <div className="text-slate-800 dark:text-slate-200 font-medium">
                          {vehicle.type}
                        </div>
                        <div className="text-[11px] text-slate-500 flex items-center gap-1 font-mono">
                          <span>{vehicle.fuelType}</span>
                          <span>·</span>
                          <span
                            className={
                              vehicle.fuelLevel < 20
                                ? 'text-rose-600 font-bold'
                                : 'text-slate-600 dark:text-slate-400'
                            }
                          >
                            {vehicle.fuelLevel}%
                          </span>
                        </div>
                      </td>

                      {/* Odometer */}
                      <td className="py-3.5 px-4 text-right font-mono tabular-nums">
                        <span className="font-semibold text-slate-900 dark:text-white">
                          {vehicle.mileage.toLocaleString()}
                        </span>{' '}
                        <span className="text-slate-500">km</span>
                      </td>

                      {/* Assigned Driver */}
                      <td className="py-3.5 px-4">
                        {driver ? (
                          <div className="font-medium text-slate-900 dark:text-white">
                            {driver.name}
                          </div>
                        ) : (
                          <span className="text-slate-400 italic">Unassigned</span>
                        )}
                      </td>

                      {/* Insurance Expiry */}
                      <td className="py-3.5 px-4 font-mono tabular-nums">
                        <div
                          className={`flex items-center gap-1 ${
                            isInsuranceExpiringSoon
                              ? 'text-amber-600 dark:text-amber-400 font-semibold'
                              : 'text-slate-600 dark:text-slate-400'
                          }`}
                        >
                          {isInsuranceExpiringSoon && <AlertTriangle className="w-3 h-3 text-amber-500" />}
                          <span>{vehicle.insuranceExpiry}</span>
                        </div>
                      </td>

                      {/* Actions */}
                      <td className="py-3.5 px-4 text-right">
                        <div className="flex items-center justify-end gap-1">
                          <button
                            onClick={() => setInspectingVehicle(vehicle)}
                            className="p-1.5 rounded text-slate-400 hover:text-blue-600 hover:bg-slate-100 dark:hover:bg-slate-800"
                            title="Inspect Vehicle Specs"
                          >
                            <Eye className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => setEditingVehicle(vehicle)}
                            className="p-1.5 rounded text-slate-400 hover:text-amber-600 hover:bg-slate-100 dark:hover:bg-slate-800"
                            title="Edit Vehicle"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => setDeletingId(vehicle.id)}
                            className="p-1.5 rounded text-slate-400 hover:text-rose-600 hover:bg-slate-100 dark:hover:bg-slate-800"
                            title="Delete Vehicle"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        /* GRID VIEW */
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredVehicles.map((vehicle) => {
            const driver = drivers.find((d) => d.id === vehicle.assignedDriverId);
            return (
              <div
                key={vehicle.id}
                className="p-5 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col justify-between hover:border-blue-400 transition-colors"
              >
                <div>
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <div className="font-bold text-slate-900 dark:text-white text-sm">
                        {vehicle.make} {vehicle.model}
                      </div>
                      <div className="text-xs text-slate-500 font-mono">
                        Year {vehicle.year} · {vehicle.licensePlate}
                      </div>
                    </div>
                    <StatusBadge status={vehicle.status} type="vehicle" />
                  </div>

                  {/* Specs Pill List */}
                  <div className="mt-4 grid grid-cols-2 gap-2 text-xs">
                    <div className="p-2 rounded bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800">
                      <span className="text-[10px] text-slate-400 block uppercase">Type</span>
                      <span className="font-semibold text-slate-800 dark:text-slate-200">
                        {vehicle.type}
                      </span>
                    </div>
                    <div className="p-2 rounded bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800">
                      <span className="text-[10px] text-slate-400 block uppercase">Mileage</span>
                      <span className="font-semibold font-mono tabular-nums text-slate-800 dark:text-slate-200">
                        {vehicle.mileage.toLocaleString()} km
                      </span>
                    </div>
                    <div className="p-2 rounded bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800">
                      <span className="text-[10px] text-slate-400 block uppercase">Fuel Level</span>
                      <span className="font-semibold font-mono tabular-nums text-slate-800 dark:text-slate-200">
                        {vehicle.fuelLevel}% ({vehicle.fuelType})
                      </span>
                    </div>
                    <div className="p-2 rounded bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800">
                      <span className="text-[10px] text-slate-400 block uppercase">Driver</span>
                      <span className="font-semibold truncate block text-slate-800 dark:text-slate-200">
                        {driver?.name || 'Unassigned'}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs">
                  <span className="text-[11px] text-slate-500 font-mono">
                    Policy: {vehicle.insurancePolicy}
                  </span>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => setInspectingVehicle(vehicle)}
                      className="p-1.5 rounded text-slate-400 hover:text-blue-600 hover:bg-slate-100"
                      title="Inspect"
                    >
                      <Eye className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => setEditingVehicle(vehicle)}
                      className="p-1.5 rounded text-slate-400 hover:text-amber-600 hover:bg-slate-100"
                      title="Edit"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => setDeletingId(vehicle.id)}
                      className="p-1.5 rounded text-slate-400 hover:text-rose-600 hover:bg-slate-100"
                      title="Delete"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* ADD VEHICLE MODAL */}
      {isAddModalOpen && (
        <VehicleFormModal
          isOpen={isAddModalOpen}
          onClose={() => setIsAddModalOpen(false)}
          onSave={(data) => {
            addVehicle(data);
            setIsAddModalOpen(false);
          }}
          title="Register New Fleet Vehicle"
        />
      )}

      {/* EDIT VEHICLE MODAL */}
      {editingVehicle && (
        <VehicleFormModal
          isOpen={!!editingVehicle}
          initialData={editingVehicle}
          onClose={() => setEditingVehicle(null)}
          onSave={(data) => {
            updateVehicle(editingVehicle.id, data);
            setEditingVehicle(null);
          }}
          title={`Edit Vehicle: ${editingVehicle.licensePlate}`}
        />
      )}

      {/* DELETE CONFIRMATION MODAL */}
      {deletingId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="w-full max-w-sm bg-white dark:bg-slate-900 rounded-xl shadow-xl border border-slate-200 dark:border-slate-800 p-6 space-y-4">
            <div className="w-10 h-10 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center mx-auto">
              <Trash2 className="w-5 h-5" />
            </div>
            <div className="text-center">
              <h3 className="font-bold text-slate-900 dark:text-white">Delete Vehicle</h3>
              <p className="text-xs text-slate-500 mt-1">
                Are you sure you want to permanently remove this vehicle from the fleet? Associated assignments will be cleared.
              </p>
            </div>
            <div className="flex items-center gap-3 pt-2">
              <button
                onClick={() => setDeletingId(null)}
                className="w-1/2 py-2 text-xs font-semibold rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  deleteVehicle(deletingId);
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

      {/* INSPECT VEHICLE DRAWER */}
      {inspectingVehicle && (
        <VehicleInspectDrawer
          vehicle={inspectingVehicle}
          onClose={() => setInspectingVehicle(null)}
          drivers={drivers}
          maintenanceRecords={maintenanceRecords}
        />
      )}
    </div>
  );
};

// Modal for Adding or Editing Vehicle
interface VehicleFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: Omit<Vehicle, 'id'>) => void;
  initialData?: Vehicle;
  title: string;
}

const VehicleFormModal: React.FC<VehicleFormModalProps> = ({
  isOpen,
  onClose,
  onSave,
  initialData,
  title,
}) => {
  const [make, setMake] = useState(initialData?.make || '');
  const [model, setModel] = useState(initialData?.model || '');
  const [year, setYear] = useState(initialData?.year || 2023);
  const [licensePlate, setLicensePlate] = useState(initialData?.licensePlate || '');
  const [vin, setVin] = useState(initialData?.vin || '');
  const [type, setType] = useState<VehicleType>(initialData?.type || 'Van');
  const [status, setStatus] = useState<VehicleStatus>(initialData?.status || 'Active');
  const [mileage, setMileage] = useState(initialData?.mileage || 25000);
  const [fuelType, setFuelType] = useState<FuelType>(initialData?.fuelType || 'Diesel');
  const [fuelLevel, setFuelLevel] = useState(initialData?.fuelLevel || 80);
  const [insurancePolicy, setInsurancePolicy] = useState(initialData?.insurancePolicy || 'PR-90100-X');
  const [insuranceExpiry, setInsuranceExpiry] = useState(initialData?.insuranceExpiry || '2027-06-30');
  const [insuranceProvider, setInsuranceProvider] = useState(initialData?.insuranceProvider || 'Travelers Commercial');
  const [notes, setNotes] = useState(initialData?.notes || '');

  if (!isOpen) return null;

  const handleQuickFill = () => {
    const brands = [
      { make: 'Ford', model: 'Transit 250 Cargo', type: 'Van' as VehicleType, fuel: 'Diesel' as FuelType },
      { make: 'Mack', model: 'Anthem 64T Hauler', type: 'Semi-Truck' as VehicleType, fuel: 'Diesel' as FuelType },
      { make: 'Tesla', model: 'Semi Class 8', type: 'Semi-Truck' as VehicleType, fuel: 'Electric' as FuelType },
      { make: 'Toyota', model: 'RAV4 Hybrid Fleet', type: 'SUV' as VehicleType, fuel: 'Hybrid' as FuelType },
    ];
    const pick = brands[Math.floor(Math.random() * brands.length)];
    const randomNum = Math.floor(100 + Math.random() * 900);
    setMake(pick.make);
    setModel(pick.model);
    setType(pick.type);
    setFuelType(pick.fuel);
    setYear(2024);
    setLicensePlate(`FL-${randomNum}-NY`);
    setVin(`1FTBR${randomNum}K${Date.now().toString().slice(-7)}`);
    setMileage(Math.floor(5000 + Math.random() * 60000));
    setFuelLevel(85);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!make || !model || !licensePlate || !vin) return;

    onSave({
      make,
      model,
      year: Number(year),
      licensePlate,
      vin,
      type,
      status,
      mileage: Number(mileage),
      fuelType,
      fuelLevel: Number(fuelLevel),
      assignedDriverId: initialData?.assignedDriverId || null,
      lastServiceDate: initialData?.lastServiceDate || new Date().toISOString().slice(0, 10),
      nextServiceMileage: Number(mileage) + 10000,
      insurancePolicy,
      insuranceExpiry,
      insuranceProvider,
      notes,
      location: initialData?.location || {
        lat: 37.7749,
        lng: -122.4194,
        address: 'Fleet Operations Terminal Bay 1',
        speed: 0,
        heading: 0,
      },
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <div className="w-full max-w-2xl bg-white dark:bg-slate-900 rounded-xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Truck className="w-5 h-5 text-blue-600" />
            <h3 className="font-bold text-slate-900 dark:text-white">{title}</h3>
          </div>
          <div className="flex items-center gap-2">
            {!initialData && (
              <button
                type="button"
                onClick={handleQuickFill}
                className="text-xs text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1 font-medium"
              >
                <Sparkles className="w-3.5 h-3.5" /> Auto-fill Sample
              </button>
            )}
            <button onClick={onClose} className="p-1 rounded text-slate-400 hover:text-slate-600">
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Make *
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Ford, Volvo"
                value={make}
                onChange={(e) => setMake(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Model *
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Transit 350 HD"
                value={model}
                onChange={(e) => setModel(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Year *
              </label>
              <input
                type="number"
                required
                min="2000"
                max="2030"
                value={year}
                onChange={(e) => setYear(Number(e.target.value))}
                className="w-full px-3 py-2 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-mono"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                License Plate *
              </label>
              <input
                type="text"
                required
                placeholder="e.g. FL-101-TX"
                value={licensePlate}
                onChange={(e) => setLicensePlate(e.target.value.toUpperCase())}
                className="w-full px-3 py-2 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-mono"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                VIN (Vehicle ID Number) *
              </label>
              <input
                type="text"
                required
                placeholder="17-character VIN"
                value={vin}
                onChange={(e) => setVin(e.target.value.toUpperCase())}
                className="w-full px-3 py-2 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-mono"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Vehicle Type
              </label>
              <select
                value={type}
                onChange={(e) => setType(e.target.value as VehicleType)}
                className="w-full px-3 py-2 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
              >
                <option value="Van">Van</option>
                <option value="Semi-Truck">Semi-Truck</option>
                <option value="Light Truck">Light Truck</option>
                <option value="Sedan">Sedan</option>
                <option value="SUV">SUV</option>
                <option value="Electric Cargo">Electric Cargo</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Operational Status
              </label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as VehicleStatus)}
                className="w-full px-3 py-2 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
              >
                <option value="Active">🟢 Active (Operational)</option>
                <option value="Maintenance">🟡 Maintenance (In Repair)</option>
                <option value="Out of Service">🔴 Out of Service</option>
                <option value="Reserved">⚪ Reserved (Scheduled)</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Current Odometer (km)
              </label>
              <input
                type="number"
                min="0"
                value={mileage}
                onChange={(e) => setMileage(Number(e.target.value))}
                className="w-full px-3 py-2 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-mono"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Fuel / Energy Type
              </label>
              <select
                value={fuelType}
                onChange={(e) => setFuelType(e.target.value as FuelType)}
                className="w-full px-3 py-2 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
              >
                <option value="Diesel">Diesel</option>
                <option value="Unleaded">Unleaded (Gasoline)</option>
                <option value="Electric">Electric</option>
                <option value="Hybrid">Hybrid</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Fuel / Battery Level: {fuelLevel}%
              </label>
              <input
                type="range"
                min="0"
                max="100"
                value={fuelLevel}
                onChange={(e) => setFuelLevel(Number(e.target.value))}
                className="w-full accent-blue-600"
              />
            </div>
          </div>

          {/* Insurance details */}
          <div className="pt-2 border-t border-slate-100 dark:border-slate-800 space-y-3">
            <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Insurance & Compliance
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                  Policy Number
                </label>
                <input
                  type="text"
                  value={insurancePolicy}
                  onChange={(e) => setInsurancePolicy(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-mono"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                  Insurance Carrier
                </label>
                <input
                  type="text"
                  value={insuranceProvider}
                  onChange={(e) => setInsuranceProvider(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                  Expiration Date
                </label>
                <input
                  type="date"
                  value={insuranceExpiry}
                  onChange={(e) => setInsuranceExpiry(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                />
              </div>
            </div>
          </div>

          {/* Notes */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Vehicle Notes & Equipment Spec
            </label>
            <textarea
              rows={2}
              placeholder="e.g. Equipped with liftgate, high roof, refrigeration..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full px-3 py-2 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
            />
          </div>

          {/* Footer actions */}
          <div className="pt-4 border-t border-slate-200 dark:border-slate-800 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-semibold shadow-xs"
            >
              Save Vehicle
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// Inspect Vehicle Drawer
interface VehicleInspectDrawerProps {
  vehicle: Vehicle;
  onClose: () => void;
  drivers: any[];
  maintenanceRecords: any[];
}

const VehicleInspectDrawer: React.FC<VehicleInspectDrawerProps> = ({
  vehicle,
  onClose,
  drivers,
  maintenanceRecords,
}) => {
  const driver = drivers.find((d) => d.id === vehicle.assignedDriverId);
  const vehicleMaintenance = maintenanceRecords.filter((m) => m.vehicleId === vehicle.id);

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-slate-900/40 backdrop-blur-xs">
      <div className="absolute inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white dark:bg-slate-900 shadow-2xl border-l border-slate-200 dark:border-slate-800 flex flex-col">
          {/* Header */}
          <div className="px-6 py-5 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
            <div>
              <div className="text-xs text-slate-500 font-mono">SPECIFICATION DOSSIER</div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                {vehicle.make} {vehicle.model}
              </h3>
            </div>
            <button
              onClick={onClose}
              className="p-1 rounded text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            {/* Status & Plate banner */}
            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800 flex items-center justify-between">
              <div>
                <div className="text-xs text-slate-500 font-mono">PLATE NUMBER</div>
                <div className="text-base font-bold font-mono text-slate-900 dark:text-white">
                  {vehicle.licensePlate}
                </div>
              </div>
              <StatusBadge status={vehicle.status} type="vehicle" />
            </div>

            {/* Core specs grid */}
            <div>
              <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">
                Technical Specifications
              </div>
              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="p-3 rounded-lg border border-slate-100 dark:border-slate-800">
                  <span className="text-slate-500 block text-[11px]">Type / Category</span>
                  <span className="font-semibold text-slate-900 dark:text-white">{vehicle.type}</span>
                </div>
                <div className="p-3 rounded-lg border border-slate-100 dark:border-slate-800">
                  <span className="text-slate-500 block text-[11px]">Manufacturing Year</span>
                  <span className="font-semibold text-slate-900 dark:text-white">{vehicle.year}</span>
                </div>
                <div className="p-3 rounded-lg border border-slate-100 dark:border-slate-800">
                  <span className="text-slate-500 block text-[11px]">Odometer Reading</span>
                  <span className="font-semibold font-mono text-slate-900 dark:text-white">
                    {vehicle.mileage.toLocaleString()} km
                  </span>
                </div>
                <div className="p-3 rounded-lg border border-slate-100 dark:border-slate-800">
                  <span className="text-slate-500 block text-[11px]">Fuel / Energy</span>
                  <span className="font-semibold text-slate-900 dark:text-white">
                    {vehicle.fuelType} ({vehicle.fuelLevel}%)
                  </span>
                </div>
              </div>
            </div>

            {/* VIN */}
            <div className="p-3 rounded-lg border border-slate-100 dark:border-slate-800">
              <span className="text-slate-500 block text-[11px]">VIN Number</span>
              <span className="font-mono text-xs font-bold text-slate-900 dark:text-white tracking-wider">
                {vehicle.vin}
              </span>
            </div>

            {/* Driver Assignment */}
            <div>
              <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
                Assigned Personnel
              </div>
              {driver ? (
                <div className="p-3 rounded-lg border border-slate-200 dark:border-slate-800 flex items-center justify-between">
                  <div>
                    <div className="font-bold text-xs text-slate-900 dark:text-white">
                      {driver.name}
                    </div>
                    <div className="text-[11px] text-slate-500">{driver.phone}</div>
                  </div>
                  <span className="text-xs text-emerald-600 font-medium">Active Driver</span>
                </div>
              ) : (
                <div className="p-3 text-xs text-slate-400 italic rounded-lg border border-dashed border-slate-200 dark:border-slate-800 text-center">
                  No driver currently assigned to this vehicle
                </div>
              )}
            </div>

            {/* Insurance Info */}
            <div>
              <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
                Insurance Compliance
              </div>
              <div className="p-3 rounded-lg border border-slate-200 dark:border-slate-800 space-y-1 text-xs">
                <div className="flex justify-between">
                  <span className="text-slate-500">Provider:</span>
                  <span className="font-medium text-slate-900 dark:text-white">{vehicle.insuranceProvider}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Policy:</span>
                  <span className="font-mono font-medium text-slate-900 dark:text-white">{vehicle.insurancePolicy}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Expiration:</span>
                  <span className="font-mono font-semibold text-slate-900 dark:text-white">{vehicle.insuranceExpiry}</span>
                </div>
              </div>
            </div>

            {/* Maintenance History */}
            <div>
              <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
                Service History ({vehicleMaintenance.length})
              </div>
              {vehicleMaintenance.length === 0 ? (
                <p className="text-xs text-slate-400 italic">No maintenance history recorded.</p>
              ) : (
                <div className="space-y-2">
                  {vehicleMaintenance.map((m) => (
                    <div
                      key={m.id}
                      className="p-2.5 rounded-lg border border-slate-100 dark:border-slate-800 text-xs flex justify-between items-center"
                    >
                      <div>
                        <div className="font-semibold text-slate-800 dark:text-slate-200">{m.serviceType}</div>
                        <div className="text-[10px] text-slate-400 font-mono">{m.scheduledDate}</div>
                      </div>
                      <StatusBadge status={m.status} type="maintenance" />
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
