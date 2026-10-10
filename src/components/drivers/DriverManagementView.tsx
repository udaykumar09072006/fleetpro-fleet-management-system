import React, { useState, useMemo } from 'react';
import {
  Users,
  Plus,
  Search,
  Filter,
  Phone,
  Mail,
  Shield,
  Star,
  Truck,
  Edit2,
  Trash2,
  AlertTriangle,
  CheckCircle2,
  Calendar,
  X,
  Sparkles,
  UserCheck,
} from 'lucide-react';
import { useFleet } from '../../context/FleetContext';
import { Driver, DriverStatus } from '../../types';
import { StatusBadge } from '../common/StatusBadge';

export const DriverManagementView: React.FC = () => {
  const { drivers, vehicles, addDriver, updateDriver, deleteDriver, searchQuery, setSearchQuery } =
    useFleet();

  const [statusFilter, setStatusFilter] = useState<string>('All');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingDriver, setEditingDriver] = useState<Driver | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const filteredDrivers = useMemo(() => {
    return drivers.filter((d) => {
      const q = searchQuery.toLowerCase();
      const matchesSearch =
        !q ||
        d.name.toLowerCase().includes(q) ||
        d.licenseNumber.toLowerCase().includes(q) ||
        d.email.toLowerCase().includes(q) ||
        d.phone.includes(q);

      const matchesStatus = statusFilter === 'All' || d.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [drivers, searchQuery, statusFilter]);

  return (
    <div className="space-y-6">
      {/* Top Toolbar */}
      <div className="p-4 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Filter controls */}
        <div className="flex flex-wrap items-center gap-2.5">
          <div className="flex items-center gap-1.5 text-xs text-slate-500">
            <span>Status:</span>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-2.5 py-1.5 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white font-medium"
            >
              <option value="All">All Personnel ({drivers.length})</option>
              <option value="Available">Available ({drivers.filter((d) => d.status === 'Available').length})</option>
              <option value="On Route">On Route ({drivers.filter((d) => d.status === 'On Route').length})</option>
              <option value="Off Duty">Off Duty ({drivers.filter((d) => d.status === 'Off Duty').length})</option>
            </select>
          </div>
        </div>

        {/* Add Driver CTA */}
        <button
          onClick={() => setIsAddModalOpen(true)}
          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 shadow-xs transition-colors self-start md:self-auto"
        >
          <Plus className="w-4 h-4" />
          Add Driver Profile
        </button>
      </div>

      {/* Driver Cards Grid */}
      {filteredDrivers.length === 0 ? (
        <div className="p-12 text-center bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800">
          <Users className="w-12 h-12 text-slate-300 dark:text-slate-600 mx-auto mb-3" />
          <h3 className="text-base font-semibold text-slate-900 dark:text-white">
            No drivers found
          </h3>
          <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
            Try adjusting your search criteria or register a new driver.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredDrivers.map((driver) => {
            const assignedVehicle = vehicles.find((v) => v.id === driver.assignedVehicleId);
            const isLicenseExpiringSoon =
              new Date(driver.licenseExpiry).getTime() - new Date().getTime() <
              30 * 24 * 60 * 60 * 1000;

            return (
              <div
                key={driver.id}
                className="p-5 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col justify-between hover:border-blue-400 transition-colors"
              >
                <div>
                  {/* Top user row */}
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className="w-11 h-11 rounded-full bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 overflow-hidden flex items-center justify-center shrink-0">
                        {driver.avatarUrl ? (
                          <img
                            src={driver.avatarUrl}
                            alt={driver.name}
                            className="w-full h-full object-cover"
                            referrerPolicy="no-referrer"
                            onError={(e) => {
                              (e.target as HTMLElement).style.display = 'none';
                            }}
                          />
                        ) : (
                          <span className="font-bold text-slate-700 dark:text-slate-300 text-sm">
                            {driver.name.charAt(0)}
                          </span>
                        )}
                      </div>

                      <div>
                        <h4 className="font-bold text-sm text-slate-900 dark:text-white">
                          {driver.name}
                        </h4>
                        <div className="text-xs text-slate-500 flex items-center gap-1 font-mono">
                          <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                          <span className="font-bold text-slate-800 dark:text-slate-200">
                            {driver.safetyRating.toFixed(2)}
                          </span>
                          <span>·</span>
                          <span>{driver.totalTrips} trips</span>
                        </div>
                      </div>
                    </div>

                    <StatusBadge status={driver.status} type="driver" />
                  </div>

                  {/* License & Credentials */}
                  <div className="mt-4 p-3 rounded-lg bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 space-y-1.5 text-xs font-mono">
                    <div className="flex justify-between items-center">
                      <span className="text-slate-500">License:</span>
                      <span className="font-semibold text-slate-900 dark:text-white">
                        {driver.licenseNumber}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-slate-500">Category:</span>
                      <span className="text-slate-700 dark:text-slate-300">
                        {driver.licenseCategory}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-slate-500">Expires:</span>
                      <span
                        className={`flex items-center gap-1 font-semibold ${
                          isLicenseExpiringSoon ? 'text-amber-600 dark:text-amber-400' : 'text-slate-700 dark:text-slate-300'
                        }`}
                      >
                        {isLicenseExpiringSoon && <AlertTriangle className="w-3 h-3 text-amber-500" />}
                        {driver.licenseExpiry}
                      </span>
                    </div>
                  </div>

                  {/* Assigned Vehicle */}
                  <div className="mt-3 text-xs">
                    <span className="text-slate-500 block mb-1">Assigned Vehicle:</span>
                    {assignedVehicle ? (
                      <div className="p-2.5 rounded-lg border border-blue-200 dark:border-blue-900/60 bg-blue-50/50 dark:bg-blue-950/20 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Truck className="w-4 h-4 text-blue-600" />
                          <div>
                            <div className="font-semibold text-slate-900 dark:text-white">
                              {assignedVehicle.make} {assignedVehicle.model}
                            </div>
                            <div className="text-[11px] font-mono text-slate-500">
                              {assignedVehicle.licensePlate}
                            </div>
                          </div>
                        </div>
                        <StatusBadge status={assignedVehicle.status} type="vehicle" />
                      </div>
                    ) : (
                      <div className="p-2.5 rounded-lg border border-dashed border-slate-200 dark:border-slate-800 text-slate-400 italic text-center">
                        No vehicle assigned
                      </div>
                    )}
                  </div>

                  {/* Contact info */}
                  <div className="mt-3 pt-3 border-t border-slate-100 dark:border-slate-800 space-y-1 text-xs text-slate-600 dark:text-slate-400">
                    <div className="flex items-center gap-2">
                      <Phone className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span className="truncate">{driver.phone}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Mail className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span className="truncate">{driver.email}</span>
                    </div>
                  </div>
                </div>

                {/* Card footer actions */}
                <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs">
                  <span className="text-[11px] text-slate-400">
                    {driver.experienceYears} yrs experience
                  </span>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => setEditingDriver(driver)}
                      className="p-1.5 rounded text-slate-400 hover:text-amber-600 hover:bg-slate-100 dark:hover:bg-slate-800"
                      title="Edit Profile"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => setDeletingId(driver.id)}
                      className="p-1.5 rounded text-slate-400 hover:text-rose-600 hover:bg-slate-100 dark:hover:bg-slate-800"
                      title="Delete Profile"
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

      {/* ADD DRIVER MODAL */}
      {isAddModalOpen && (
        <DriverFormModal
          isOpen={isAddModalOpen}
          onClose={() => setIsAddModalOpen(false)}
          onSave={(data) => {
            addDriver(data);
            setIsAddModalOpen(false);
          }}
          title="Register New Driver Profile"
        />
      )}

      {/* EDIT DRIVER MODAL */}
      {editingDriver && (
        <DriverFormModal
          isOpen={!!editingDriver}
          initialData={editingDriver}
          onClose={() => setEditingDriver(null)}
          onSave={(data) => {
            updateDriver(editingDriver.id, data);
            setEditingDriver(null);
          }}
          title={`Edit Driver: ${editingDriver.name}`}
        />
      )}

      {/* DELETE MODAL */}
      {deletingId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="w-full max-w-sm bg-white dark:bg-slate-900 rounded-xl shadow-xl border border-slate-200 dark:border-slate-800 p-6 space-y-4">
            <div className="w-10 h-10 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center mx-auto">
              <Trash2 className="w-5 h-5" />
            </div>
            <div className="text-center">
              <h3 className="font-bold text-slate-900 dark:text-white">Delete Driver Profile</h3>
              <p className="text-xs text-slate-500 mt-1">
                Are you sure you want to delete this driver? Any active vehicle assignment will be detached.
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
                  deleteDriver(deletingId);
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

// Driver Form Modal
interface DriverFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: Omit<Driver, 'id'>) => void;
  initialData?: Driver;
  title: string;
}

const DriverFormModal: React.FC<DriverFormModalProps> = ({
  isOpen,
  onClose,
  onSave,
  initialData,
  title,
}) => {
  const [name, setName] = useState(initialData?.name || '');
  const [licenseNumber, setLicenseNumber] = useState(initialData?.licenseNumber || '');
  const [licenseCategory, setLicenseCategory] = useState<any>(
    initialData?.licenseCategory || 'Class B (Commercial)'
  );
  const [licenseExpiry, setLicenseExpiry] = useState(initialData?.licenseExpiry || '2028-06-30');
  const [phone, setPhone] = useState(initialData?.phone || '');
  const [email, setEmail] = useState(initialData?.email || '');
  const [status, setStatus] = useState<DriverStatus>(initialData?.status || 'Available');
  const [experienceYears, setExperienceYears] = useState(initialData?.experienceYears || 5);
  const [safetyRating, setSafetyRating] = useState(initialData?.safetyRating || 4.9);
  const [emergencyName, setEmergencyName] = useState(initialData?.emergencyContact?.name || '');
  const [emergencyPhone, setEmergencyPhone] = useState(initialData?.emergencyContact?.phone || '');
  const [emergencyRel, setEmergencyRel] = useState(initialData?.emergencyContact?.relationship || 'Spouse');

  if (!isOpen) return null;

  const handleQuickFill = () => {
    const names = ['Jordan Reed', 'Taylor Diaz', 'Devon Kim', 'Sophia Martinez', 'Zack Foster'];
    const randomName = names[Math.floor(Math.random() * names.length)];
    const num = Math.floor(1000000 + Math.random() * 9000000);
    setName(randomName);
    setLicenseNumber(`DL-CA-${num}`);
    setPhone(`+1 (555) ${Math.floor(200 + Math.random() * 800)}-${Math.floor(1000 + Math.random() * 9000)}`);
    setEmail(`${randomName.toLowerCase().replace(' ', '.')}@fleetpro.io`);
    setExperienceYears(Math.floor(3 + Math.random() * 12));
    setSafetyRating(4.85);
    setEmergencyName('Morgan ' + randomName.split(' ')[1]);
    setEmergencyPhone('+1 (555) 999-1234');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !licenseNumber || !phone) return;

    onSave({
      name,
      licenseNumber,
      licenseCategory,
      licenseExpiry,
      phone,
      email,
      status,
      assignedVehicleId: initialData?.assignedVehicleId || null,
      experienceYears: Number(experienceYears),
      safetyRating: Number(safetyRating),
      totalTrips: initialData?.totalTrips || 0,
      emergencyContact: {
        name: emergencyName || 'Family Member',
        relationship: emergencyRel,
        phone: emergencyPhone || phone,
      },
      avatarUrl:
        initialData?.avatarUrl ||
        `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(name)}`,
      joinDate: initialData?.joinDate || new Date().toISOString().slice(0, 10),
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <div className="w-full max-w-xl bg-white dark:bg-slate-900 rounded-xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <UserCheck className="w-5 h-5 text-blue-600" />
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

        {/* Body */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Full Driver Name *
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Carlos Morales"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3 py-2 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                License Number *
              </label>
              <input
                type="text"
                required
                placeholder="DL-XX-0000000"
                value={licenseNumber}
                onChange={(e) => setLicenseNumber(e.target.value.toUpperCase())}
                className="w-full px-3 py-2 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-mono"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                License Category
              </label>
              <select
                value={licenseCategory}
                onChange={(e) => setLicenseCategory(e.target.value as any)}
                className="w-full px-3 py-2 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
              >
                <option value="Class A (Heavy)">Class A (Heavy Commercial)</option>
                <option value="Class B (Commercial)">Class B (Medium / Bus)</option>
                <option value="Class C (Standard)">Class C (Standard Fleet)</option>
                <option value="CDL HazMat">CDL HazMat Certified</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                License Expiration Date
              </label>
              <input
                type="date"
                required
                value={licenseExpiry}
                onChange={(e) => setLicenseExpiry(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Status
              </label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as DriverStatus)}
                className="w-full px-3 py-2 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
              >
                <option value="Available">Available (Ready for Dispatch)</option>
                <option value="On Route">On Route (Active Shift)</option>
                <option value="Off Duty">Off Duty (Rest Period)</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Phone Number *
              </label>
              <input
                type="text"
                required
                placeholder="+1 (555) 000-0000"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Email Address
              </label>
              <input
                type="email"
                placeholder="driver@fleetpro.io"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Years of Driving Experience
              </label>
              <input
                type="number"
                min="0"
                value={experienceYears}
                onChange={(e) => setExperienceYears(Number(e.target.value))}
                className="w-full px-3 py-2 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-mono"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Safety Rating (out of 5.0)
              </label>
              <input
                type="number"
                step="0.05"
                min="1"
                max="5"
                value={safetyRating}
                onChange={(e) => setSafetyRating(Number(e.target.value))}
                className="w-full px-3 py-2 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-mono"
              />
            </div>
          </div>

          {/* Emergency Contact */}
          <div className="pt-2 border-t border-slate-100 dark:border-slate-800 space-y-3">
            <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Emergency Contact Information
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                  Contact Name
                </label>
                <input
                  type="text"
                  placeholder="e.g. Maria Morales"
                  value={emergencyName}
                  onChange={(e) => setEmergencyName(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                  Relationship
                </label>
                <input
                  type="text"
                  placeholder="e.g. Spouse, Parent"
                  value={emergencyRel}
                  onChange={(e) => setEmergencyRel(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                  Emergency Phone
                </label>
                <input
                  type="text"
                  placeholder="+1 (555) 000-0000"
                  value={emergencyPhone}
                  onChange={(e) => setEmergencyPhone(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                />
              </div>
            </div>
          </div>

          {/* Footer */}
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
              Save Profile
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
