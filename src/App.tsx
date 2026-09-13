import React, { useState } from 'react';
import {
  ScreenId,
  GisNode,
  Incident,
  FieldCrew,
  WorkOrder,
  TelemetryLogItem,
  PressureZoneSummaryItem,
  ReservoirGauge,
} from './types';
import {
  INITIAL_GIS_NODES,
  INITIAL_PRESSURE_ZONES,
  INITIAL_RESERVOIRS,
  INITIAL_TELEMETRY_LOGS,
  INITIAL_INCIDENTS,
  INITIAL_CREWS,
  INITIAL_WORK_ORDERS,
} from './data/mockData';
import { Header } from './components/Header';
import { Sidebar } from './components/Sidebar';
import { DashboardMapScreen } from './components/screens/DashboardMapScreen';
import { IssueRegistrationScreen } from './components/screens/IssueRegistrationScreen';
import { FieldTeamManagementScreen } from './components/screens/FieldTeamManagementScreen';
import { MonthlyReportGeneratorScreen } from './components/screens/MonthlyReportGeneratorScreen';
import { SystemSettingsScreen } from './components/screens/SystemSettingsScreen';
import { EmergencyProtocolsScreen } from './components/screens/EmergencyProtocolsScreen';
import { AuditTrailScreen } from './components/screens/AuditTrailScreen';
import { RegisterIncidentDrawer } from './components/modals/RegisterIncidentDrawer';
import { DispatchModal } from './components/modals/DispatchModal';
import { ActuationModal } from './components/modals/ActuationModal';
import { BroadcastModal } from './components/modals/BroadcastModal';
import { CriticalAlertsDrawer } from './components/modals/CriticalAlertsDrawer';

export const App: React.FC = () => {
  // Navigation
  const [currentScreen, setCurrentScreen] = useState<ScreenId>('dashboard');
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState<boolean>(false);
  const [searchQuery, setSearchTerm] = useState<string>('');

  // Data state
  const [nodes, setNodes] = useState<GisNode[]>(INITIAL_GIS_NODES);
  const [pressureZones, setPressureZones] = useState<PressureZoneSummaryItem[]>(INITIAL_PRESSURE_ZONES);
  const [reservoirs] = useState<ReservoirGauge[]>(INITIAL_RESERVOIRS);
  const [telemetryLogs, setTelemetryLogs] = useState<TelemetryLogItem[]>(INITIAL_TELEMETRY_LOGS);
  const [incidents, setIncidents] = useState<Incident[]>(INITIAL_INCIDENTS);
  const [crews, setCrews] = useState<FieldCrew[]>(INITIAL_CREWS);
  const [workOrders, setWorkOrders] = useState<WorkOrder[]>(INITIAL_WORK_ORDERS);
  const [selectedIncidentId, setSelectedIncidentId] = useState<string>('inc-8921');

  // Modals state
  const [criticalAlertsOpen, setCriticalAlertsOpen] = useState<boolean>(false);
  const [registerModalOpen, setRegisterModalOpen] = useState<boolean>(false);
  const [broadcastModalOpen, setBroadcastModalOpen] = useState<boolean>(false);
  const [dispatchModalOpen, setDispatchModalOpen] = useState<boolean>(false);
  const [selectedWorkOrderForDispatch, setSelectedWorkOrderForDispatch] = useState<WorkOrder | null>(null);
  const [actuationModalOpen, setActuationModalOpen] = useState<boolean>(false);
  const [selectedNodeForActuation, setSelectedNodeForActuation] = useState<GisNode>(INITIAL_GIS_NODES[0]);

  // Toast notice
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Critical alerts count
  const criticalCount = incidents.filter((i) => i.priority === 'critical').length;

  // Handlers
  const handleOpenActuation = (node: GisNode) => {
    setSelectedNodeForActuation(node);
    setActuationModalOpen(true);
  };

  const handleApplyActuation = (nodeId: string, vfd: string, valvePos: string) => {
    setNodes((prev) =>
      prev.map((n) => (n.id === nodeId ? { ...n, metrics: { ...n.metrics, vfdDrive: vfd, valvePos } } : n))
    );
    // Add SCADA log
    const newLog: TelemetryLogItem = {
      id: `log-${Date.now()}`,
      sensorId: nodeId,
      timestamp: new Date().toTimeString().slice(0, 8),
      level: 'normal',
      title: `Telecommand Executed: ${vfd}, Valve ${valvePos}`,
      description: `Operator Marcus Vance adjusted actuator setpoints remotely via SCADA link.`,
    };
    setTelemetryLogs((prev) => [newLog, ...prev]);
    showToast(`Remote actuation successfully transmitted to ${nodeId}.`);
  };

  const handleIsolateZoneValve = (zoneId: string) => {
    setPressureZones((prev) =>
      prev.map((z) => {
        if (z.id === zoneId) {
          const nowIsolated = !z.isIsolated;
          return {
            ...z,
            isIsolated: nowIsolated,
            residualPressure: nowIsolated ? '0.0 PSI (ISOLATED)' : '18.2 PSI ↓',
            status: nowIsolated ? 'optimal' : 'rupture',
          };
        }
        return z;
      })
    );
    showToast(`Motorized isolation valves triggered for ${zoneId}. Flow locked.`);
  };

  const handleInspectZone = (zone: PressureZoneSummaryItem) => {
    showToast(`Diagnostic sweep initiated on ${zone.zone}. Sensor integrity: NOMINAL.`);
  };

  const handleToggleIsolateIncident = (id: string) => {
    setIncidents((prev) =>
      prev.map((inc) => {
        if (inc.id === id) {
          const toggled = !inc.isIsolated;
          return {
            ...inc,
            isIsolated: toggled,
            flowDeficitM3H: toggled ? 0.0 : 120.0,
            statusBadge: toggled ? 'Valves Locked' : 'Dispatched',
            timeline: [
              ...inc.timeline,
              {
                id: `t-${Date.now()}`,
                time: new Date().toTimeString().slice(0, 8),
                title: toggled ? 'Remote Isolation Valves Actuated' : 'Valves Re-opened',
                description: toggled
                  ? 'Butterfly valves V-401 & V-408 locked in closed position. Water loss arrested.'
                  : 'Valves unlocked for maintenance testing.',
                type: 'isolation',
              },
            ],
          };
        }
        return inc;
      })
    );
    showToast(`Isolation valves for ${id} have been updated.`);
  };

  const handleRegisterIncident = (newIncData: Partial<Incident>) => {
    const newId = `inc-${Date.now().toString().slice(-4)}`;
    const ticket = `#INC-${Math.floor(1000 + Math.random() * 9000)}`;
    const fullInc: Incident = {
      id: newId,
      ticketId: ticket,
      title: newIncData.title || 'Water Infrastructure Incident',
      description: newIncData.description || 'SCADA Anomaly reported.',
      district: newIncData.district || 'Dist 4',
      locationName: newIncData.locationName || 'Trunk Main',
      priority: newIncData.priority || 'critical',
      statusLabel: newIncData.statusLabel || 'Critical Rupture',
      statusBadge: 'Triage Stage',
      classification: newIncData.classification || 'Main Pipeline Burst',
      slaTimeRemaining: newIncData.slaTimeRemaining || '45m remaining',
      flowDeficitM3H: newIncData.flowDeficitM3H || 40.0,
      impactHouseholds: newIncData.impactHouseholds || 500,
      pressureDrop: newIncData.pressureDrop || '-2.5 bar',
      fieldCrew: 'Pending Crew Assignment',
      gpsCoords: newIncData.gpsCoords || { lat: 34.05, lng: -118.25 },
      photoUrl: newIncData.photoUrl,
      timeline: newIncData.timeline || [],
    };

    setIncidents([fullInc, ...incidents]);
    setSelectedIncidentId(fullInc.id);
    setCurrentScreen('issues');
    showToast(`Incident ${fullInc.ticketId} successfully registered and dispatched to triage queue.`);
  };

  const handleFastDeployCrew = (crewId: string) => {
    setCrews((prev) =>
      prev.map((c) =>
        c.id === crewId
          ? {
              ...c,
              status: 'in-transit',
              statusBadge: 'In Transit • Fast Deploy',
              timeOnSiteOrEta: 'ETA ~12m',
            }
          : c
      )
    );
    showToast(`Fast deploy telecommand transmitted to ${crewId}.`);
  };

  const handleConfirmDispatch = (
    workOrderId: string,
    crewName: string,
    vehicle: string,
    channel: string
  ) => {
    setWorkOrders((prev) =>
      prev.map((w) =>
        w.id === workOrderId
          ? {
              ...w,
              status: 'in-progress',
              statusLabel: 'En Route',
              assignedCrew: `${crewName} (${vehicle})`,
            }
          : w
      )
    );
    showToast(`Work Order ${workOrderId} dispatched to ${crewName} on radio net ${channel}.`);
  };

  const handleBroadcast = (title: string, recipients: string) => {
    showToast(`Civil Advisory "${title}" transmitted to ${recipients}.`);
  };

  return (
    <div className="min-h-screen bg-background text-on-surface flex flex-col antialiased">
      {/* Global Application Header */}
      <Header
        currentScreen={currentScreen}
        onNavigate={setCurrentScreen}
        onOpenCriticalAlerts={() => setCriticalAlertsOpen(true)}
        criticalCount={criticalCount}
        searchQuery={searchQuery}
        setSearchQuery={setSearchTerm}
        onToggleMobileMenu={() => setMobileSidebarOpen(!mobileSidebarOpen)}
      />

      {/* Main Framework Body */}
      <div className="flex flex-1 pt-16">
        {/* Navigation Sidebar */}
        <Sidebar
          currentScreen={currentScreen}
          onNavigate={setCurrentScreen}
          mobileOpen={mobileSidebarOpen}
          onCloseMobile={() => setMobileSidebarOpen(false)}
          criticalCount={criticalCount}
        />

        {/* Content View Container */}
        <main className="flex-1 md:pl-64 p-4 lg:p-6 max-w-[1600px] w-full mx-auto overflow-x-hidden transition-all">
          {/* Toast Notification Banner */}
          {toastMessage && (
            <div className="fixed bottom-6 right-6 z-50 bg-inverse-surface text-inverse-on-surface px-4 py-3 rounded-lg shadow-2xl flex items-center gap-3 border border-outline/30 animate-in slide-in-from-bottom duration-200">
              <span className="material-symbols-outlined text-secondary-container text-[22px]">
                notifications_active
              </span>
              <span className="font-body-sm text-body-sm font-medium">{toastMessage}</span>
              <button
                onClick={() => setToastMessage(null)}
                className="text-inverse-on-surface/60 hover:text-inverse-on-surface ml-2"
              >
                ✕
              </button>
            </div>
          )}

          {/* Screen Router */}
          {currentScreen === 'dashboard' && (
            <DashboardMapScreen
              nodes={nodes}
              pressureZones={pressureZones}
              reservoirs={reservoirs}
              telemetryLogs={telemetryLogs}
              onOpenRegisterModal={() => setRegisterModalOpen(true)}
              onOpenBroadcastModal={() => setBroadcastModalOpen(true)}
              onOpenActuationModal={handleOpenActuation}
              onIsolateValve={handleIsolateZoneValve}
              onInspectZone={handleInspectZone}
              onNavigate={setCurrentScreen}
              onSelectIncident={(id) => {
                setSelectedIncidentId(id);
                setCurrentScreen('issues');
              }}
            />
          )}

          {currentScreen === 'issues' && (
            <IssueRegistrationScreen
              incidents={incidents}
              selectedIncidentId={selectedIncidentId}
              onSelectIncident={setSelectedIncidentId}
              onOpenRegisterModal={() => setRegisterModalOpen(true)}
              onOpenBroadcastModal={() => setBroadcastModalOpen(true)}
              onToggleIsolateIncident={handleToggleIsolateIncident}
              onDispatchAssist={(incident) => {
                const matchedWO = workOrders.find((w) => w.id === 'wo-9042');
                setSelectedWorkOrderForDispatch(matchedWO || null);
                setDispatchModalOpen(true);
              }}
            />
          )}

          {currentScreen === 'field-teams' && (
            <FieldTeamManagementScreen
              crews={crews}
              workOrders={workOrders}
              onOpenDispatchModal={(wo) => {
                setSelectedWorkOrderForDispatch(wo || null);
                setDispatchModalOpen(true);
              }}
              onFastDeployCrew={handleFastDeployCrew}
              onOpenNewWorkOrderModal={() => setRegisterModalOpen(true)}
            />
          )}

          {currentScreen === 'reports' && <MonthlyReportGeneratorScreen />}

          {currentScreen === 'settings' && <SystemSettingsScreen />}

          {currentScreen === 'emergency-protocols' && <EmergencyProtocolsScreen />}

          {currentScreen === 'audit-trail' && <AuditTrailScreen />}
        </main>
      </div>

      {/* Global Modals & Drawers */}
      <RegisterIncidentDrawer
        isOpen={registerModalOpen}
        onClose={() => setRegisterModalOpen(false)}
        onSubmit={handleRegisterIncident}
      />

      <DispatchModal
        isOpen={dispatchModalOpen}
        onClose={() => setDispatchModalOpen(false)}
        workOrder={selectedWorkOrderForDispatch}
        onConfirm={handleConfirmDispatch}
      />

      <ActuationModal
        isOpen={actuationModalOpen}
        onClose={() => setActuationModalOpen(false)}
        node={selectedNodeForActuation}
        onApplyActuation={handleApplyActuation}
      />

      <BroadcastModal
        isOpen={broadcastModalOpen}
        onClose={() => setBroadcastModalOpen(false)}
        onBroadcast={handleBroadcast}
      />

      <CriticalAlertsDrawer
        isOpen={criticalAlertsOpen}
        onClose={() => setCriticalAlertsOpen(false)}
        onNavigate={setCurrentScreen}
        onFocusIncident={(id) => {
          setSelectedIncidentId(id);
          setCurrentScreen('issues');
        }}
      />
    </div>
  );
};

export default App;
