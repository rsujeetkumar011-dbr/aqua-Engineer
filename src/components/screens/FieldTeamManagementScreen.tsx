import React, { useState } from 'react';
import { FieldCrew, WorkOrder } from '../../types';

interface FieldTeamManagementScreenProps {
  crews: FieldCrew[];
  workOrders: WorkOrder[];
  onOpenDispatchModal: (workOrder?: WorkOrder) => void;
  onFastDeployCrew: (crewId: string) => void;
  onOpenNewWorkOrderModal: () => void;
}

export const FieldTeamManagementScreen: React.FC<FieldTeamManagementScreenProps> = ({
  crews,
  workOrders,
  onOpenDispatchModal,
  onFastDeployCrew,
  onOpenNewWorkOrderModal,
}) => {
  const [viewMode, setViewMode] = useState<'board' | 'map'>('board');
  const [activeRadioCrew, setActiveRadioCrew] = useState<FieldCrew | null>(null);
  const [radioTalking, setRadioTalking] = useState<boolean>(false);

  const emergencyOrders = workOrders.filter((w) => w.type === 'emergency');
  const scheduledOrders = workOrders.filter((w) => w.type === 'preventive');

  return (
    <div className="flex flex-col w-full gap-space-lg">
      {/* Header & Controls */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-space-md bg-surface-container-lowest p-space-lg rounded-lg shadow-sm border border-outline-variant/20">
        <div>
          <div className="flex items-center gap-space-xs">
            <span className="material-symbols-outlined text-primary text-[20px]">group_work</span>
            <span className="font-label-caps text-label-caps uppercase text-primary font-bold tracking-wider">
              Field Operations & Hydraulics
            </span>
          </div>
          <h1 className="font-headline-lg text-headline-lg text-on-surface font-bold tracking-tight">
            Crew Dispatch & Hydraulic Work Orders
          </h1>
          <p className="font-body-md text-body-md text-on-surface-variant max-w-2xl mt-0.5">
            Supervisory telemetry for rapid leak response, valve exercising, and heavy repair logistics.
          </p>
        </div>

        {/* Action Controls & View Switcher */}
        <div className="flex items-center gap-space-sm flex-wrap">
          {/* View Switcher */}
          <div className="inline-flex p-1 bg-surface-container rounded-lg border border-outline-variant/30">
            <button
              onClick={() => setViewMode('board')}
              className={`flex items-center gap-1.5 px-space-md py-1.5 rounded font-body-sm text-body-sm transition-all cursor-pointer ${
                viewMode === 'board'
                  ? 'bg-surface-container-lowest text-primary font-semibold shadow-sm'
                  : 'text-on-surface-variant hover:text-on-surface'
              }`}
            >
              <span className="material-symbols-outlined text-[18px]">view_kanban</span>
              <span>Dispatch Board</span>
            </button>

            <button
              onClick={() => setViewMode('map')}
              className={`flex items-center gap-1.5 px-space-md py-1.5 rounded font-body-sm text-body-sm transition-all cursor-pointer ${
                viewMode === 'map'
                  ? 'bg-surface-container-lowest text-primary font-semibold shadow-sm'
                  : 'text-on-surface-variant hover:text-on-surface'
              }`}
            >
              <span className="material-symbols-outlined text-[18px]">map</span>
              <span>Live GPS Crew Map</span>
            </button>
          </div>

          <button
            onClick={onOpenNewWorkOrderModal}
            className="flex items-center gap-1.5 px-space-lg py-2 bg-primary text-on-primary hover:bg-primary-container font-body-sm text-body-sm font-semibold rounded shadow-sm transition-all cursor-pointer"
          >
            <span className="material-symbols-outlined text-[18px]">add_task</span>
            <span>+ Create Hydraulic Work Order</span>
          </button>
        </div>
      </div>

      {/* KPI Ribbon */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-space-md">
        <div className="bg-surface-container-lowest p-space-md rounded-lg shadow-sm border border-outline-variant/20 flex items-center justify-between">
          <div>
            <span className="font-label-caps text-label-caps uppercase text-outline">
              Active Deployment
            </span>
            <div className="font-headline-lg text-headline-lg text-primary font-bold">6/8 Units</div>
            <p className="font-data-mono-sm text-data-mono-sm text-on-surface-variant">
              2 Standby in Depot
            </p>
          </div>
          <div className="w-12 h-12 rounded-lg bg-primary-fixed/50 text-primary flex items-center justify-center">
            <span className="material-symbols-outlined text-[24px]">local_shipping</span>
          </div>
        </div>

        <div className="bg-surface-container-lowest p-space-md rounded-lg shadow-sm border border-outline-variant/20 flex items-center justify-between">
          <div>
            <span className="font-label-caps text-label-caps uppercase text-outline">
              Avg. Response Time
            </span>
            <div className="font-headline-lg text-headline-lg text-tertiary font-bold">
              26.4 mins
            </div>
            <p className="font-data-mono-sm text-data-mono-sm text-on-surface-variant">
              -4.2m vs Monthly Target
            </p>
          </div>
          <div className="w-12 h-12 rounded-lg bg-tertiary-fixed/50 text-tertiary flex items-center justify-center">
            <span className="material-symbols-outlined text-[24px]">timer</span>
          </div>
        </div>

        <div className="bg-surface-container-lowest p-space-md rounded-lg shadow-sm border border-outline-variant/20 flex items-center justify-between">
          <div>
            <span className="font-label-caps text-label-caps uppercase text-outline">
              Resolved Today
            </span>
            <div className="font-headline-lg text-headline-lg text-on-surface font-bold">
              18/24
            </div>
            <p className="font-data-mono-sm text-data-mono-sm text-on-surface-variant">
              6 In-Progress / Verification
            </p>
          </div>
          <div className="w-12 h-12 rounded-lg bg-surface-container-high text-on-surface flex items-center justify-center">
            <span className="material-symbols-outlined text-[24px]">task_alt</span>
          </div>
        </div>

        <div className="bg-surface-container-lowest p-space-md rounded-lg shadow-sm border border-outline-variant/20 flex items-center justify-between">
          <div>
            <span className="font-label-caps text-label-caps uppercase text-outline">
              Critical Spares Alert
            </span>
            <div className="font-headline-lg text-headline-lg text-error font-bold">
              4 Heavy Sleeves
            </div>
            <p className="font-data-mono-sm text-data-mono-sm text-on-surface-variant">
              Low: 12" Repair Clamps
            </p>
          </div>
          <div className="w-12 h-12 rounded-lg bg-error-container/50 text-error flex items-center justify-center">
            <span className="material-symbols-outlined text-[24px]">inventory_2</span>
          </div>
        </div>
      </div>

      {/* Active Crews Roster Strip */}
      <div className="bg-surface-container-lowest p-space-md rounded-lg shadow-sm border border-outline-variant/20 flex flex-col gap-space-md">
        <div className="flex items-center justify-between border-b border-surface-container pb-space-xs">
          <div className="flex items-center gap-space-xs">
            <span className="material-symbols-outlined text-primary text-[20px]">badge</span>
            <h2 className="font-headline-sm text-headline-sm text-on-surface">
              Active Field Crews Deployment Roster
            </h2>
          </div>
          <span className="font-data-mono-sm text-data-mono-sm text-outline">
            VHF DISPATCH NET: REPEATERS ACTIVE
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-space-md">
          {crews.map((crew) => {
            const isUrgent = crew.status === 'on-site';
            const isTransit = crew.status === 'in-transit';
            const isExecuting = crew.status === 'executing';
            const isStandby = crew.status === 'standby';

            return (
              <div
                key={crew.id}
                className={`bg-surface-container-low p-space-md rounded-lg border flex flex-col justify-between gap-space-sm ${
                  isUrgent
                    ? 'border-error/40 bg-error-container/10'
                    : isExecuting
                      ? 'border-secondary-container/40'
                      : isTransit
                        ? 'border-primary-fixed'
                        : 'border-outline-variant/30'
                }`}
              >
                {/* Header */}
                <div>
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="font-headline-sm text-headline-sm text-on-surface">
                        {crew.name}
                      </h3>
                      <p className="font-label-caps text-label-caps text-outline">
                        Lead: {crew.lead} ({crew.techniciansCount} Techs)
                      </p>
                    </div>
                    <span
                      className={`font-label-caps text-label-caps px-2 py-0.5 rounded font-bold uppercase ${
                        isUrgent
                          ? 'bg-error text-on-error animate-pulse'
                          : isTransit
                            ? 'bg-primary-fixed text-primary'
                            : isExecuting
                              ? 'bg-secondary-container text-on-secondary-container'
                              : 'bg-surface-container-highest text-on-surface-variant'
                      }`}
                    >
                      {crew.statusBadge}
                    </span>
                  </div>

                  <div className="mt-space-sm flex items-center justify-between font-data-mono-sm text-data-mono-sm bg-surface-container-lowest p-1.5 rounded">
                    <span className="text-on-surface font-semibold">{crew.vehicleUnit}</span>
                    <span className="text-outline">{crew.vehicleType}</span>
                  </div>

                  <p className="font-body-sm text-body-sm font-semibold text-on-surface mt-space-sm">
                    {crew.currentAssignment}
                  </p>
                  <p className="font-body-sm text-body-sm text-on-surface-variant line-clamp-2">
                    {crew.assignmentDetail}
                  </p>
                </div>

                {/* Footer Telemetry & Actions */}
                <div className="pt-space-xs border-t border-surface-container flex flex-col gap-2">
                  <div className="flex items-center justify-between font-data-mono-sm text-[11px] text-outline">
                    <span className="flex items-center gap-1">
                      <span className="material-symbols-outlined text-[14px] text-tertiary">
                        cell_tower
                      </span>
                      {crew.signalType} {crew.signalPercent}%
                    </span>
                    <span className="flex items-center gap-1">
                      <span className="material-symbols-outlined text-[14px]">battery_charging_full</span>
                      {crew.batteryPercent}%
                    </span>
                    <span className="font-bold text-on-surface">{crew.timeOnSiteOrEta}</span>
                  </div>

                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => setActiveRadioCrew(crew)}
                      className="flex-1 py-1 bg-surface-container text-primary hover:bg-surface-container-high rounded font-label-caps text-label-caps uppercase font-bold flex items-center justify-center gap-1 cursor-pointer"
                    >
                      <span className="material-symbols-outlined text-[14px]">headset_mic</span>
                      <span>PTT Radio</span>
                    </button>
                    {isStandby && (
                      <button
                        onClick={() => onFastDeployCrew(crew.id)}
                        className="py-1 px-2.5 bg-primary text-on-primary hover:bg-primary-container rounded font-label-caps text-label-caps uppercase font-bold cursor-pointer"
                      >
                        Fast Deploy
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Main Content Area: Switch between Dispatch Board & GPS Map */}
      {viewMode === 'board' ? (
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-space-lg items-start">
          {/* Emergency Triage Work Orders Grid (Col 7) */}
          <div className="xl:col-span-7 flex flex-col gap-space-md">
            <div className="bg-surface-container-lowest p-space-md rounded-lg shadow-sm border border-outline-variant/20 flex flex-col gap-space-md">
              <div className="flex items-center justify-between border-b border-surface-container pb-space-xs">
                <div className="flex items-center gap-space-xs">
                  <span className="material-symbols-outlined text-error text-[20px]">
                    crisis_alert
                  </span>
                  <h2 className="font-headline-sm text-headline-sm text-on-surface">
                    Priority Emergency Work Orders Queue
                  </h2>
                </div>
                <span className="font-label-caps text-label-caps bg-error-container text-on-error-container px-2 py-0.5 rounded font-bold">
                  2 UNASSIGNED / TRIAGE
                </span>
              </div>

              <div className="flex flex-col gap-space-md">
                {emergencyOrders.map((wo) => {
                  const isP1 = wo.priority === 'P1';
                  return (
                    <div
                      key={wo.id}
                      className={`p-space-md rounded-lg border flex flex-col gap-space-sm ${
                        isP1
                          ? 'border-error/30 bg-error-container/10'
                          : 'border-secondary-container/30 bg-surface-container-low'
                      }`}
                    >
                      <div className="flex items-start justify-between">
                        <div>
                          <div className="flex items-center gap-2">
                            <span
                              className={`font-label-caps text-label-caps font-bold px-2 py-0.5 rounded ${
                                isP1
                                  ? 'bg-error text-on-error animate-pulse'
                                  : 'bg-secondary-container text-on-secondary-container'
                              }`}
                            >
                              {wo.priorityLabel}
                            </span>
                            <span className="font-data-mono-sm text-data-mono-sm font-bold text-primary">
                              {wo.code}
                            </span>
                          </div>
                          <h3 className="font-headline-sm text-headline-sm text-on-surface mt-1">
                            {wo.title}
                          </h3>
                          <p className="font-data-mono-sm text-data-mono-sm text-outline mt-0.5">
                            {wo.gpsLocation}
                          </p>
                        </div>

                        <div className="text-right">
                          <span className="font-data-mono-sm text-data-mono-sm text-error font-semibold">
                            {wo.elapsedTime}
                          </span>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-space-sm bg-surface-container-lowest p-space-sm rounded font-body-sm text-body-sm border border-outline-variant/20">
                        <div>
                          <span className="font-label-caps text-[9px] uppercase text-outline block">
                            Estimated Deficit / Impact
                          </span>
                          <span className="font-data-mono-sm text-data-mono-sm font-bold text-error">
                            {wo.estLossOrSpike}
                          </span>
                        </div>
                        <div>
                          <span className="font-label-caps text-[9px] uppercase text-outline block">
                            Required Gear / Spares
                          </span>
                          <span className="font-body-sm text-body-sm text-on-surface font-medium">
                            {wo.requiredGear || wo.requiresNotes}
                          </span>
                        </div>
                      </div>

                      {wo.recommendedCrew && (
                        <div className="flex items-center justify-between text-body-sm bg-primary-fixed/20 p-space-xs rounded">
                          <span className="font-data-mono-sm text-data-mono-sm text-primary font-semibold">
                            Optimal Unit Match: {wo.recommendedCrew}
                          </span>
                          <span className="font-label-caps text-[10px] text-tertiary font-bold uppercase">
                            Fastest Travel
                          </span>
                        </div>
                      )}

                      <div className="flex items-center justify-between pt-space-xs">
                        <span className="font-data-mono-sm text-[11px] text-outline">
                          {wo.isolationValves || 'Isolation Required'}
                        </span>
                        <button
                          onClick={() => onOpenDispatchModal(wo)}
                          className="flex items-center gap-1.5 px-space-md py-1.5 bg-primary text-on-primary hover:bg-primary-container rounded font-body-sm text-body-sm font-semibold shadow-sm transition-all cursor-pointer"
                        >
                          <span className="material-symbols-outlined text-[16px]">send</span>
                          <span>Quick Dispatch</span>
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Scheduled Maintenance Queue (Col 5) */}
          <div className="xl:col-span-5 flex flex-col gap-space-md">
            <div className="bg-surface-container-lowest p-space-md rounded-lg shadow-sm border border-outline-variant/20 flex flex-col gap-space-md">
              <div className="flex items-center justify-between border-b border-surface-container pb-space-xs">
                <div className="flex items-center gap-space-xs">
                  <span className="material-symbols-outlined text-primary text-[20px]">
                    calendar_month
                  </span>
                  <h2 className="font-headline-sm text-headline-sm text-on-surface">
                    Scheduled Preventive Maintenance
                  </h2>
                </div>
                <span className="font-data-mono-sm text-data-mono-sm text-outline">
                  3 ACTIVE TODAY
                </span>
              </div>

              <div className="flex flex-col gap-space-sm">
                {scheduledOrders.map((so) => (
                  <div
                    key={so.id}
                    className="p-space-md rounded-lg bg-surface-container-low border border-outline-variant/20 flex flex-col gap-space-xs"
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <span className="font-data-mono-sm text-data-mono-sm font-bold text-primary">
                          {so.code}
                        </span>
                        <h4 className="font-body-md text-body-md font-bold text-on-surface mt-0.5">
                          {so.title}
                        </h4>
                      </div>
                      <span className="font-label-caps text-label-caps bg-surface-container-high text-on-surface-variant px-2 py-0.5 rounded font-semibold">
                        {so.statusLabel}
                      </span>
                    </div>

                    <p className="font-data-mono-sm text-data-mono-sm text-outline">
                      {so.gpsLocation}
                    </p>

                    {so.requiresNotes && (
                      <p className="font-body-sm text-body-sm text-on-surface-variant">
                        {so.requiresNotes}
                      </p>
                    )}

                    {so.progressPercent !== undefined && (
                      <div className="w-full bg-surface-container-highest h-1.5 rounded-full overflow-hidden mt-1">
                        <div
                          className="bg-primary h-full rounded-full"
                          style={{ width: `${so.progressPercent}%` }}
                        ></div>
                      </div>
                    )}

                    <div className="flex items-center justify-between pt-1 border-t border-surface-container mt-1">
                      <span className="font-data-mono-sm text-[11px] text-on-surface-variant font-medium">
                        {so.assignedCrew || 'Unassigned Technician'}
                      </span>
                      <button
                        onClick={() => onOpenDispatchModal(so)}
                        className="text-primary hover:underline font-label-caps text-label-caps uppercase font-bold cursor-pointer"
                      >
                        Modify Assignment →
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* Live GPS Crew Map View */
        <div className="bg-surface-container-lowest p-space-md rounded-lg shadow-sm border border-outline-variant/20 flex flex-col gap-space-md">
          <div className="flex items-center justify-between border-b border-surface-container pb-space-xs">
            <div className="flex items-center gap-space-xs">
              <span className="material-symbols-outlined text-primary text-[20px]">location_on</span>
              <h2 className="font-headline-sm text-headline-sm text-on-surface">
                District 4 Real-Time GPS Fleet Tracking
              </h2>
            </div>
            <div className="flex items-center gap-2 font-data-mono-sm text-data-mono-sm text-outline">
              <span className="w-2 h-2 rounded-full bg-tertiary animate-pulse"></span>
              <span>4 OF 4 UNITS STREAMING TELEMETRY</span>
            </div>
          </div>

          <div className="relative w-full h-[520px] bg-[#0a1526] rounded-lg overflow-hidden border border-outline-variant/30">
            {/* Dark GIS grid */}
            <div className="absolute inset-0 bg-[radial-gradient(#1e3a5f_1px,transparent_1px)] [background-size:20px_20px] opacity-40"></div>

            {/* City Map Roads Graphic */}
            <svg className="absolute inset-0 w-full h-full" xmlns="http://www.w3.org/2000/svg">
              <path d="M 50 260 L 950 260" stroke="#1c3352" strokeWidth="6" />
              <path d="M 480 40 L 480 480" stroke="#1c3352" strokeWidth="6" />
              <path d="M 120 80 L 820 440" stroke="#162c46" strokeWidth="4" />
              <path d="M 220 440 L 780 60" stroke="#162c46" strokeWidth="4" />
              {/* Route line for Team Beta en route */}
              <path
                d="M 680 120 L 520 220 L 480 260"
                stroke="#007bb9"
                strokeDasharray="4 4"
                strokeWidth="2"
              />
            </svg>

            {/* Team Alpha marker (On Site) */}
            <div className="absolute left-[320px] top-[300px] transform -translate-x-1/2 -translate-y-1/2 cursor-pointer z-10 group">
              <div className="bg-error text-on-error p-2 rounded-full shadow-xl flex items-center justify-center animate-bounce">
                <span className="material-symbols-outlined text-[20px]">local_shipping</span>
              </div>
              <div className="absolute left-1/2 -translate-x-1/2 top-full mt-1 bg-surface-container-lowest text-on-surface px-2 py-1 rounded shadow-lg whitespace-nowrap text-center">
                <p className="font-headline-sm text-[12px] font-bold text-error">Team Alpha (Truck #12)</p>
                <p className="font-label-caps text-[9px] text-outline">Elmwood Main Rupture</p>
              </div>
            </div>

            {/* Team Beta marker (In Transit) */}
            <div className="absolute left-[520px] top-[220px] transform -translate-x-1/2 -translate-y-1/2 cursor-pointer z-10 group">
              <div className="bg-primary text-on-primary p-2 rounded-full shadow-xl flex items-center justify-center">
                <span className="material-symbols-outlined text-[20px]">minor_crash</span>
              </div>
              <div className="absolute left-1/2 -translate-x-1/2 top-full mt-1 bg-surface-container-lowest text-on-surface px-2 py-1 rounded shadow-lg whitespace-nowrap text-center">
                <p className="font-headline-sm text-[12px] font-bold text-primary">Team Beta (Van #04)</p>
                <p className="font-label-caps text-[9px] text-outline">ETA 40m • Sector B Quality</p>
              </div>
            </div>

            {/* Team Delta marker */}
            <div className="absolute left-[640px] top-[340px] transform -translate-x-1/2 -translate-y-1/2 cursor-pointer z-10 group">
              <div className="bg-secondary-container text-on-secondary-container p-2 rounded-full shadow-xl flex items-center justify-center">
                <span className="material-symbols-outlined text-[20px]">construction</span>
              </div>
              <div className="absolute left-1/2 -translate-x-1/2 top-full mt-1 bg-surface-container-lowest text-on-surface px-2 py-1 rounded shadow-lg whitespace-nowrap text-center">
                <p className="font-headline-sm text-[12px] font-bold text-secondary">Team Delta (Rig #09)</p>
                <p className="font-label-caps text-[9px] text-outline">Sector 11 Pressure Zone</p>
              </div>
            </div>

            {/* Team Gamma marker (Depot) */}
            <div className="absolute left-[200px] top-[140px] transform -translate-x-1/2 -translate-y-1/2 cursor-pointer z-10 group">
              <div className="bg-tertiary-container text-on-tertiary-container p-2 rounded-full shadow-xl flex items-center justify-center">
                <span className="material-symbols-outlined text-[20px]">warehouse</span>
              </div>
              <div className="absolute left-1/2 -translate-x-1/2 top-full mt-1 bg-surface-container-lowest text-on-surface px-2 py-1 rounded shadow-lg whitespace-nowrap text-center">
                <p className="font-headline-sm text-[12px] font-bold text-tertiary">Team Gamma (Crane #02)</p>
                <p className="font-label-caps text-[9px] text-outline">North Hub Depot • Standby</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* PTT Radio Dialog */}
      {activeRadioCrew && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-on-surface/40 backdrop-blur-sm">
          <div className="bg-surface-container-lowest rounded-xl shadow-2xl w-full max-w-md overflow-hidden border border-outline-variant/30">
            <div className="bg-surface-container-low p-space-md flex items-center justify-between border-b border-surface-container">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-primary text-[22px]">cell_tower</span>
                <div>
                  <h3 className="font-headline-sm text-headline-sm text-on-surface">
                    VHF Radio Link • {activeRadioCrew.name}
                  </h3>
                  <p className="font-data-mono-sm text-data-mono-sm text-outline">
                    Frequency: 154.280 MHz (TAC-04)
                  </p>
                </div>
              </div>
              <button
                onClick={() => setActiveRadioCrew(null)}
                className="p-1 rounded text-outline hover:text-on-surface"
              >
                <span className="material-symbols-outlined text-[20px]">close</span>
              </button>
            </div>

            <div className="p-space-lg flex flex-col items-center gap-space-md text-center">
              <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                <span className="material-symbols-outlined text-[40px]">
                  {radioTalking ? 'record_voice_over' : 'mic'}
                </span>
              </div>

              <div>
                <p className="font-body-md text-body-md font-bold text-on-surface">
                  Channel Open: Foreman {activeRadioCrew.lead}
                </p>
                <p className="font-body-sm text-body-sm text-on-surface-variant">
                  {radioTalking
                    ? 'Transmitting voice carrier... release to listen'
                    : 'Press and hold button below to talk on dispatch net'}
                </p>
              </div>

              <button
                onMouseDown={() => setRadioTalking(true)}
                onMouseUp={() => setRadioTalking(false)}
                onTouchStart={() => setRadioTalking(true)}
                onTouchEnd={() => setRadioTalking(false)}
                className={`w-full py-4 rounded-xl font-headline-sm text-headline-sm font-bold uppercase transition-all shadow-md cursor-pointer ${
                  radioTalking
                    ? 'bg-error text-on-error scale-95'
                    : 'bg-primary text-on-primary hover:bg-primary-container'
                }`}
              >
                {radioTalking ? 'TRANSMITTING VOICE...' : 'HOLD TO TALK (PTT)'}
              </button>
            </div>

            <div className="bg-surface-container-low p-space-sm text-center border-t border-surface-container font-data-mono-sm text-data-mono-sm text-outline">
              Signal: {activeRadioCrew.signalPercent}% • Transceiver: Motorcraft P25
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
