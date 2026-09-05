import React, { useState } from 'react';
import {
  MapPin,
  Building,
  Navigation,
  CheckCircle2,
  Calendar,
  ExternalLink,
  Users,
  Compass
} from 'lucide-react';
import { School } from '../../types.js';

interface TerritoryMapViewProps {
  schools: School[];
  onSelectSchool: (schoolId: string) => void;
}

export const TerritoryMapView: React.FC<TerritoryMapViewProps> = ({ schools, onSelectSchool }) => {
  const [selectedArea, setSelectedArea] = useState<string>('Dharampeth');
  const [plannedRoute, setPlannedRoute] = useState<string[]>([]);

  // Group schools by area
  const areaGroups = schools.reduce((acc, s) => {
    acc[s.area] = acc[s.area] || [];
    acc[s.area].push(s);
    return acc;
  }, {} as Record<string, School[]>);

  const areas = Object.keys(areaGroups).sort((a, b) => areaGroups[b].length - areaGroups[a].length);

  const currentAreaSchools = areaGroups[selectedArea] || [];

  const toggleRouteSchool = (schoolId: string) => {
    if (plannedRoute.includes(schoolId)) {
      setPlannedRoute(plannedRoute.filter((id) => id !== schoolId));
    } else {
      setPlannedRoute([...plannedRoute, schoolId]);
    }
  };

  return (
    <div className="space-y-4 pb-12">
      {/* Header */}
      <div className="bg-white border border-gray-200 rounded-lg p-4 shadow-xs space-y-3">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2">
              <Compass className="w-4 h-4 text-indigo-700" />
              <span className="text-[10px] font-mono font-bold text-indigo-800 uppercase tracking-wider">
                Territory Geospatial Clusters
              </span>
            </div>
            <h2 className="text-xl font-bold text-gray-900 tracking-tight mt-0.5">
              Nagpur Field Visit Route Planner
            </h2>
            <p className="text-xs text-gray-500 mt-0.5">
              Schools clustered by commercial neighborhood to minimize TSM drive time between Dharampeth, Sadar, Ramdaspeth, and Civil Lines.
            </p>
          </div>

          <div className="bg-indigo-900 text-white rounded-lg px-3.5 py-2 flex items-center space-x-2.5 text-xs shadow-xs">
            <Navigation className="w-4 h-4 text-orange-400" />
            <div>
              <div className="text-indigo-200 text-[10px] uppercase font-bold">Today's Route Bucket</div>
              <div className="font-bold text-white">
                {plannedRoute.length} Schools Queued for Physical Visit
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Neighborhood Clusters Grid */}
        <div className="bg-white border border-gray-200 rounded-lg p-3.5 space-y-3 shadow-xs">
          <h3 className="text-xs font-mono font-bold uppercase text-gray-700 tracking-wider">
            Nagpur Locality Clusters ({areas.length})
          </h3>

          <div className="space-y-2 max-h-[500px] overflow-y-auto pr-1">
            {areas.map((area) => {
              const list = areaGroups[area];
              const isSelected = selectedArea === area;
              const p1Count = list.filter((s) => s.priority === 'P1').length;

              return (
                <div
                  key={area}
                  onClick={() => setSelectedArea(area)}
                  className={`p-2.5 rounded border cursor-pointer transition-all ${
                    isSelected
                      ? 'bg-indigo-50/60 border-indigo-600 shadow-xs'
                      : 'bg-white border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-1.5">
                      <MapPin className="w-3.5 h-3.5 text-indigo-700" />
                      <span className="text-xs font-bold text-gray-900">{area}</span>
                    </div>
                    <span className="text-[11px] font-mono font-bold text-gray-700 px-2 py-0.5 rounded bg-gray-100">
                      {list.length} schools
                    </span>
                  </div>

                  <div className="flex items-center space-x-2 text-[11px] text-gray-500 mt-1.5">
                    <span>{p1Count} P1 Schools</span>
                    <span>•</span>
                    <span>
                      {list.reduce((sum, s) => sum + s.studentStrength, 0).toLocaleString('en-IN')} Students
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Selected Cluster Schools & Visit Scheduler */}
        <div className="lg:col-span-2 bg-white border border-gray-200 rounded-lg p-3.5 space-y-3 shadow-xs">
          <div className="flex items-center justify-between pb-2.5 border-b border-gray-100">
            <div>
              <span className="text-[10px] font-mono uppercase text-indigo-700 font-bold">
                Neighborhood Focus
              </span>
              <h3 className="text-sm font-bold text-gray-900 mt-0.5">
                {selectedArea} Cluster ({currentAreaSchools.length} Institutions)
              </h3>
            </div>
          </div>

          <div className="space-y-2">
            {currentAreaSchools.map((s) => {
              const isQueued = plannedRoute.includes(s.id);

              return (
                <div
                  key={s.id}
                  className="bg-white border border-gray-200 rounded p-2.5 flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 hover:border-gray-300 transition-colors shadow-xs"
                >
                  <div>
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => onSelectSchool(s.id)}
                        className="text-xs font-bold text-gray-900 hover:text-indigo-700 text-left cursor-pointer"
                      >
                        {s.name}
                      </button>
                      <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-gray-100 text-gray-700 font-medium">
                        {s.priority}
                      </span>
                    </div>

                    <div className="text-[11px] text-gray-500 mt-0.5 flex items-center space-x-2">
                      <span>{s.board}</span>
                      <span>•</span>
                      <span>{s.studentStrength} students</span>
                      <span>•</span>
                      <span>PIN: {s.pincode}</span>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2 shrink-0 self-end sm:self-center">
                    <button
                      onClick={() => toggleRouteSchool(s.id)}
                      className={`px-2.5 py-1 rounded text-xs font-bold flex items-center space-x-1.5 transition-colors cursor-pointer ${
                        isQueued
                          ? 'bg-orange-600 text-white'
                          : 'bg-white hover:bg-gray-100 text-gray-700 border border-gray-300 shadow-xs'
                      }`}
                    >
                      <Navigation className="w-3 h-3" />
                      <span>{isQueued ? 'In Visit Route' : 'Add to Route'}</span>
                    </button>

                    <button
                      onClick={() => onSelectSchool(s.id)}
                      className="p-1 rounded bg-white hover:bg-gray-100 text-gray-700 border border-gray-300 shadow-xs cursor-pointer"
                      title="Open School 360"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                    </button>
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
