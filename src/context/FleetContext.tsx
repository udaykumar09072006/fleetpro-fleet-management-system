import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  Vehicle,
  Driver,
  MaintenanceRecord,
  FuelLog,
  Assignment,
  User,
  FleetNotification,
  VehicleStatus,
} from '../types';
import {
  INITIAL_VEHICLES,
  INITIAL_DRIVERS,
  INITIAL_MAINTENANCE,
  INITIAL_FUEL_LOGS,
  INITIAL_ASSIGNMENTS,
  INITIAL_USERS,
  INITIAL_NOTIFICATIONS,
} from '../data/mockData';

interface FleetContextType {
  vehicles: Vehicle[];
  drivers: Driver[];
  maintenanceRecords: MaintenanceRecord[];
  fuelLogs: FuelLog[];
  assignments: Assignment[];
  currentUser: User;
  notifications: FleetNotification[];
  darkMode: boolean;
  currentTab: string;
  searchQuery: string;
  gpsSimulationActive: boolean;
  gpsSpeedMultiplier: number;
  selectedVehicleId: string | null;
  // Actions
  setCurrentTab: (tab: string) => void;
  setSearchQuery: (q: string) => void;
  toggleDarkMode: () => void;
  setCurrentUser: (user: User) => void;
  setSelectedVehicleId: (id: string | null) => void;
  toggleGpsSimulation: () => void;
  setGpsSpeedMultiplier: (mult: number) => void;
  // Vehicles CRUD
  addVehicle: (vehicle: Omit<Vehicle, 'id'>) => Vehicle;
  updateVehicle: (id: string, updates: Partial<Vehicle>) => void;
  deleteVehicle: (id: string) => void;
  // Drivers CRUD
  addDriver: (driver: Omit<Driver, 'id'>) => Driver;
  updateDriver: (id: string, updates: Partial<Driver>) => void;
  deleteDriver: (id: string) => void;
  // Assignments
  createAssignment: (data: { vehicleId: string; driverId: string; routePurpose: string; startOdometer: number; notes?: string }) => void;
  endAssignment: (assignmentId: string, endOdometer: number, notes?: string) => void;
  // Maintenance
  addMaintenance: (record: Omit<MaintenanceRecord, 'id'>) => MaintenanceRecord;
  updateMaintenance: (id: string, updates: Partial<MaintenanceRecord>) => void;
  completeMaintenance: (id: string, actualCost: number, notes?: string) => void;
  deleteMaintenance: (id: string) => void;
  // Fuel
  addFuelLog: (log: Omit<FuelLog, 'id'>) => FuelLog;
  deleteFuelLog: (id: string) => void;
  // Notifications
  markNotificationAsRead: (id: string) => void;
  markAllNotificationsAsRead: () => void;
  resetToDemoData: () => void;
}

const FleetContext = createContext<FleetContextType | undefined>(undefined);

export const FleetProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Persistence with localStorage
  const [vehicles, setVehicles] = useState<Vehicle[]>(() => {
    const saved = localStorage.getItem('fleetpro_vehicles');
    return saved ? JSON.parse(saved) : INITIAL_VEHICLES;
  });

  const [drivers, setDrivers] = useState<Driver[]>(() => {
    const saved = localStorage.getItem('fleetpro_drivers');
    return saved ? JSON.parse(saved) : INITIAL_DRIVERS;
  });

  const [maintenanceRecords, setMaintenanceRecords] = useState<MaintenanceRecord[]>(() => {
    const saved = localStorage.getItem('fleetpro_maintenance');
    return saved ? JSON.parse(saved) : INITIAL_MAINTENANCE;
  });

  const [fuelLogs, setFuelLogs] = useState<FuelLog[]>(() => {
    const saved = localStorage.getItem('fleetpro_fuel');
    return saved ? JSON.parse(saved) : INITIAL_FUEL_LOGS;
  });

  const [assignments, setAssignments] = useState<Assignment[]>(() => {
    const saved = localStorage.getItem('fleetpro_assignments');
    return saved ? JSON.parse(saved) : INITIAL_ASSIGNMENTS;
  });

  const [currentUser, setCurrentUser] = useState<User>(() => {
    const saved = localStorage.getItem('fleetpro_user');
    return saved ? JSON.parse(saved) : INITIAL_USERS[0];
  });

  const [notifications, setNotifications] = useState<FleetNotification[]>(() => {
    const saved = localStorage.getItem('fleetpro_notifications');
    return saved ? JSON.parse(saved) : INITIAL_NOTIFICATIONS;
  });

  const [darkMode, setDarkMode] = useState<boolean>(() => {
    const saved = localStorage.getItem('fleetpro_darkmode');
    return saved ? JSON.parse(saved) : false;
  });

  const [currentTab, setCurrentTab] = useState<string>('dashboard');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedVehicleId, setSelectedVehicleId] = useState<string | null>(null);
  const [gpsSimulationActive, setGpsSimulationActive] = useState<boolean>(true);
  const [gpsSpeedMultiplier, setGpsSpeedMultiplier] = useState<number>(1);

  // Sync state to localStorage
  useEffect(() => {
    localStorage.setItem('fleetpro_vehicles', JSON.stringify(vehicles));
  }, [vehicles]);

  useEffect(() => {
    localStorage.setItem('fleetpro_drivers', JSON.stringify(drivers));
  }, [drivers]);

  useEffect(() => {
    localStorage.setItem('fleetpro_maintenance', JSON.stringify(maintenanceRecords));
  }, [maintenanceRecords]);

  useEffect(() => {
    localStorage.setItem('fleetpro_fuel', JSON.stringify(fuelLogs));
  }, [fuelLogs]);

  useEffect(() => {
    localStorage.setItem('fleetpro_assignments', JSON.stringify(assignments));
  }, [assignments]);

  useEffect(() => {
    localStorage.setItem('fleetpro_user', JSON.stringify(currentUser));
  }, [currentUser]);

  useEffect(() => {
    localStorage.setItem('fleetpro_notifications', JSON.stringify(notifications));
  }, [notifications]);

  useEffect(() => {
    localStorage.setItem('fleetpro_darkmode', JSON.stringify(darkMode));
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  // Simulated GPS movement loop for active vehicles
  useEffect(() => {
    if (!gpsSimulationActive) return;

    const interval = setInterval(() => {
      setVehicles((prev) =>
        prev.map((v) => {
          if (v.status !== 'Active' || !v.assignedDriverId) return v;

          // Realistic simulated motion vector
          const deltaLat = (Math.random() - 0.48) * 0.0012 * gpsSpeedMultiplier;
          const deltaLng = (Math.random() - 0.47) * 0.0014 * gpsSpeedMultiplier;
          const currentSpeed = Math.max(18, Math.min(95, Math.round(v.location.speed + (Math.random() * 8 - 4))));
          const newHeading = (v.location.heading + Math.round((Math.random() * 20 - 10)) + 360) % 360;

          return {
            ...v,
            mileage: v.mileage + (Math.random() > 0.6 ? 1 : 0),
            location: {
              ...v.location,
              lat: Number((v.location.lat + deltaLat).toFixed(6)),
              lng: Number((v.location.lng + deltaLng).toFixed(6)),
              speed: currentSpeed,
              heading: newHeading,
            },
          };
        })
      );
    }, 2500 / gpsSpeedMultiplier);

    return () => clearInterval(interval);
  }, [gpsSimulationActive, gpsSpeedMultiplier]);

  const toggleDarkMode = () => setDarkMode((prev) => !prev);
  const toggleGpsSimulation = () => setGpsSimulationActive((prev) => !prev);

  // Vehicle Actions
  const addVehicle = (vehicleData: Omit<Vehicle, 'id'>) => {
    const newVehicle: Vehicle = {
      ...vehicleData,
      id: `veh-${Date.now()}`,
    };
    setVehicles((prev) => [newVehicle, ...prev]);
    return newVehicle;
  };

  const updateVehicle = (id: string, updates: Partial<Vehicle>) => {
    setVehicles((prev) =>
      prev.map((v) => (v.id === id ? { ...v, ...updates } : v))
    );
  };

  const deleteVehicle = (id: string) => {
    setVehicles((prev) => prev.filter((v) => v.id !== id));
    // Clear assignments if any
    setDrivers((prev) =>
      prev.map((d) => (d.assignedVehicleId === id ? { ...d, assignedVehicleId: null, status: 'Available' } : d))
    );
  };

  // Driver Actions
  const addDriver = (driverData: Omit<Driver, 'id'>) => {
    const newDriver: Driver = {
      ...driverData,
      id: `drv-${Date.now()}`,
    };
    setDrivers((prev) => [newDriver, ...prev]);
    return newDriver;
  };

  const updateDriver = (id: string, updates: Partial<Driver>) => {
    setDrivers((prev) =>
      prev.map((d) => (d.id === id ? { ...d, ...updates } : d))
    );
  };

  const deleteDriver = (id: string) => {
    setDrivers((prev) => prev.filter((d) => d.id !== id));
    setVehicles((prev) =>
      prev.map((v) => (v.assignedDriverId === id ? { ...v, assignedDriverId: null } : v))
    );
  };

  // Vehicle-Driver Assignment
  const createAssignment = ({
    vehicleId,
    driverId,
    routePurpose,
    startOdometer,
    notes,
  }: {
    vehicleId: string;
    driverId: string;
    routePurpose: string;
    startOdometer: number;
    notes?: string;
  }) => {
    const newAssignment: Assignment = {
      id: `asg-${Date.now()}`,
      vehicleId,
      driverId,
      routePurpose,
      startTime: new Date().toISOString().slice(0, 16).replace('T', ' '),
      startOdometer,
      status: 'Active',
      notes,
    };

    setAssignments((prev) => [newAssignment, ...prev]);

    // Update vehicle: set assigned driver, set status to Active
    setVehicles((prev) =>
      prev.map((v) =>
        v.id === vehicleId ? { ...v, assignedDriverId: driverId, status: 'Active' as VehicleStatus } : v
      )
    );

    // Update driver: set assigned vehicle, set status to On Route
    setDrivers((prev) =>
      prev.map((d) =>
        d.id === driverId ? { ...d, assignedVehicleId: vehicleId, status: 'On Route' } : d
      )
    );
  };

  const endAssignment = (assignmentId: string, endOdometer: number, notes?: string) => {
    const targetAssignment = assignments.find((a) => a.id === assignmentId);
    if (!targetAssignment) return;

    setAssignments((prev) =>
      prev.map((a) =>
        a.id === assignmentId
          ? {
              ...a,
              status: 'Completed',
              endTime: new Date().toISOString().slice(0, 16).replace('T', ' '),
              endOdometer,
              notes: notes ? (a.notes ? `${a.notes} | ${notes}` : notes) : a.notes,
            }
          : a
      )
    );

    // Free driver
    setDrivers((prev) =>
      prev.map((d) =>
        d.id === targetAssignment.driverId
          ? { ...d, assignedVehicleId: null, status: 'Available', totalTrips: d.totalTrips + 1 }
          : d
      )
    );

    // Update vehicle odometer and detach driver
    setVehicles((prev) =>
      prev.map((v) =>
        v.id === targetAssignment.vehicleId
          ? {
              ...v,
              assignedDriverId: null,
              mileage: Math.max(v.mileage, endOdometer),
            }
          : v
      )
    );
  };

  // Maintenance Actions
  const addMaintenance = (recordData: Omit<MaintenanceRecord, 'id'>) => {
    const newRecord: MaintenanceRecord = {
      ...recordData,
      id: `mnt-${Date.now()}`,
    };
    setMaintenanceRecords((prev) => [newRecord, ...prev]);

    // If status is In Progress, mark vehicle as Maintenance
    if (recordData.status === 'In Progress') {
      updateVehicle(recordData.vehicleId, { status: 'Maintenance' });
    }

    return newRecord;
  };

  const updateMaintenance = (id: string, updates: Partial<MaintenanceRecord>) => {
    setMaintenanceRecords((prev) =>
      prev.map((m) => (m.id === id ? { ...m, ...updates } : m))
    );
  };

  const completeMaintenance = (id: string, actualCost: number, notes?: string) => {
    const target = maintenanceRecords.find((m) => m.id === id);
    if (!target) return;

    const todayStr = new Date().toISOString().slice(0, 10);

    setMaintenanceRecords((prev) =>
      prev.map((m) =>
        m.id === id
          ? {
              ...m,
              status: 'Completed',
              completedDate: todayStr,
              actualCost,
              notes: notes || m.notes,
              invoiceNumber: m.invoiceNumber || `INV-${Date.now().toString().slice(-6)}`,
            }
          : m
      )
    );

    // Return vehicle to Active if it was in Maintenance
    updateVehicle(target.vehicleId, {
      status: 'Active',
      lastServiceDate: todayStr,
    });
  };

  const deleteMaintenance = (id: string) => {
    setMaintenanceRecords((prev) => prev.filter((m) => m.id !== id));
  };

  // Fuel Actions
  const addFuelLog = (logData: Omit<FuelLog, 'id'>) => {
    const newLog: FuelLog = {
      ...logData,
      id: `fuel-${Date.now()}`,
    };
    setFuelLogs((prev) => [newLog, ...prev]);

    // Update vehicle odometer if higher and replenish fuel level
    updateVehicle(logData.vehicleId, {
      mileage: Math.max(logData.odometer, 0),
      fuelLevel: logData.fullTank ? 100 : Math.min(100, Math.floor(Math.random() * 20 + 80)),
    });

    return newLog;
  };

  const deleteFuelLog = (id: string) => {
    setFuelLogs((prev) => prev.filter((f) => f.id !== id));
  };

  // Notification Actions
  const markNotificationAsRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

  const markAllNotificationsAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const resetToDemoData = () => {
    localStorage.removeItem('fleetpro_vehicles');
    localStorage.removeItem('fleetpro_drivers');
    localStorage.removeItem('fleetpro_maintenance');
    localStorage.removeItem('fleetpro_fuel');
    localStorage.removeItem('fleetpro_assignments');
    localStorage.removeItem('fleetpro_notifications');
    setVehicles(INITIAL_VEHICLES);
    setDrivers(INITIAL_DRIVERS);
    setMaintenanceRecords(INITIAL_MAINTENANCE);
    setFuelLogs(INITIAL_FUEL_LOGS);
    setAssignments(INITIAL_ASSIGNMENTS);
    setNotifications(INITIAL_NOTIFICATIONS);
    setCurrentUser(INITIAL_USERS[0]);
  };

  return (
    <FleetContext.Provider
      value={{
        vehicles,
        drivers,
        maintenanceRecords,
        fuelLogs,
        assignments,
        currentUser,
        notifications,
        darkMode,
        currentTab,
        searchQuery,
        gpsSimulationActive,
        gpsSpeedMultiplier,
        selectedVehicleId,
        setCurrentTab,
        setSearchQuery,
        toggleDarkMode,
        setCurrentUser,
        setSelectedVehicleId,
        toggleGpsSimulation,
        setGpsSpeedMultiplier,
        addVehicle,
        updateVehicle,
        deleteVehicle,
        addDriver,
        updateDriver,
        deleteDriver,
        createAssignment,
        endAssignment,
        addMaintenance,
        updateMaintenance,
        completeMaintenance,
        deleteMaintenance,
        addFuelLog,
        deleteFuelLog,
        markNotificationAsRead,
        markAllNotificationsAsRead,
        resetToDemoData,
      }}
    >
      {children}
    </FleetContext.Provider>
  );
};

export const useFleet = () => {
  const context = useContext(FleetContext);
  if (!context) {
    throw new Error('useFleet must be used within a FleetProvider');
  }
  return context;
};
