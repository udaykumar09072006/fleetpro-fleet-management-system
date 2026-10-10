export type VehicleStatus = 'Active' | 'Maintenance' | 'Out of Service' | 'Reserved';

export type VehicleType = 'Van' | 'Semi-Truck' | 'Light Truck' | 'Sedan' | 'SUV' | 'Electric Cargo';

export type FuelType = 'Diesel' | 'Unleaded' | 'Electric' | 'Hybrid';

export interface Vehicle {
  id: string;
  make: string;
  model: string;
  year: number;
  licensePlate: string;
  vin: string;
  type: VehicleType;
  status: VehicleStatus;
  mileage: number; // in km
  fuelType: FuelType;
  fuelLevel: number; // percentage 0-100
  assignedDriverId: string | null;
  lastServiceDate: string;
  nextServiceMileage: number;
  insurancePolicy: string;
  insuranceExpiry: string;
  insuranceProvider: string;
  notes?: string;
  // Simulated GPS Telemetry
  location: {
    lat: number;
    lng: number;
    address: string;
    speed: number; // km/h
    heading: number; // degrees
  };
}

export type DriverStatus = 'Available' | 'On Route' | 'Off Duty';

export interface Driver {
  id: string;
  name: string;
  licenseNumber: string;
  licenseCategory: 'Class A (Heavy)' | 'Class B (Commercial)' | 'Class C (Standard)' | 'CDL HazMat';
  licenseExpiry: string;
  phone: string;
  email: string;
  status: DriverStatus;
  assignedVehicleId: string | null;
  experienceYears: number;
  safetyRating: number; // e.g. 4.8 / 5.0
  totalTrips: number;
  emergencyContact: {
    name: string;
    relationship: string;
    phone: string;
  };
  avatarUrl?: string;
  joinDate: string;
}

export type MaintenancePriority = 'Low' | 'Medium' | 'High' | 'Urgent';
export type MaintenanceStatus = 'Scheduled' | 'In Progress' | 'Completed' | 'Overdue';

export interface MaintenanceRecord {
  id: string;
  vehicleId: string;
  serviceType: string;
  scheduledDate: string;
  completedDate?: string;
  status: MaintenanceStatus;
  priority: MaintenancePriority;
  estimatedCost: number;
  actualCost?: number;
  serviceProvider: string;
  notes: string;
  invoiceNumber?: string;
}

export interface FuelLog {
  id: string;
  vehicleId: string;
  driverId: string;
  date: string;
  odometer: number;
  quantity: number; // in Liters
  unitCost: number; // per Liter
  totalCost: number;
  fuelStation: string;
  fullTank: boolean;
  notes?: string;
}

export interface Assignment {
  id: string;
  vehicleId: string;
  driverId: string;
  routePurpose: string;
  startTime: string;
  endTime?: string;
  startOdometer: number;
  endOdometer?: number;
  status: 'Active' | 'Completed';
  notes?: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'Fleet Manager' | 'Dispatcher' | 'Maintenance Supervisor';
  avatar?: string;
}

export interface FleetNotification {
  id: string;
  type: 'maintenance' | 'insurance' | 'license' | 'system';
  severity: 'info' | 'warning' | 'urgent';
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  entityId?: string;
}
