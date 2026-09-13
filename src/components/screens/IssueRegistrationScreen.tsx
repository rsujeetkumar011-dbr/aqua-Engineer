import React, { useState } from 'react';
import { Incident } from '../../types';

interface IssueRegistrationScreenProps {
  incidents: Incident[];
  selectedIncidentId: string;
  onSelectIncident: (id: string) => void;
  onOpenRegisterModal: () => void;
  onOpenBroadcastModal: () => void;
  onToggleIsolateIncident: (id: string) => void;
  onDispatchAssist: (incident: Incident) => void;
}

export const IssueRegistrationScreen: React.FC<IssueRegistrationScreenProps> = ({
  incidents,
  selectedIncidentId,
  onSelectIncident,
  onOpenRegisterModal,
  onOpenBroadcastModal,
  onToggleIsolateIncident,
  onDispatchAssist,
}) => {
  const [priorityFilter, setPriorityFilter] = useState<'all' | 'critical' | 'high' | 'medium-low'>('all');
  const [classificationFilter, setClassificationFilter] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [notifiedSms, setNotifiedSms] = useState<boolean>(false);
  const [newLogNote, setNewLogNote] = useState<string>('');
  const [localIncidents, setLocalIncidents] = useState<Incident[]>(incidents);

  // Sync prop changes
  React.useEffect(() => {
    setLocalIncidents(incidents);
  }, [incidents]);

  const activeIncident =
    localIncidents.find((i) => i.id === selectedIncidentId) || localIncidents[0] || incidents[0];

  // Filtering
  const filteredIncidents = localIncidents.filter((inc) => {
    // Priority filter
    if (priorityFilter === 'critical' && inc.priority !== 'critical') return false;
    if (priorityFilter === 'high' && inc.priority !== 'high') return false;
    if (priorityFilter === 'medium-low' && inc.priority !== 'medium' && inc.priority !== 'low' && inc.priority !== 'repaired') {
      return false;
    }

    // Classification filter
    if (classificationFilter !== 'all' && inc.classification !== classificationFilter) {
      return false;
    }

    // Search query
    if (searchTerm.trim()) {
      const q = searchTerm.toLowerCase();
      return (
        inc.ticketId.toLowerCase().includes(q) ||
        inc.title.toLowerCase().includes(q) ||
        inc.district.toLowerCase().includes(q) ||
        inc.locationName.toLowerCase().includes(q)
      );
    }

    return true;
  });

  const handleAppendLog = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newLogNote.trim() || !activeIncident) return;
    const updated = localIncidents.map((inc) => {
      if (inc.id === activeIncident.id) {
        return {
          ...inc,
          timeline: [
            ...inc.timeline,
            {
              id: `t-${Date.now()}`,
              time: new Date().toTimeString().slice(0, 8),
              title: 'Operator Field Note',
              description: newLogNote,
              type: 'alert' as const,
            },
          ],
        };
      }
      return inc;
    });
    setLocalIncidents(updated);
    setNewLogNote('');
  };

  const handleNotifyAccounts = () => {
    setNotifiedSms(true);
    setTimeout(() => {
      alert(
        `Hydraulic Notification Broadcast sent to ${
          activeIncident?.impactHouseholds || '1,420'
        } subscriber phones via Municipal Emergency Wire.`
      );
    }, 150);
  };

  return (
    <div className="flex flex-col w-full gap-space-lg">
      {/* Top Header & Triage Ribbon */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-space-md bg-surface-container-lowest p-space-lg rounded-lg shadow-sm border border-outline-variant/20">
        <div>
          <div className="flex items-center gap-space-xs">
            <span className="material-symbols-outlined text-primary text-[20px]">
              notification_important
            </span>
            <span className="font-label-caps text-label-caps uppercase text-primary font-bold tracking-wider">
              SCADA Intake & Telemetry Triage
            </span>
          </div>
          <h1 className="font-headline-lg text-headline-lg text-on-surface font-bold tracking-tight">
            Incident & Rupture Intake Hub
          </h1>
          <p className="font-body-md text-body-md text-on-surface-variant max-w-2xl mt-0.5">
            Real-time municipal hydraulic telemetry, acoustic rupture triage, and field crew
            deployment dispatch.
          </p>
        </div>

        {/* Triage Header Actions */}
        <div className="flex items-center gap-space-sm flex-wrap">
          <button
            onClick={onOpenBroadcastModal}
            className="flex items-center gap-1.5 px-space-md py-2 bg-surface-container-low text-primary hover:bg-surface-container font-body-sm text-body-sm font-semibold rounded border border-outline-variant/30 transition-colors cursor-pointer"
          >
            <span className="material-symbols-outlined text-[18px]">cell_tower</span>
            <span>Broadcast Civil Advisory</span>
          </button>
          <button
            onClick={onOpenRegisterModal}
            className="flex items-center gap-1.5 px-space-lg py-2 bg-error text-on-error hover:bg-error/95 font-body-sm text-body-sm font-semibold rounded shadow-sm transition-all cursor-pointer"
          >
            <span className="material-symbols-outlined text-[18px]">add_alert</span>
            <span>Register New Incident</span>
          </button>
        </div>
      </div>

      {/* Overview Stat Ribbon */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-space-md">
        <div className="bg-surface-container-lowest p-space-md rounded-lg shadow-sm border border-outline-variant/20 flex items-center justify-between">
          <div>
            <span className="font-label-caps text-label-caps uppercase text-outline">
              Active Breaches
            </span>
            <div className="font-headline-lg text-headline-lg text-error font-bold tracking-tight">
              03
            </div>
            <p className="font-data-mono-sm text-data-mono-sm text-on-surface-variant">
              3 Pending Full Isolation
            </p>
          </div>
          <div className="w-12 h-12 rounded-lg bg-error-container/50 text-error flex items-center justify-center">
            <span className="material-symbols-outlined text-[24px]">crisis_alert</span>
          </div>
        </div>

        <div className="bg-surface-container-lowest p-space-md rounded-lg shadow-sm border border-outline-variant/20 flex items-center justify-between">
          <div>
            <span className="font-label-caps text-label-caps uppercase text-outline">
              Est. Loss Rate
            </span>
            <div className="font-headline-lg text-headline-lg text-primary font-bold tracking-tight">
              142.5 m³/h
            </div>
            <p className="font-data-mono-sm text-data-mono-sm text-on-surface-variant">
              Peak Volume Gradient
            </p>
          </div>
          <div className="w-12 h-12 rounded-lg bg-primary-fixed/50 text-primary flex items-center justify-center">
            <span className="material-symbols-outlined text-[24px]">water_drop</span>
          </div>
        </div>

        <div className="bg-surface-container-lowest p-space-md rounded-lg shadow-sm border border-outline-variant/20 flex items-center justify-between">
          <div>
            <span className="font-label-caps text-label-caps uppercase text-outline">
              SLA Criticality
            </span>
            <div className="font-headline-lg text-headline-lg text-tertiary font-bold tracking-tight">
              96.4%
            </div>
            <p className="font-data-mono-sm text-data-mono-sm text-on-surface-variant">
              Sub-2hr First Response Target
            </p>
          </div>
          <div className="w-12 h-12 rounded-lg bg-tertiary-fixed/50 text-tertiary flex items-center justify-center">
            <span className="material-symbols-outlined text-[24px]">timer</span>
          </div>
        </div>
      </div>

      {/* Main Filter & Work Area */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-space-lg items-start">
        {/* Left Col: Filter Bar & Incident Cards List (Col 7) */}
        <div className="xl:col-span-7 flex flex-col gap-space-md">
          {/* Filtering Controls */}
          <div className="bg-surface-container-lowest p-space-md rounded-lg shadow-sm border border-outline-variant/20 flex flex-col gap-space-sm">
            {/* Search Input & Priority Tabs */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-space-sm">
              <div className="relative flex-1">
                <span className="material-symbols-outlined absolute left-3 top-2 text-outline text-[18px]">
                  search
                </span>
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Filter by ticket #, street, or pipe ID..."
                  className="w-full bg-surface-container-low text-on-surface font-body-sm text-body-sm pl-9 pr-3 py-1.5 rounded border border-outline-variant/30 focus:outline-none focus:ring-1 focus:ring-primary"
                />
              </div>

              {/* Priority Chips */}
              <div className="inline-flex p-0.5 bg-surface-container rounded gap-1">
                {(
                  [
                    { id: 'all', label: `All (${localIncidents.length})` },
                    { id: 'critical', label: 'Critical (1)' },
                    { id: 'high', label: 'High (2)' },
                    { id: 'medium-low', label: 'Medium/Low (2)' },
                  ] as const
                ).map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setPriorityFilter(tab.id)}
                    className={`px-space-sm py-1 rounded font-body-sm text-body-sm transition-all cursor-pointer ${
                      priorityFilter === tab.id
                        ? 'bg-surface-container-lowest text-primary font-semibold shadow-sm'
                        : 'text-on-surface-variant hover:text-on-surface'
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Category Sub-Filters */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-label-caps">
              <span className="font-label-caps text-label-caps uppercase text-outline pr-1">
                Class:
              </span>
              {[
                'all',
                'Main Pipeline Burst',
                'Low Pressure Alert',
                'Contamination Risk',
                'Gate Valve Leak',
                'Citizen Intake',
              ].map((c) => (
                <button
                  key={c}
                  onClick={() => setClassificationFilter(c)}
                  className={`px-2 py-0.5 rounded transition-all cursor-pointer whitespace-nowrap ${
                    classificationFilter === c
                      ? 'bg-primary text-on-primary font-bold'
                      : 'bg-surface-container text-on-surface-variant hover:bg-surface-container-high'
                  }`}
                >
                  {c === 'all' ? 'All Classes' : c}
                </button>
              ))}
            </div>
          </div>

          {/* Incidents Cards List */}
          <div className="flex flex-col gap-space-md">
            {filteredIncidents.map((incident) => {
              const isSelected = activeIncident?.id === incident.id;
              const isCrit = incident.priority === 'critical';
              const isHigh = incident.priority === 'high';
              const isRepaired = incident.priority === 'repaired';

              return (
                <div
                  key={incident.id}
                  onClick={() => onSelectIncident(incident.id)}
                  className={`bg-surface-container-lowest rounded-lg p-space-md shadow-sm border transition-all cursor-pointer relative overflow-hidden ${
                    isSelected
                      ? 'ring-2 ring-primary border-transparent'
                      : isCrit
                        ? 'border-error/40 hover:border-error'
                        : 'border-outline-variant/20 hover:border-outline-variant/60'
                  }`}
                >
                  {/* Left priority accent indicator */}
                  <div
                    className={`absolute top-0 bottom-0 left-0 w-1 ${
                      isCrit
                        ? 'bg-error'
                        : isHigh
                          ? 'bg-secondary'
                          : isRepaired
                            ? 'bg-tertiary'
                            : 'bg-outline'
                    }`}
                  ></div>

                  {/* Card Header */}
                  <div className="flex items-start justify-between gap-space-sm pl-2">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-data-mono-sm text-data-mono-sm font-bold text-primary">
                          {incident.ticketId}
                        </span>
                        <span className="font-label-caps text-label-caps text-outline">
                          {incident.district} • {incident.locationName}
                        </span>
                        {incident.isIsolated && (
                          <span className="px-1.5 py-0.5 rounded bg-tertiary-fixed text-tertiary font-label-caps text-label-caps font-bold">
                            VALVE ISOLATED
                          </span>
                        )}
                      </div>
                      <h3 className="font-headline-sm text-headline-sm text-on-surface mt-0.5">
                        {incident.title}
                      </h3>
                    </div>

                    <div className="flex flex-col items-end gap-1">
                      <span
                        className={`font-label-caps text-label-caps px-2 py-0.5 rounded font-bold uppercase ${
                          isCrit
                            ? 'bg-error text-on-error'
                            : isHigh
                              ? 'bg-secondary-container text-on-secondary-container'
                              : isRepaired
                                ? 'bg-tertiary-fixed text-tertiary'
                                : 'bg-surface-container text-on-surface-variant'
                        }`}
                      >
                        {incident.statusLabel}
                      </span>
                      <span className="font-data-mono-sm text-[11px] text-outline">
                        {incident.statusBadge}
                      </span>
                    </div>
                  </div>

                  {/* Card Description */}
                  <p className="font-body-sm text-body-sm text-on-surface-variant my-space-sm pl-2">
                    {incident.description}
                  </p>

                  {/* Incident Metric Pills Grid */}
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 pl-2 pt-space-xs border-t border-surface-container">
                    <div className="bg-surface-container-low p-1.5 rounded">
                      <span className="font-label-caps text-[9px] uppercase text-outline block">
                        SLA Remaining
                      </span>
                      <span
                        className={`font-data-mono-sm text-data-mono-sm font-semibold ${
                          isCrit ? 'text-error animate-pulse' : 'text-on-surface'
                        }`}
                      >
                        {incident.slaTimeRemaining}
                      </span>
                    </div>

                    <div className="bg-surface-container-low p-1.5 rounded">
                      <span className="font-label-caps text-[9px] uppercase text-outline block">
                        Flow Deficit / Spike
                      </span>
                      <span className="font-data-mono-sm text-data-mono-sm font-semibold text-on-surface">
                        {incident.flowDeficitM3H > 0
                          ? `${incident.flowDeficitM3H.toFixed(1)} m³/h`
                          : 'Nominal Flow'}
                      </span>
                    </div>

                    <div className="bg-surface-container-low p-1.5 rounded">
                      <span className="font-label-caps text-[9px] uppercase text-outline block">
                        Assigned Unit / Status
                      </span>
                      <span className="font-data-mono-sm text-data-mono-sm font-semibold text-primary truncate block">
                        {incident.fieldCrew || incident.unitAssigned || 'Triage Assigned'}
                      </span>
                    </div>
                  </div>

                  {/* Card Bottom Actions */}
                  <div className="flex items-center justify-between pl-2 pt-space-sm mt-space-xs">
                    <span className="font-data-mono-sm text-[11px] text-outline">
                      Classification: {incident.classification}
                    </span>
                    <div className="flex items-center gap-space-xs">
                      {isCrit && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onToggleIsolateIncident(incident.id);
                          }}
                          className={`px-space-sm py-1 rounded font-label-caps text-label-caps uppercase font-bold cursor-pointer transition-colors ${
                            incident.isIsolated
                              ? 'bg-surface-container text-tertiary border border-tertiary/30'
                              : 'bg-error text-on-error hover:bg-error/90'
                          }`}
                        >
                          {incident.isIsolated ? 'Valves Locked' : 'Isolate Valves'}
                        </button>
                      )}
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onDispatchAssist(incident);
                        }}
                        className="px-space-sm py-1 rounded bg-surface-container text-primary hover:bg-surface-container-high font-label-caps text-label-caps uppercase font-bold cursor-pointer"
                      >
                        Dispatch Crew
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Sticky Inspector Column (Col 5) */}
        <div className="xl:col-span-5 sticky top-20 flex flex-col gap-space-md">
          {activeIncident ? (
            <div className="bg-surface-container-lowest rounded-lg shadow-sm border border-outline-variant/20 p-space-md flex flex-col gap-space-md">
              {/* Inspector Header */}
              <div className="flex items-start justify-between border-b border-surface-container pb-space-sm">
                <div>
                  <div className="flex items-center gap-space-xs">
                    <span className="material-symbols-outlined text-primary text-[20px]">
                      search_insights
                    </span>
                    <span className="font-label-caps text-label-caps uppercase text-primary font-bold">
                      Telemetry Inspector
                    </span>
                  </div>
                  <h3 className="font-headline-sm text-headline-sm text-on-surface">
                    {activeIncident.ticketId} • {activeIncident.district}
                  </h3>
                  <p className="font-data-mono-sm text-data-mono-sm text-outline">
                    GPS: {activeIncident.gpsCoords.lat.toFixed(4)}° N,{' '}
                    {Math.abs(activeIncident.gpsCoords.lng).toFixed(4)}° W • Elev. 42m
                  </p>
                </div>

                <span
                  className={`font-label-caps text-label-caps px-2 py-0.5 rounded font-bold uppercase ${
                    activeIncident.priority === 'critical'
                      ? 'bg-error text-on-error'
                      : 'bg-primary text-on-primary'
                  }`}
                >
                  {activeIncident.statusLabel}
                </span>
              </div>

              {/* Live Hydraulic Anomaly Snapshot */}
              <div>
                <span className="font-label-caps text-label-caps uppercase text-outline block mb-1">
                  Live Hydraulic Anomaly Snapshot
                </span>
                <div className="grid grid-cols-2 gap-space-sm">
                  <div className="bg-surface-container-low p-space-sm rounded">
                    <span className="font-label-caps text-[9px] text-outline block">
                      Pressure Loss
                    </span>
                    <span className="font-data-mono-md text-data-mono-md font-bold text-error">
                      {activeIncident.pressureDrop || '-2.1 bar'}
                    </span>
                    <span className="font-data-mono-sm text-[10px] text-outline block">
                      Nominal: 5.4 bar
                    </span>
                  </div>
                  <div className="bg-surface-container-low p-space-sm rounded">
                    <span className="font-label-caps text-[9px] text-outline block">
                      Discharge Loss
                    </span>
                    <span className="font-data-mono-md text-data-mono-md font-bold text-primary">
                      {activeIncident.flowDeficitM3H.toFixed(1)} m³/h
                    </span>
                    <span className="font-data-mono-sm text-[10px] text-outline block">
                      Peak Instantaneous
                    </span>
                  </div>
                </div>
              </div>

              {/* Geographic Rupture Localization (Mini GIS snippet) */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <span className="font-label-caps text-label-caps uppercase text-outline">
                    Geographic Rupture Localization
                  </span>
                  <span className="font-data-mono-sm text-[10px] text-primary">
                    TRUNK B4 • VALVE CLUSTER 04
                  </span>
                </div>
                <div className="relative w-full h-40 bg-[#0c1829] rounded overflow-hidden flex items-center justify-center border border-outline-variant/30">
                  {/* Grid background */}
                  <div className="absolute inset-0 bg-[radial-gradient(#1e3a5f_1px,transparent_1px)] [background-size:16px_16px] opacity-50"></div>
                  {/* Simulated pipeline vector */}
                  <svg className="absolute inset-0 w-full h-full" xmlns="http://www.w3.org/2000/svg">
                    <line x1="20" y1="80" x2="380" y2="80" stroke="#007bb9" strokeWidth="4" />
                    <line x1="200" y1="20" x2="200" y2="140" stroke="#006194" strokeWidth="3" />
                    {/* Rupture point */}
                    <circle cx="200" cy="80" r="8" fill="#ba1a1a" />
                    <circle cx="200" cy="80" r="16" fill="none" stroke="#ba1a1a" strokeWidth="1.5" className="animate-ping" />
                  </svg>
                  <div className="relative z-10 bg-surface-container-lowest/90 px-2 py-1 rounded text-center shadow">
                    <div className="font-data-mono-sm text-[11px] font-bold text-error">
                      BURST EPICENTER
                    </div>
                    <div className="font-label-caps text-[9px] text-outline">
                      {activeIncident.locationName}
                    </div>
                  </div>
                </div>
              </div>

              {/* Field Proof Photographic Attachment */}
              {activeIncident.photoUrl && (
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-label-caps text-label-caps uppercase text-outline">
                      Field Photographic Proof
                    </span>
                    <span className="font-data-mono-sm text-[10px] text-outline">
                      GEO-VERIFIED • CAMERA UNIT 12
                    </span>
                  </div>
                  <div className="relative rounded overflow-hidden border border-outline-variant/30">
                    <img
                      src={activeIncident.photoUrl}
                      alt="Incident Rupture Evidence"
                      className="w-full h-36 object-cover"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute bottom-0 inset-x-0 bg-inverse-surface/80 text-inverse-on-surface p-1.5 flex items-center justify-between text-[11px] font-data-mono-sm">
                      <span>Sheared 24" Main Coupler</span>
                      <span className="text-tertiary-fixed font-bold">14:14 UTC</span>
                    </div>
                  </div>
                </div>
              )}

              {/* Incident Lifecycle Audit Trail */}
              <div>
                <span className="font-label-caps text-label-caps uppercase text-outline block mb-2">
                  Chronological Incident Lifecycle
                </span>
                <div className="flex flex-col gap-2 relative pl-4 border-l-2 border-surface-container">
                  {activeIncident.timeline.map((item) => (
                    <div key={item.id} className="relative flex flex-col gap-0.5">
                      <div className="absolute -left-[21px] top-1 w-2.5 h-2.5 rounded-full bg-primary ring-2 ring-surface-container-lowest"></div>
                      <div className="flex items-center justify-between">
                        <span className="font-body-sm text-body-sm font-semibold text-on-surface">
                          {item.title}
                        </span>
                        <span className="font-data-mono-sm text-[10px] text-outline">
                          {item.time}
                        </span>
                      </div>
                      <p className="font-body-sm text-body-sm text-on-surface-variant">
                        {item.description}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Append Log Note Form */}
              <form onSubmit={handleAppendLog} className="flex gap-2">
                <input
                  type="text"
                  value={newLogNote}
                  onChange={(e) => setNewLogNote(e.target.value)}
                  placeholder="Append dispatch log note..."
                  className="flex-1 bg-surface-container-low text-on-surface font-body-sm text-body-sm px-3 py-1.5 rounded border border-outline-variant/30 focus:outline-none focus:ring-1 focus:ring-primary"
                />
                <button
                  type="submit"
                  className="px-3 py-1.5 bg-surface-container text-primary hover:bg-surface-container-high rounded font-label-caps text-label-caps font-bold cursor-pointer"
                >
                  Post
                </button>
              </form>

              {/* Operational Dispatch Commands */}
              <div className="flex flex-col gap-2 pt-2 border-t border-surface-container">
                <button
                  onClick={() => onToggleIsolateIncident(activeIncident.id)}
                  className={`w-full py-2.5 rounded font-body-sm text-body-sm font-semibold flex items-center justify-center gap-2 shadow-sm transition-all cursor-pointer ${
                    activeIncident.isIsolated
                      ? 'bg-tertiary text-on-tertiary'
                      : 'bg-error text-on-error hover:bg-error/95'
                  }`}
                >
                  <span className="material-symbols-outlined text-[18px]">
                    {activeIncident.isIsolated ? 'lock' : 'lock_open'}
                  </span>
                  <span>
                    {activeIncident.isIsolated
                      ? 'Isolated: V-401 & V-408 Closed'
                      : 'Trigger Remote Isolation Valves (V-401 / V-408)'}
                  </span>
                </button>

                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={handleNotifyAccounts}
                    className="py-2 bg-surface-container-low text-primary hover:bg-surface-container rounded font-label-caps text-label-caps font-semibold flex items-center justify-center gap-1 cursor-pointer"
                  >
                    <span className="material-symbols-outlined text-[16px]">sms</span>
                    <span>
                      {notifiedSms
                        ? '1,420 Accounts Notified'
                        : `Notify (${activeIncident.impactHouseholds || 1420})`}
                    </span>
                  </button>

                  <button
                    onClick={() => onDispatchAssist(activeIncident)}
                    className="py-2 bg-primary text-on-primary hover:bg-primary-container rounded font-label-caps text-label-caps font-semibold flex items-center justify-center gap-1 cursor-pointer"
                  >
                    <span className="material-symbols-outlined text-[16px]">engineering</span>
                    <span>Dispatch Support</span>
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-surface-container-lowest rounded-lg p-space-lg text-center text-outline">
              Select an incident to view live telemetry inspector
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
