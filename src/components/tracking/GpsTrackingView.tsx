import React, { useState, useMemo } from 'react';
import {
  Navigation,
  Play,
  Pause,
  Compass,
  Truck,
  MapPin,
  Gauge,
  Zap,
  Fuel,
  Users,
  Eye,
  Radio,
  Layers,
  Crosshair,
  RotateCw,
} from 'lucide-react';
import { useFleet } from '../../context/FleetContext';
import { Vehicle } from '../../types';
import { StatusBadge } from '../common/StatusBadge';

export const GpsTrackingView: React.FC = () => {
  const {
    vehicles,
    drivers,
    gpsSimulationActive,
    toggleGpsSimulation,
    gpsSpeedMultiplier,
    setGpsSpeedMultiplier,
    selectedVehicleId,
    setSelectedVehicleId,
  } = useFleet();

  const [mapFilter, setMapFilter] = useState<'All' | 'Active' | 'Moving'>('All');
  const [activeVehicle, setActiveVehicle] = useState<Vehicle | null>(() => {
    return selectedVehicleId ? vehicles.find((v) => v.id === selectedVehicleId) || vehicles[0] : vehicles[0];
  });

  // Keep activeVehicle updated with telemetry changes
  const currentActiveVehicle = useMemo(() => {
    if (!activeVehicle) return vehicles[0];
    return vehicles.find((v) => v.id === activeVehicle.id) || activeVehicle;
  }, [vehicles, activeVehicle]);

  // Filter vehicles for map display
  const mapVehicles = useMemo(() => {
    return vehicles.filter((v) => {
      if (mapFilter === 'Active') return v.status === 'Active';
      if (mapFilter === 'Moving') return v.status === 'Active' && v.location.speed > 0;
      return true;
    });
  }, [vehicles, mapFilter]);

  // Map coordinates projection helper (simulated bay area bounds)
  // Lat: 37.7500 to 37.7950 (~0.045)
  // Lng: -122.4350 to -122.3850 (~0.050)
  const getMapCoordinates = (lat: number, lng: number) => {
    const minLat = 37.7500;
    const maxLat = 37.7950;
    const minLng = -122.4350;
    const maxLng = -122.3850;

    const x = Math.max(5, Math.min(95, ((lng - minLng) / (maxLng - minLng)) * 100));
    // inverted Y for SVG/CSS screen coords (higher latitude is north = top)
    const y = Math.max(5, Math.min(95, (1 - (lat - minLat) / (maxLat - minLat)) * 100));

    return { x, y };
  };

  const activeDriver = drivers.find((d) => d.id === currentActiveVehicle?.assignedDriverId);

  return (
    <div className="space-y-4">
      {/* Top Map Header & Controls */}
      <div className="p-4 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs flex flex-wrap items-center justify-between gap-4">
        {/* Left: Simulation Status */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <span
              className={`w-2.5 h-2.5 rounded-full ${
                gpsSimulationActive ? 'bg-emerald-500 animate-ping' : 'bg-slate-400'
              }`}
            />
            <span className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">
              {gpsSimulationActive ? 'Live Telemetry Stream Active' : 'Simulation Paused'}
            </span>
          </div>

          <span className="text-xs text-slate-400">·</span>

          <span className="text-xs text-slate-500 font-mono tabular-nums">
            {vehicles.filter((v) => v.location.speed > 0).length} vehicles in transit
          </span>
        </div>

        {/* Center/Right: Play/Pause, Speed multipliers, Filter */}
        <div className="flex flex-wrap items-center gap-2.5">
          {/* Status filter */}
          <div className="flex items-center gap-1 p-0.5 rounded-lg bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs">
            <button
              onClick={() => setMapFilter('All')}
              className={`px-2.5 py-1 rounded-md font-medium transition-colors ${
                mapFilter === 'All' ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs' : 'text-slate-500'
              }`}
            >
              All ({vehicles.length})
            </button>
            <button
              onClick={() => setMapFilter('Active')}
              className={`px-2.5 py-1 rounded-md font-medium transition-colors ${
                mapFilter === 'Active' ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs' : 'text-slate-500'
              }`}
            >
              Active ({vehicles.filter((v) => v.status === 'Active').length})
            </button>
            <button
              onClick={() => setMapFilter('Moving')}
              className={`px-2.5 py-1 rounded-md font-medium transition-colors ${
                mapFilter === 'Moving' ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs' : 'text-slate-500'
              }`}
            >
              Moving ({vehicles.filter((v) => v.location.speed > 0).length})
            </button>
          </div>

          {/* Speed multiplier */}
          <div className="flex items-center gap-1 text-xs">
            <span className="text-slate-400">Speed:</span>
            {[1, 2, 5].map((mult) => (
              <button
                key={mult}
                onClick={() => setGpsSpeedMultiplier(mult)}
                className={`px-2 py-1 rounded text-xs font-mono font-bold transition-colors ${
                  gpsSpeedMultiplier === mult
                    ? 'bg-blue-600 text-white'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200'
                }`}
              >
                {mult}x
              </button>
            ))}
          </div>

          {/* Play/pause toggle */}
          <button
            onClick={toggleGpsSimulation}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-xs ${
              gpsSimulationActive
                ? 'bg-amber-500 hover:bg-amber-600 text-white'
                : 'bg-emerald-600 hover:bg-emerald-700 text-white'
            }`}
          >
            {gpsSimulationActive ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
            <span>{gpsSimulationActive ? 'Pause Sim' : 'Resume Sim'}</span>
          </button>
        </div>
      </div>

      {/* Main Map & Telemetry Split Screen */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 h-[650px]">
        {/* Map Viewport (3 cols) */}
        <div className="lg:col-span-3 bg-slate-900 rounded-xl border border-slate-800 overflow-hidden relative shadow-lg flex flex-col">
          {/* Simulated Vector Vector Map Canvas */}
          <div className="relative flex-1 w-full h-full bg-[#0F172A] overflow-hidden select-none">
            {/* SVG Roads & Metro Grid Graphics */}
            <svg
              className="absolute inset-0 w-full h-full opacity-40 pointer-events-none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <defs>
                <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                  <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#1E293B" strokeWidth="1" />
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#grid)" />

              {/* Water Bay Area boundary */}
              <path
                d="M 680 0 Q 720 180 800 280 T 920 650 L 1200 650 L 1200 0 Z"
                fill="#0B132B"
                opacity="0.8"
              />

              {/* Major Highway Arteries */}
              <line x1="0" y1="280" x2="1200" y2="280" stroke="#334155" strokeWidth="5" />
              <line x1="260" y1="0" x2="260" y2="650" stroke="#334155" strokeWidth="4" />
              <line x1="580" y1="0" x2="580" y2="650" stroke="#334155" strokeWidth="4" />
              <line x1="0" y1="460" x2="1200" y2="460" stroke="#334155" strokeWidth="3" />

              {/* Highway Interstate Line (Orange Accent) */}
              <path
                d="M 0 160 Q 300 240 600 220 T 1200 320"
                fill="none"
                stroke="#475569"
                strokeWidth="4"
                strokeDasharray="8 4"
              />

              {/* Depot / Hub icons */}
              <circle cx="180" cy="380" r="18" fill="#1E293B" stroke="#3B82F6" strokeWidth="2" />
              <text x="180" y="384" textAnchor="middle" fill="#93C5FD" fontSize="10" fontFamily="sans-serif">
                DEPOT
              </text>

              <circle cx="560" cy="180" r="18" fill="#1E293B" stroke="#10B981" strokeWidth="2" />
              <text x="560" y="184" textAnchor="middle" fill="#6EE7B7" fontSize="10" fontFamily="sans-serif">
                PORT
              </text>

              <circle cx="740" cy="420" r="18" fill="#1E293B" stroke="#F59E0B" strokeWidth="2" />
              <text x="740" y="424" textAnchor="middle" fill="#FCD34D" fontSize="10" fontFamily="sans-serif">
                HUB 4
              </text>
            </svg>

            {/* Map Legend Overlay */}
            <div className="absolute top-4 left-4 z-20 bg-slate-900/90 backdrop-blur-xs border border-slate-800 p-2.5 rounded-lg text-xs space-y-1 pointer-events-none shadow-md">
              <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                Sector Map / Metro Zone
              </div>
              <div className="flex items-center gap-2 text-slate-300">
                <span className="w-2 h-2 rounded-full bg-emerald-500" />
                <span>Active Transit</span>
              </div>
              <div className="flex items-center gap-2 text-slate-300">
                <span className="w-2 h-2 rounded-full bg-amber-500" />
                <span>Service Bay</span>
              </div>
              <div className="flex items-center gap-2 text-slate-300">
                <span className="w-2 h-2 rounded-full bg-rose-500" />
                <span>Out of Service</span>
              </div>
            </div>

            {/* Simulated Live Vehicle Markers */}
            {mapVehicles.map((v) => {
              const { x, y } = getMapCoordinates(v.location.lat, v.location.lng);
              const isSelected = currentActiveVehicle?.id === v.id;
              const isMoving = v.location.speed > 0;

              let markerBg = 'bg-emerald-600 border-emerald-300';
              if (v.status === 'Maintenance') markerBg = 'bg-amber-600 border-amber-300';
              if (v.status === 'Out of Service') markerBg = 'bg-rose-600 border-rose-300';
              if (v.status === 'Reserved') markerBg = 'bg-slate-600 border-slate-300';

              return (
                <div
                  key={v.id}
                  onClick={() => {
                    setActiveVehicle(v);
                    setSelectedVehicleId(v.id);
                  }}
                  style={{ left: `${x}%`, top: `${y}%` }}
                  className="absolute -translate-x-1/2 -translate-y-1/2 cursor-pointer z-20 group transition-all duration-700 ease-out"
                >
                  {/* Moving wave pulse animation */}
                  {isMoving && (
                    <span className="absolute -inset-2 rounded-full bg-emerald-500/30 animate-ping pointer-events-none" />
                  )}

                  {/* Marker Pin */}
                  <div
                    className={`relative p-1.5 rounded-full border-2 text-white shadow-xl transition-transform ${markerBg} ${
                      isSelected ? 'scale-125 ring-4 ring-blue-500/50' : 'hover:scale-110'
                    }`}
                  >
                    <Truck className="w-3.5 h-3.5" />
                  </div>

                  {/* License plate label */}
                  <div
                    className={`absolute left-1/2 -translate-x-1/2 mt-1 px-1.5 py-0.5 rounded text-[10px] font-mono whitespace-nowrap border shadow-md transition-opacity pointer-events-none ${
                      isSelected
                        ? 'bg-blue-600 text-white border-blue-400 font-bold z-30'
                        : 'bg-slate-900/90 text-slate-200 border-slate-700 group-hover:opacity-100 opacity-80'
                    }`}
                  >
                    {v.licensePlate.split('-')[0]}·{v.location.speed}kph
                  </div>
                </div>
              );
            })}
          </div>

          {/* Bottom Floating Telemetry Bar on Map */}
          {currentActiveVehicle && (
            <div className="p-3 bg-slate-900/95 border-t border-slate-800 backdrop-blur-md flex flex-wrap items-center justify-between gap-4 text-xs">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-blue-600 text-white flex items-center justify-center font-bold text-xs font-mono">
                  {currentActiveVehicle.licensePlate.split('-')[0]}
                </div>
                <div>
                  <div className="font-bold text-white flex items-center gap-2">
                    <span>{currentActiveVehicle.make} {currentActiveVehicle.model}</span>
                    <span className="font-mono text-slate-400 text-[11px]">({currentActiveVehicle.licensePlate})</span>
                  </div>
                  <div className="text-[11px] text-slate-400 truncate max-w-md">
                    Location: <strong className="text-slate-200">{currentActiveVehicle.location.address}</strong>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-4 text-slate-300 font-mono tabular-nums">
                <div className="flex items-center gap-1.5">
                  <Gauge className="w-3.5 h-3.5 text-blue-400" />
                  <span className="font-bold text-white">{currentActiveVehicle.location.speed} km/h</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Compass className="w-3.5 h-3.5 text-amber-400" />
                  <span>{currentActiveVehicle.location.heading}° Head</span>
                </div>
                <div className="flex items-center gap-1.5">
                  {currentActiveVehicle.fuelType === 'Electric' ? (
                    <Zap className="w-3.5 h-3.5 text-emerald-400" />
                  ) : (
                    <Fuel className="w-3.5 h-3.5 text-emerald-400" />
                  )}
                  <span>{currentActiveVehicle.fuelLevel}%</span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Telemetry Sidebar (1 col) */}
        <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col overflow-hidden">
          {/* Header */}
          <div className="p-4 border-b border-slate-200 dark:border-slate-800">
            <h3 className="font-bold text-xs text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-2">
              <Radio className="w-4 h-4 text-blue-600 animate-pulse" />
              Fleet Radar Transponders
            </h3>
            <p className="text-[11px] text-slate-500 mt-0.5">
              Select vehicle to inspect live telemetry
            </p>
          </div>

          {/* List of Vehicles */}
          <div className="flex-1 overflow-y-auto divide-y divide-slate-100 dark:divide-slate-800 p-2">
            {mapVehicles.map((v) => {
              const isSelected = currentActiveVehicle?.id === v.id;
              const isMoving = v.location.speed > 0;
              const driver = drivers.find((d) => d.id === v.assignedDriverId);

              return (
                <div
                  key={v.id}
                  onClick={() => {
                    setActiveVehicle(v);
                    setSelectedVehicleId(v.id);
                  }}
                  className={`p-2.5 rounded-lg cursor-pointer transition-colors ${
                    isSelected
                      ? 'bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-900'
                      : 'hover:bg-slate-50 dark:hover:bg-slate-800/40'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-xs font-mono text-slate-900 dark:text-white">
                      {v.licensePlate}
                    </span>
                    <span
                      className={`text-[10px] font-mono px-1.5 py-0.2 rounded font-semibold ${
                        isMoving
                          ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-400'
                          : 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400'
                      }`}
                    >
                      {v.location.speed} km/h
                    </span>
                  </div>

                  <div className="text-[11px] text-slate-600 dark:text-slate-300 mt-1 truncate">
                    {v.make} {v.model}
                  </div>

                  <div className="mt-1 flex items-center justify-between text-[10px] text-slate-400 font-mono">
                    <span>{driver ? driver.name : 'Unassigned'}</span>
                    <span>{v.fuelLevel}% {v.fuelType === 'Electric' ? 'EV' : 'Fuel'}</span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Selected Vehicle Card Details */}
          {currentActiveVehicle && (
            <div className="p-3 bg-slate-50 dark:bg-slate-950/40 border-t border-slate-200 dark:border-slate-800 text-xs space-y-1.5">
              <div className="font-semibold text-slate-800 dark:text-slate-200">
                Transponder Telemetry
              </div>
              <div className="flex justify-between font-mono text-[11px] text-slate-500">
                <span>Lat/Lng:</span>
                <span>{currentActiveVehicle.location.lat}, {currentActiveVehicle.location.lng}</span>
              </div>
              <div className="flex justify-between font-mono text-[11px] text-slate-500">
                <span>Odometer:</span>
                <span>{currentActiveVehicle.mileage.toLocaleString()} km</span>
              </div>
              <div className="flex justify-between text-[11px] text-slate-500">
                <span>Operator:</span>
                <span className="font-medium text-slate-800 dark:text-slate-200">{activeDriver?.name || 'None'}</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
