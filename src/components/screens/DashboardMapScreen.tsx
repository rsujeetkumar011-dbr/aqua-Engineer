import React, { useState, useEffect } from 'react';
import {
  GisNode,
  PressureZoneSummaryItem,
  ReservoirGauge,
  TelemetryLogItem,
  ScreenId,
} from '../../types';

interface DashboardMapScreenProps {
  nodes: GisNode[];
  pressureZones: PressureZoneSummaryItem[];
  reservoirs: ReservoirGauge[];
  telemetryLogs: TelemetryLogItem[];
  onOpenRegisterModal: () => void;
  onOpenBroadcastModal: () => void;
  onOpenActuationModal: (node: GisNode) => void;
  onIsolateValve: (zoneId: string) => void;
  onInspectZone: (zone: PressureZoneSummaryItem) => void;
  onNavigate: (screen: ScreenId) => void;
  onSelectIncident: (id: string) => void;
}

export const DashboardMapScreen: React.FC<DashboardMapScreenProps> = ({
  nodes,
  pressureZones,
  reservoirs,
  telemetryLogs,
  onOpenRegisterModal,
  onOpenBroadcastModal,
  onOpenActuationModal,
  onIsolateValve,
  onInspectZone,
  onNavigate,
  onSelectIncident,
}) => {
  const [activeLayer, setActiveLayer] = useState<
    'Pressure Gradient' | 'Chlorine Residual' | 'Flow Dynamic' | 'Pipe Age (Asset Risk)'
  >('Pressure Gradient');

  const [selectedNodeId, setSelectedNodeId] = useState<string>('NSA-4019');
  const [zoomLevel, setZoomLevel] = useState<number>(1);
  const [refreshCountdown, setRefreshCountdown] = useState<number>(2);
  const [isAutoRefresh, setIsAutoRefresh] = useState<boolean>(true);

  // Selected Node data
  const selectedNode = nodes.find((n) => n.id === selectedNodeId) || nodes[0];

  // Live countdown timer for SCADA scan
  useEffect(() => {
    if (!isAutoRefresh) return;
    const timer = setInterval(() => {
      setRefreshCountdown((prev) => (prev <= 1 ? 2 : prev - 1));
    }, 1000);
    return () => clearInterval(timer);
  }, [isAutoRefresh]);

  // CSV download generator for SCADA diagnostic log
  const handleDownloadCsv = () => {
    const csvContent =
      'data:text/csv;charset=utf-8,' +
      'Timestamp,SensorID,Severity,EventTitle,Details\n' +
      telemetryLogs
        .map(
          (log) =>
            `"${log.timestamp}","${log.sensorId}","${log.level}","${log.title}","${log.description.replace(/"/g, '""')}"`
        )
        .join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `SCADA_Diagnostic_Log_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="flex flex-col w-full gap-space-lg">
      {/* Operational Context Header Bar */}
      <div className="flex flex-wrap items-center justify-between gap-space-md bg-surface-container-lowest p-space-md rounded-lg shadow-sm border border-outline-variant/20">
        <div className="flex items-center gap-space-md">
          <div className="w-10 h-10 rounded-lg bg-primary-fixed flex items-center justify-center text-primary shadow-sm">
            <span className="material-symbols-outlined text-[24px]">water_drop</span>
          </div>
          <div>
            <div className="flex items-center gap-space-xs">
              <span className="font-label-caps text-label-caps uppercase text-primary font-semibold tracking-wider">
                Metropolitan Utility SCADA
              </span>
              <span className="inline-block w-1.5 h-1.5 rounded-full bg-tertiary"></span>
              <span className="font-data-mono-sm text-data-mono-sm text-on-surface-variant font-medium">
                Zone 04-HydroNet
              </span>
            </div>
            <div className="font-headline-lg text-headline-lg text-on-surface tracking-tight">
              Supervisory Water Grid Telemetry & GIS Map
            </div>
          </div>
        </div>

        {/* Quick Operations Command Bar */}
        <div className="flex flex-wrap items-center gap-space-sm">
          <button
            onClick={onOpenRegisterModal}
            className="inline-flex items-center gap-space-xs px-space-md py-1.5 rounded bg-error text-on-error hover:opacity-95 transition-opacity shadow-sm cursor-pointer"
            type="button"
          >
            <span className="material-symbols-outlined text-[18px]">e911_emergency</span>
            <span className="font-label-caps text-label-caps font-semibold uppercase tracking-wider">
              Log Main Burst
            </span>
          </button>

          <button
            onClick={onOpenBroadcastModal}
            className="inline-flex items-center gap-space-xs px-space-md py-1.5 rounded bg-primary text-on-primary hover:opacity-95 transition-opacity shadow-sm cursor-pointer"
            type="button"
          >
            <span className="material-symbols-outlined text-[18px]">cell_tower</span>
            <span className="font-label-caps text-label-caps font-semibold uppercase tracking-wider">
              Broadcast Advisory
            </span>
          </button>

          <button
            onClick={() => onOpenActuationModal(selectedNode)}
            className="inline-flex items-center gap-space-xs px-space-md py-1.5 rounded bg-surface-container-high text-on-surface hover:bg-surface-container-highest transition-colors cursor-pointer"
            type="button"
          >
            <span className="material-symbols-outlined text-[18px]">tune</span>
            <span className="font-label-caps text-label-caps font-semibold uppercase tracking-wider">
              Recalibrate Booster
            </span>
          </button>

          <button
            onClick={() => setIsAutoRefresh(!isAutoRefresh)}
            className="flex items-center gap-space-xs bg-surface-container-low px-space-sm py-1.5 rounded text-on-surface-variant hover:bg-surface-container transition-colors cursor-pointer"
            title="Click to toggle live SCADA polling"
          >
            <span
              className={`material-symbols-outlined text-[18px] text-tertiary ${
                isAutoRefresh ? 'animate-spin' : ''
              }`}
              style={{ animationDuration: '3s' }}
            >
              sync
            </span>
            <span className="font-data-mono-sm text-data-mono-sm">
              REFRESH: {isAutoRefresh ? `${refreshCountdown}s` : 'PAUSED'}
            </span>
          </button>
        </div>
      </div>

      {/* KPI / Metric Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-space-md">
        {/* 1. Distributed Vol. */}
        <div className="relative bg-surface-container-lowest p-space-md rounded-lg shadow-sm flex flex-col justify-between overflow-hidden border border-outline-variant/20">
          <div className="absolute top-0 left-0 right-0 h-1 bg-primary"></div>
          <div className="flex items-center justify-between pb-space-xs">
            <span className="font-label-caps text-label-caps uppercase text-outline">
              Distributed Vol. (24h)
            </span>
            <span className="material-symbols-outlined text-primary text-[20px]">waves</span>
          </div>
          <div className="my-space-xs">
            <div className="flex items-baseline gap-1">
              <span className="font-headline-xl text-headline-xl text-on-surface font-bold tracking-tight">
                28.4
              </span>
              <span className="font-data-mono-md text-data-mono-md text-on-surface-variant">
                ML/day
              </span>
            </div>
            <div className="flex items-center gap-space-xs mt-space-xs">
              <span className="inline-flex items-center text-tertiary font-data-mono-sm text-data-mono-sm font-semibold">
                <span className="material-symbols-outlined text-[14px]">trending_up</span> +3.2%
              </span>
              <span className="font-body-sm text-body-sm text-outline">vs 30d baseline</span>
            </div>
          </div>
          <div className="w-full bg-surface-container-low h-1.5 rounded-full overflow-hidden mt-space-xs">
            <div className="bg-primary h-full rounded-full" style={{ width: '82%' }}></div>
          </div>
        </div>

        {/* 2. Network Pressure */}
        <div className="relative bg-surface-container-lowest p-space-md rounded-lg shadow-sm flex flex-col justify-between overflow-hidden border border-outline-variant/20">
          <div className="absolute top-0 left-0 right-0 h-1 bg-secondary-container"></div>
          <div className="flex items-center justify-between pb-space-xs">
            <span className="font-label-caps text-label-caps uppercase text-outline">
              Network Pressure
            </span>
            <span className="material-symbols-outlined text-secondary text-[20px]">speed</span>
          </div>
          <div className="my-space-xs">
            <div className="flex items-baseline gap-1">
              <span className="font-headline-xl text-headline-xl text-on-surface font-bold tracking-tight">
                58.4
              </span>
              <span className="font-data-mono-md text-data-mono-md text-on-surface-variant">
                PSI
              </span>
            </div>
            <div className="flex items-center justify-between mt-space-xs">
              <span className="font-body-sm text-body-sm text-on-surface-variant">
                Target: 50-65 PSI
              </span>
              <span className="font-data-mono-sm text-data-mono-sm text-tertiary font-semibold bg-surface-container-low px-1.5 py-0.5 rounded">
                NOMINAL
              </span>
            </div>
          </div>
          {/* Sparkline */}
          <div className="h-6 w-full mt-1">
            <svg
              className="w-full h-full text-secondary"
              fill="none"
              preserveAspectRatio="none"
              viewBox="0 0 100 24"
            >
              <path
                d="M0 16 Q 15 10, 30 14 T 60 11 T 85 13 L 100 8"
                stroke="currentColor"
                strokeLinecap="round"
                strokeWidth="2"
                vectorEffect="non-scaling-stroke"
              ></path>
              <path
                d="M0 16 Q 15 10, 30 14 T 60 11 T 85 13 L 100 8 L 100 24 L 0 24 Z"
                fill="currentColor"
                fillOpacity="0.08"
              ></path>
            </svg>
          </div>
        </div>

        {/* 3. Purity Compliance */}
        <div className="relative bg-surface-container-lowest p-space-md rounded-lg shadow-sm flex flex-col justify-between overflow-hidden border border-outline-variant/20">
          <div className="absolute top-0 left-0 right-0 h-1 bg-tertiary"></div>
          <div className="flex items-center justify-between pb-space-xs">
            <span className="font-label-caps text-label-caps uppercase text-outline">
              Purity Compliance
            </span>
            <span className="material-symbols-outlined text-tertiary text-[20px]">verified</span>
          </div>
          <div className="my-space-xs">
            <div className="flex items-baseline gap-1">
              <span className="font-headline-xl text-headline-xl text-on-surface font-bold tracking-tight">
                99.2
              </span>
              <span className="font-data-mono-md text-data-mono-md text-on-surface-variant">%</span>
            </div>
            <div className="grid grid-cols-2 gap-1 mt-space-xs pt-1 border-t border-surface-container">
              <div className="font-data-mono-sm text-data-mono-sm text-on-surface-variant">
                pH <span className="text-on-surface font-semibold">7.42</span>
              </div>
              <div className="font-data-mono-sm text-data-mono-sm text-on-surface-variant">
                Turb <span className="text-on-surface font-semibold">0.42 NTU</span>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-space-xs font-label-caps text-label-caps text-tertiary font-semibold">
            <span className="w-1.5 h-1.5 rounded-full bg-tertiary"></span> POTABLE / GRADE A
          </div>
        </div>

        {/* 4. Active Work Orders */}
        <div className="relative bg-surface-container-lowest p-space-md rounded-lg shadow-sm flex flex-col justify-between overflow-hidden border border-outline-variant/20">
          <div className="absolute top-0 left-0 right-0 h-1 bg-primary-container"></div>
          <div className="flex items-center justify-between pb-space-xs">
            <span className="font-label-caps text-label-caps uppercase text-outline">
              Active Work Orders
            </span>
            <span className="material-symbols-outlined text-primary-container text-[20px]">
              engineering
            </span>
          </div>
          <div className="my-space-xs">
            <div className="flex items-baseline gap-1">
              <span className="font-headline-xl text-headline-xl text-on-surface font-bold tracking-tight">
                14
              </span>
              <span className="font-data-mono-md text-data-mono-md text-on-surface-variant">
                in progress
              </span>
            </div>
            <div className="flex items-center justify-between mt-space-xs">
              <span className="font-body-sm text-body-sm text-outline">3 Pending Dispatch</span>
              <span className="font-data-mono-sm text-data-mono-sm text-primary font-semibold bg-primary-fixed/40 px-1.5 py-0.5 rounded">
                6 CREWS
              </span>
            </div>
          </div>
          <div className="flex items-center justify-between text-outline font-label-caps text-label-caps">
            <span>SLA: 94.1% ON-TIME</span>
            <button
              onClick={() => onNavigate('field-teams')}
              className="text-primary font-semibold hover:underline cursor-pointer"
            >
              VIEW ALL →
            </button>
          </div>
        </div>

        {/* 5. Critical Alerts */}
        <div className="relative bg-surface-container-lowest p-space-md rounded-lg shadow-sm flex flex-col justify-between overflow-hidden border border-outline-variant/20">
          <div className="absolute top-0 left-0 right-0 h-1 bg-error"></div>
          <div className="flex items-center justify-between pb-space-xs">
            <span className="font-label-caps text-label-caps uppercase text-error font-semibold">
              Grid Alerts
            </span>
            <span className="material-symbols-outlined text-error text-[20px] animate-pulse">
              warning
            </span>
          </div>
          <div className="my-space-xs">
            <div className="flex items-baseline gap-1">
              <span className="font-headline-xl text-headline-xl text-error font-bold tracking-tight">
                3
              </span>
              <span className="font-data-mono-md text-data-mono-md text-error">System Active</span>
            </div>
            <div className="flex flex-col gap-0.5 mt-space-xs">
              <span className="font-body-sm text-body-sm text-on-surface font-medium flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-error"></span> 2 Transmission Leaks
              </span>
              <span className="font-body-sm text-body-sm text-outline flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-outline"></span> 1 Res. Telemetry Silent
              </span>
            </div>
          </div>
          <button
            onClick={() => onNavigate('issues')}
            className="bg-error-container/60 text-on-error-container hover:bg-error hover:text-on-error transition-colors px-space-xs py-0.5 rounded text-center font-label-caps text-label-caps font-semibold cursor-pointer"
          >
            PRIORITY 1 DISPATCH ENGAGED
          </button>
        </div>
      </div>

      {/* Primary Operations Section: Interactive Visual GIS Map & Inspector Split */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-space-lg items-start">
        {/* Left & Center: GIS Schematic Water Network Map Area (Col 8) */}
        <div className="xl:col-span-8 flex flex-col gap-space-md">
          {/* Map Container Card */}
          <div className="relative bg-surface-container-lowest rounded-lg shadow-sm overflow-hidden flex flex-col border border-outline-variant/20">
            {/* GIS Map Top Filter & Mode Strip */}
            <div className="flex flex-wrap items-center justify-between p-space-md bg-surface-container-low gap-space-sm border-b border-surface-container">
              <div className="flex items-center gap-space-sm flex-wrap">
                <span className="font-label-caps text-label-caps uppercase tracking-wider text-on-surface-variant font-semibold">
                  Active Layer:
                </span>
                <div className="inline-flex p-0.5 bg-surface-container rounded gap-1 text-on-surface">
                  {(
                    [
                      'Pressure Gradient',
                      'Chlorine Residual',
                      'Flow Dynamic',
                      'Pipe Age (Asset Risk)',
                    ] as const
                  ).map((layer) => (
                    <button
                      key={layer}
                      onClick={() => setActiveLayer(layer)}
                      className={`px-space-sm py-1 rounded font-body-sm text-body-sm transition-all cursor-pointer ${
                        activeLayer === layer
                          ? 'bg-surface-container-lowest text-primary font-semibold shadow-sm'
                          : 'text-on-surface-variant hover:text-on-surface'
                      }`}
                    >
                      {layer}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex items-center gap-space-xs font-data-mono-sm text-data-mono-sm text-on-surface-variant">
                <span className="material-symbols-outlined text-[16px] text-tertiary">near_me</span>
                <span>GRID: D4-HYDRAULIC-400</span>
              </div>
            </div>

            {/* Schematic Canvas & Interactive Graphic Overlay */}
            <div
              className="relative w-full h-[540px] bg-[#0c1829] overflow-hidden select-none transition-transform"
              style={{
                transform: `scale(${zoomLevel})`,
                transformOrigin: 'center center',
              }}
            >
              {/* Background Grid Overlay */}
              <div className="absolute inset-0 bg-[radial-gradient(#1e3a5f_1px,transparent_1px)] [background-size:24px_24px] opacity-40 pointer-events-none"></div>

              {/* District Boundary Decorative Shape */}
              <svg className="absolute inset-0 w-full h-full pointer-events-none" xmlns="http://www.w3.org/2000/svg">
                <defs>
                  <linearGradient id="pipeGlowNormal" x1="0%" x2="100%" y1="0%" y2="100%">
                    <stop offset="0%" stopColor="#007bb9" />
                    <stop offset="100%" stopColor="#57dffe" />
                  </linearGradient>
                  <linearGradient id="pipeGlowWarn" x1="0%" x2="100%" y1="0%" y2="100%">
                    <stop offset="0%" stopColor="#57dffe" />
                    <stop offset="100%" stopColor="#ea580c" />
                  </linearGradient>
                  <linearGradient id="pipeGlowCritical" x1="0%" x2="100%" y1="0%" y2="100%">
                    <stop offset="0%" stopColor="#ba1a1a" />
                    <stop offset="100%" stopColor="#ea580c" />
                  </linearGradient>
                </defs>

                {/* District Contour Lines */}
                <path
                  d="M40 80 Q 220 30, 480 70 T 880 120 L 860 480 Q 520 520, 200 460 Z"
                  fill="#006194"
                  fillOpacity="0.04"
                  stroke="#007bb9"
                  strokeDasharray="4 4"
                  strokeOpacity="0.15"
                  strokeWidth="1.5"
                />

                {/* Sub-Zone 4A Boundary */}
                <path
                  d="M 60 100 L 440 90 L 410 360 L 80 340 Z"
                  fill="#00687a"
                  fillOpacity="0.03"
                  stroke="#57dffe"
                  strokeOpacity="0.2"
                  strokeWidth="1"
                />
                <text
                  fill="#57dffe"
                  fillOpacity="0.5"
                  fontFamily="JetBrains Mono"
                  fontSize="10"
                  fontWeight="600"
                  x="75"
                  y="125"
                >
                  ZONE 4A: HIGHLANDS RESIDENTIAL
                </text>

                {/* Sub-Zone 4B Boundary */}
                <path
                  d="M 450 110 L 840 140 L 820 450 L 430 420 Z"
                  fill="#248279"
                  fillOpacity="0.03"
                  stroke="#80d5cb"
                  strokeOpacity="0.2"
                  strokeWidth="1"
                />
                <text
                  fill="#80d5cb"
                  fillOpacity="0.5"
                  fontFamily="JetBrains Mono"
                  fontSize="10"
                  fontWeight="600"
                  x="470"
                  y="150"
                >
                  ZONE 4B: CIVIC & METRO CORE
                </text>

                {/* Major Transmission Pipeline 1: Reservoir to Station Alpha */}
                <path
                  d="M 120 180 L 320 220"
                  opacity="0.4"
                  stroke={activeLayer === 'Chlorine Residual' ? '#006860' : '#007bb9'}
                  strokeLinecap="round"
                  strokeWidth="6"
                />
                <path
                  className="flow-active"
                  d="M 120 180 L 320 220"
                  stroke={activeLayer === 'Chlorine Residual' ? '#80d5cb' : '#57dffe'}
                  strokeWidth="2.5"
                />

                {/* Transmission Pipeline 2: Station Alpha to Sector 9 Booster */}
                <path
                  d="M 320 220 L 560 210"
                  opacity="0.4"
                  stroke={activeLayer === 'Pipe Age (Asset Risk)' ? '#ea580c' : '#007bb9'}
                  strokeLinecap="round"
                  strokeWidth="6"
                />
                <path
                  className="flow-active"
                  d="M 320 220 L 560 210"
                  stroke={activeLayer === 'Pipe Age (Asset Risk)' ? '#f59e0b' : '#57dffe'}
                  strokeWidth="2.5"
                />

                {/* Pipeline 3: Sector 9 Booster to Metro Water Tower */}
                <path
                  d="M 560 210 L 740 190"
                  opacity="0.3"
                  stroke="#ea580c"
                  strokeLinecap="round"
                  strokeWidth="5"
                />
                <path className="flow-slow" d="M 560 210 L 740 190" stroke="#ea580c" strokeWidth="2" />

                {/* Pipeline 4: Alpha to South Feeder (CRITICAL BURST LINE) */}
                <path
                  d="M 320 220 L 260 380 L 480 430"
                  opacity="0.3"
                  stroke="#ba1a1a"
                  strokeLinecap="round"
                  strokeWidth="5"
                />
                <path
                  d="M 320 220 L 260 380"
                  stroke="#ba1a1a"
                  strokeDasharray="3 3"
                  strokeWidth="2.5"
                />
                <path
                  d="M 260 380 L 480 430"
                  stroke="#ba1a1a"
                  strokeDasharray="3 3"
                  strokeWidth="2.5"
                />

                {/* Secondary Distribution Loops */}
                <path d="M 560 210 L 620 340 L 760 380" opacity="0.5" stroke="#006194" strokeWidth="3" />
                <path
                  className="flow-active"
                  d="M 560 210 L 620 340 L 760 380"
                  stroke="#93ccff"
                  strokeWidth="1.5"
                />

                <path d="M 320 220 L 460 310 L 620 340" opacity="0.5" stroke="#006194" strokeWidth="3" />
                <path
                  className="flow-active"
                  d="M 320 220 L 460 310 L 620 340"
                  stroke="#93ccff"
                  strokeWidth="1.5"
                />
              </svg>

              {/* Interactive Node 1: ClearLake Main Reservoir */}
              <div
                onClick={() => setSelectedNodeId('RES-01')}
                className="absolute left-[80px] top-[140px] transform -translate-x-1/2 -translate-y-1/2 cursor-pointer group z-10"
              >
                <div
                  className={`flex items-center gap-space-xs bg-surface-container-lowest/95 backdrop-blur-md px-space-md py-1.5 rounded-lg shadow-xl text-on-surface transition-all ${
                    selectedNodeId === 'RES-01' ? 'ring-2 ring-primary scale-105' : 'hover:scale-105'
                  }`}
                >
                  <span className="w-3 h-3 rounded-full bg-tertiary"></span>
                  <div>
                    <div className="font-data-mono-sm text-data-mono-sm font-semibold flex items-center gap-1">
                      <span>RES-01 ClearLake</span>
                      <span className="text-tertiary text-[10px] font-bold">84%</span>
                    </div>
                    <div className="font-label-caps text-label-caps text-outline">CAPACITY: 42.0 ML</div>
                  </div>
                </div>
                {/* Ping ring */}
                <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-4 h-4 rounded-full bg-tertiary/40 animate-ping pointer-events-none"></div>
              </div>

              {/* Interactive Node 2: North Station Alpha (SELECTED NODE) */}
              <div
                onClick={() => setSelectedNodeId('NSA-4019')}
                className="absolute left-[320px] top-[220px] transform -translate-x-1/2 -translate-y-1/2 cursor-pointer z-20"
              >
                <div
                  className={`relative flex items-center gap-space-xs bg-primary text-on-primary px-space-md py-2 rounded-lg shadow-xl ring-2 transition-all ${
                    selectedNodeId === 'NSA-4019'
                      ? 'ring-secondary-container scale-105'
                      : 'ring-transparent hover:scale-105'
                  }`}
                >
                  <span
                    className="material-symbols-outlined text-[20px] animate-spin"
                    style={{ animationDuration: '6s' }}
                  >
                    cyclone
                  </span>
                  <div>
                    <div className="font-data-mono-sm text-data-mono-sm font-bold tracking-tight">
                      North Station Alpha
                    </div>
                    <div className="font-label-caps text-label-caps text-primary-fixed uppercase">
                      Pump 1 & 2 Active • 62.4 PSI
                    </div>
                  </div>
                  <span className="material-symbols-outlined text-[16px] text-secondary-container">
                    check_circle
                  </span>
                </div>
                {/* Pulsing Pointer Target */}
                <div className="absolute left-1/2 top-full -translate-x-1/2 mt-1 w-2 h-2 rounded-full bg-secondary-container animate-ping"></div>
              </div>

              {/* Interactive Node 3: Pipe Burst Incident Node (Sector 7 Main) */}
              <div
                onClick={() => {
                  setSelectedNodeId('PIPE-S704');
                  onSelectIncident('inc-8921');
                }}
                className="absolute left-[260px] top-[380px] transform -translate-x-1/2 -translate-y-1/2 cursor-pointer group z-20"
              >
                <div
                  className={`flex items-center gap-space-xs bg-error text-on-error px-space-md py-1.5 rounded-lg shadow-2xl animate-bounce transition-all ${
                    selectedNodeId === 'PIPE-S704' ? 'ring-2 ring-white scale-105' : ''
                  }`}
                  style={{ animationDuration: '2.2s' }}
                >
                  <span className="material-symbols-outlined text-[18px]">warning</span>
                  <div>
                    <div className="font-data-mono-sm text-data-mono-sm font-bold">PIPE BURST S-704</div>
                    <div className="font-label-caps text-label-caps text-error-container uppercase">
                      Pressure: 18.2 PSI (-64%)
                    </div>
                  </div>
                </div>
                <div className="w-10 h-10 -ml-5 -mt-5 absolute top-1/2 left-1/2 rounded-full bg-error/30 animate-ping pointer-events-none"></div>
              </div>

              {/* Interactive Node 4: Sector 9 Booster Station */}
              <div
                onClick={() => setSelectedNodeId('BST-09')}
                className="absolute left-[560px] top-[210px] transform -translate-x-1/2 -translate-y-1/2 cursor-pointer z-10"
              >
                <div
                  className={`flex items-center gap-space-xs bg-surface-container-lowest/95 backdrop-blur-md px-space-sm py-1.5 rounded-lg shadow-lg text-on-surface transition-all ${
                    selectedNodeId === 'BST-09' ? 'ring-2 ring-secondary scale-105' : 'hover:scale-105'
                  }`}
                >
                  <span className="w-2.5 h-2.5 rounded-full bg-secondary-container"></span>
                  <div>
                    <div className="font-data-mono-sm text-data-mono-sm font-semibold">
                      Sector 9 Booster
                    </div>
                    <div className="font-label-caps text-label-caps text-secondary uppercase font-medium">
                      Head Press: 44.1 PSI
                    </div>
                  </div>
                </div>
              </div>

              {/* Interactive Node 5: Metro Chlorinated Tower 3 */}
              <div
                onClick={() => setSelectedNodeId('TWR-03')}
                className="absolute left-[740px] top-[190px] transform -translate-x-1/2 -translate-y-1/2 cursor-pointer z-10"
              >
                <div
                  className={`flex items-center gap-space-xs bg-surface-container-lowest/95 backdrop-blur-md px-space-sm py-1.5 rounded-lg shadow-lg text-on-surface transition-all ${
                    selectedNodeId === 'TWR-03' ? 'ring-2 ring-tertiary scale-105' : 'hover:scale-105'
                  }`}
                >
                  <span className="material-symbols-outlined text-[18px] text-tertiary">water_ph</span>
                  <div>
                    <div className="font-data-mono-sm text-data-mono-sm font-semibold">
                      Tower 3 (Elevated)
                    </div>
                    <div className="font-label-caps text-label-caps text-on-surface-variant uppercase">
                      Cl Residual: 1.8 mg/L
                    </div>
                  </div>
                </div>
              </div>

              {/* GIS Floating Control Tools */}
              <div className="absolute top-4 right-4 flex flex-col gap-1 bg-surface-container-lowest/90 backdrop-blur-md p-1 rounded-lg shadow-md border border-outline-variant/30">
                <button
                  onClick={() => setZoomLevel((z) => Math.min(1.4, z + 0.1))}
                  className="w-8 h-8 flex items-center justify-center text-on-surface hover:bg-surface-container rounded transition-colors cursor-pointer"
                  title="Zoom In"
                >
                  <span className="material-symbols-outlined text-[18px]">add</span>
                </button>
                <button
                  onClick={() => setZoomLevel((z) => Math.max(0.8, z - 0.1))}
                  className="w-8 h-8 flex items-center justify-center text-on-surface hover:bg-surface-container rounded transition-colors cursor-pointer"
                  title="Zoom Out"
                >
                  <span className="material-symbols-outlined text-[18px]">remove</span>
                </button>
                <div className="h-px bg-surface-container my-0.5"></div>
                <button
                  onClick={() => setZoomLevel(1)}
                  className="w-8 h-8 flex items-center justify-center text-primary hover:bg-surface-container rounded transition-colors cursor-pointer"
                  title="Center District View"
                >
                  <span className="material-symbols-outlined text-[18px]">filter_center_focus</span>
                </button>
                <button
                  onClick={() =>
                    setActiveLayer((prev) =>
                      prev === 'Pressure Gradient'
                        ? 'Chlorine Residual'
                        : prev === 'Chlorine Residual'
                          ? 'Flow Dynamic'
                          : prev === 'Flow Dynamic'
                            ? 'Pipe Age (Asset Risk)'
                            : 'Pressure Gradient'
                    )
                  }
                  className="w-8 h-8 flex items-center justify-center text-on-surface hover:bg-surface-container rounded transition-colors cursor-pointer"
                  title="Cycle GIS Layers"
                >
                  <span className="material-symbols-outlined text-[18px]">layers</span>
                </button>
              </div>

              {/* GIS Legend Floating Bar */}
              <div className="absolute bottom-4 left-4 bg-surface-container-lowest/95 backdrop-blur-md p-space-sm rounded-lg shadow-md flex items-center gap-space-md font-data-mono-sm text-data-mono-sm text-on-surface-variant border border-outline-variant/30">
                <div className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-tertiary"></span>
                  <span className="text-[10px] uppercase font-semibold">Normal (45-70 PSI)</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-secondary-container"></span>
                  <span className="text-[10px] uppercase font-semibold">Moderate / Warning</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-error"></span>
                  <span className="text-[10px] uppercase font-semibold">Critical Pipe Burst</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-4 h-1 bg-primary"></span>
                  <span className="text-[10px] uppercase font-semibold">16" Trunk Main</span>
                </div>
              </div>
            </div>

            {/* Selected Node Quick-Inspect Drawer (North Station Alpha) */}
            <div className="p-space-md bg-surface-container-low flex flex-col md:flex-row items-start md:items-center justify-between gap-space-md border-t border-surface-container">
              <div className="flex items-start gap-space-md">
                <div className="p-2 bg-primary/10 rounded text-primary shadow-sm">
                  <span className="material-symbols-outlined text-[24px]">power_input</span>
                </div>
                <div>
                  <div className="flex items-center gap-space-xs">
                    <span className="font-label-caps text-label-caps uppercase text-primary font-bold">
                      Selected Node Inspector
                    </span>
                    <span className="font-data-mono-sm text-data-mono-sm text-outline">
                      ID: {selectedNode.id}
                    </span>
                  </div>
                  <div className="font-headline-sm text-headline-sm text-on-surface">
                    {selectedNode.name}
                  </div>
                  <div className="font-body-sm text-body-sm text-on-surface-variant">
                    Coordinates: {selectedNode.coordinates} •{' '}
                    {selectedNode.metrics.connectionsServed
                      ? `Serving ${selectedNode.metrics.connectionsServed.toLocaleString()} connections`
                      : selectedNode.subTitle}
                  </div>
                </div>
              </div>

              {/* Key Node Metrics Strip */}
              <div className="grid grid-cols-3 gap-space-md bg-surface-container-lowest p-space-sm rounded-lg shadow-sm w-full md:w-auto border border-outline-variant/30">
                <div>
                  <div className="font-label-caps text-label-caps text-outline uppercase">
                    Discharge Flow
                  </div>
                  <div className="font-data-mono-md text-data-mono-md font-bold text-on-surface">
                    {selectedNode.metrics.dischargeFlow || 'Nominal'}
                  </div>
                </div>
                <div>
                  <div className="font-label-caps text-label-caps text-outline uppercase">
                    VFD Drive #1
                  </div>
                  <div className="font-data-mono-md text-data-mono-md font-bold text-tertiary">
                    {selectedNode.metrics.vfdDrive || '58.2 Hz (OK)'}
                  </div>
                </div>
                <div>
                  <div className="font-label-caps text-label-caps text-outline uppercase">Valve Pos</div>
                  <div className="font-data-mono-md text-data-mono-md font-bold text-primary">
                    {selectedNode.metrics.valvePos || '92% OPEN'}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-space-xs">
                <button
                  onClick={() => onOpenActuationModal(selectedNode)}
                  className="px-space-md py-1.5 bg-primary text-on-primary font-body-sm text-body-sm font-semibold rounded hover:opacity-95 shadow-sm transition-opacity cursor-pointer"
                >
                  Remote Actuation
                </button>
                <button
                  onClick={() => setSelectedNodeId('NSA-4019')}
                  className="px-space-sm py-1.5 bg-surface-container-lowest text-on-surface font-body-sm text-body-sm rounded hover:bg-surface-container shadow-sm border border-outline-variant/30 cursor-pointer"
                  title="Reset inspection selection"
                >
                  <span className="material-symbols-outlined text-[18px]">more_vert</span>
                </button>
              </div>
            </div>
          </div>

          {/* Infrastructure Diagnostics Tabular Strip */}
          <div className="bg-surface-container-lowest rounded-lg shadow-sm p-space-md border border-outline-variant/20">
            <div className="flex items-center justify-between pb-space-sm">
              <div className="flex items-center gap-space-xs">
                <span className="material-symbols-outlined text-primary text-[20px]">
                  monitor_heart
                </span>
                <span className="font-headline-sm text-headline-sm text-on-surface">
                  Pressure Zone Summary • District 4
                </span>
              </div>
              <span className="font-label-caps text-label-caps text-outline uppercase">
                Live SCADA Scan Cycle #9948
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left font-body-sm text-body-sm">
                <thead className="bg-surface-container-low text-on-surface-variant font-label-caps text-label-caps uppercase">
                  <tr>
                    <th className="p-2.5 rounded-l">Zone / Trunk Segment</th>
                    <th className="p-2.5">Flow Rate</th>
                    <th className="p-2.5">Inlet Press.</th>
                    <th className="p-2.5">Residual Press.</th>
                    <th className="p-2.5">Turbidity</th>
                    <th className="p-2.5">Status</th>
                    <th className="p-2.5 rounded-r text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-surface-container text-on-surface font-data-mono-sm text-data-mono-sm">
                  {pressureZones.map((pz) => {
                    const isRupture = pz.status === 'rupture';
                    return (
                      <tr
                        key={pz.id}
                        className={`transition-colors ${
                          isRupture
                            ? 'bg-error-container/20 hover:bg-error-container/30'
                            : 'hover:bg-surface-container-low/60'
                        }`}
                      >
                        <td
                          className={`p-2.5 font-body-sm text-body-sm font-semibold flex items-center gap-1.5 ${
                            isRupture ? 'text-error' : 'text-on-surface'
                          }`}
                        >
                          {isRupture && (
                            <span className="material-symbols-outlined text-[16px] text-error">
                              error
                            </span>
                          )}
                          <span>{pz.zone}</span>
                        </td>
                        <td className={`p-2.5 ${isRupture ? 'text-error font-bold' : ''}`}>
                          {pz.flowRate}
                        </td>
                        <td className="p-2.5">{pz.inletPressure}</td>
                        <td className={`p-2.5 ${isRupture ? 'text-error font-bold' : ''}`}>
                          {pz.residualPressure}
                        </td>
                        <td className="p-2.5">{pz.turbidity}</td>
                        <td className="p-2.5">
                          {isRupture ? (
                            <span className="inline-flex items-center gap-1 bg-error text-on-error px-2 py-0.5 rounded font-label-caps text-label-caps uppercase font-bold">
                              <span className="w-1.5 h-1.5 rounded-full bg-white animate-ping"></span>{' '}
                              RUPTURE LEAK
                            </span>
                          ) : pz.status === 'elevated' ? (
                            <span className="inline-flex items-center gap-1 bg-surface-container-low text-secondary px-2 py-0.5 rounded font-label-caps text-label-caps uppercase font-bold">
                              <span className="w-1.5 h-1.5 rounded-full bg-secondary"></span> ELEVATED DEMAND
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 bg-surface-container-low text-tertiary px-2 py-0.5 rounded font-label-caps text-label-caps uppercase font-bold">
                              <span className="w-1.5 h-1.5 rounded-full bg-tertiary"></span> OPTIMAL
                            </span>
                          )}
                        </td>
                        <td className="p-2.5 text-right">
                          {isRupture ? (
                            <button
                              onClick={() => onIsolateValve(pz.id)}
                              className="text-error hover:underline font-bold cursor-pointer"
                            >
                              {pz.isIsolated ? 'Valve Isolated' : 'Isolate Valve'}
                            </button>
                          ) : (
                            <button
                              onClick={() => onInspectZone(pz)}
                              className="text-primary hover:underline font-semibold cursor-pointer"
                            >
                              Inspect
                            </button>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Right Column: Operational Telemetry Feeds & Storage Capacity (Col 4) */}
        <div className="xl:col-span-4 flex flex-col gap-space-md">
          {/* Water Storage Tanks Capacity Gauges */}
          <div className="bg-surface-container-lowest rounded-lg shadow-sm p-space-md flex flex-col gap-space-md border border-outline-variant/20">
            <div className="flex items-center justify-between border-b border-surface-container pb-space-xs">
              <div className="flex items-center gap-space-xs">
                <span className="material-symbols-outlined text-primary text-[20px]">water_full</span>
                <span className="font-headline-sm text-headline-sm text-on-surface">
                  Reservoir Storage Levels
                </span>
              </div>
              <span className="font-label-caps text-label-caps text-tertiary font-semibold uppercase">
                Agg: 79%
              </span>
            </div>

            {/* Gauges */}
            {reservoirs.map((res, index) => {
              const barColor =
                index === 0 ? 'bg-primary' : index === 1 ? 'bg-secondary-container' : 'bg-tertiary';
              const textColor =
                index === 0 ? 'text-primary' : index === 1 ? 'text-secondary' : 'text-tertiary';
              return (
                <div key={res.id} className="flex flex-col gap-1.5">
                  <div className="flex items-center justify-between font-body-sm text-body-sm">
                    <div className="flex items-center gap-1 font-semibold text-on-surface">
                      <span>{res.name}</span>
                      <span className="font-data-mono-sm text-data-mono-sm text-outline font-normal">
                        ({res.capacityML} ML Cap)
                      </span>
                    </div>
                    <span className={`font-data-mono-md text-data-mono-md font-bold ${textColor}`}>
                      {res.percent}%
                    </span>
                  </div>
                  <div className="w-full bg-surface-container-low h-3 rounded-full overflow-hidden p-0.5 flex">
                    <div
                      className={`${barColor} h-full rounded-full transition-all duration-500`}
                      style={{ width: `${res.percent}%` }}
                    ></div>
                  </div>
                  <div className="flex justify-between font-label-caps text-label-caps text-outline">
                    <span>Current: {res.currentML} ML</span>
                    <span className={index === 2 ? 'text-tertiary font-semibold' : ''}>
                      {res.flowNote}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Real-Time Telemetry & Sensor Audit Feed */}
          <div className="bg-surface-container-lowest rounded-lg shadow-sm p-space-md flex flex-col gap-space-md border border-outline-variant/20">
            <div className="flex items-center justify-between border-b border-surface-container pb-space-xs">
              <div className="flex items-center gap-space-xs">
                <span className="material-symbols-outlined text-primary text-[20px]">sensors</span>
                <span className="font-headline-sm text-headline-sm text-on-surface">
                  Real-Time Telemetry Log
                </span>
              </div>
              <span className="flex items-center gap-1 font-label-caps text-label-caps text-tertiary">
                <span className="w-2 h-2 rounded-full bg-tertiary animate-pulse"></span>
                LIVE SCADA
              </span>
            </div>

            <div className="flex flex-col gap-space-sm max-h-[460px] overflow-y-auto pr-1">
              {telemetryLogs.map((log) => {
                const isCrit = log.level === 'critical';
                const isNormal = log.level === 'normal';
                const isNotice = log.level === 'notice';
                const borderColor = isCrit
                  ? 'border-error bg-error-container/40'
                  : isNormal
                    ? 'border-tertiary bg-surface-container-low'
                    : isNotice
                      ? 'border-secondary-container bg-surface-container-low'
                      : 'border-outline bg-surface-container-low';

                return (
                  <div
                    key={log.id}
                    className={`p-space-sm rounded text-on-surface flex flex-col gap-1 border-l-2 ${borderColor}`}
                  >
                    <div className="flex items-center justify-between">
                      <span
                        className={`font-data-mono-sm text-data-mono-sm font-bold flex items-center gap-1 ${
                          isCrit
                            ? 'text-error'
                            : isNormal
                              ? 'text-tertiary'
                              : isNotice
                                ? 'text-secondary'
                                : 'text-outline'
                        }`}
                      >
                        <span className="material-symbols-outlined text-[14px]">
                          {isCrit
                            ? 'warning'
                            : isNormal
                              ? 'check_circle'
                              : isNotice
                                ? 'info'
                                : 'signal_cellular_off'}
                        </span>{' '}
                        {log.sensorId}
                      </span>
                      <span className="font-data-mono-sm text-data-mono-sm text-outline">
                        {log.timestamp}
                      </span>
                    </div>

                    <div
                      className={`font-body-sm text-body-sm font-semibold ${
                        isCrit ? 'text-error' : 'text-on-surface'
                      }`}
                    >
                      {log.title}
                    </div>

                    <p className="font-body-sm text-body-sm text-on-surface-variant">
                      {log.description}
                    </p>

                    {log.actionRequired && (
                      <div className="mt-1 flex items-center gap-space-xs">
                        <button
                          onClick={() => onNavigate('field-teams')}
                          className="bg-error text-on-error px-2 py-0.5 rounded font-label-caps text-label-caps font-bold hover:bg-error/90 cursor-pointer"
                        >
                          DISPATCH CREW 4
                        </button>
                        <button
                          onClick={() => onIsolateValve('zone-4c')}
                          className="bg-surface-container-lowest text-on-surface px-2 py-0.5 rounded font-label-caps text-label-caps hover:bg-surface-container border border-outline-variant/30 cursor-pointer"
                        >
                          BYPASS SECTOR
                        </button>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            <button
              onClick={handleDownloadCsv}
              className="w-full py-2 bg-surface-container-low text-primary hover:bg-surface-container-high rounded text-center font-label-caps text-label-caps uppercase font-semibold transition-colors cursor-pointer"
              type="button"
            >
              Download Full SCADA Diagnostic Log (CSV)
            </button>
          </div>

          {/* Field Maintenance Crew Status Card */}
          <div className="bg-surface-container-lowest rounded-lg shadow-sm p-space-md flex flex-col gap-space-sm border border-outline-variant/20">
            <div className="flex items-center justify-between pb-space-xs border-b border-surface-container">
              <span className="font-headline-sm text-headline-sm text-on-surface">
                On-Duty Field Crews
              </span>
              <span className="font-data-mono-sm text-data-mono-sm text-primary font-bold">
                4 EN ROUTE / 2 STANDBY
              </span>
            </div>

            <div className="flex items-center justify-between p-space-xs bg-surface-container-low rounded">
              <div className="flex items-center gap-space-xs">
                <div className="w-8 h-8 rounded-full bg-error text-on-error flex items-center justify-center font-bold text-xs">
                  C4
                </div>
                <div>
                  <div className="font-body-sm text-body-sm font-semibold text-on-surface">
                    Crew 4 • Rapid Excavation
                  </div>
                  <div className="font-label-caps text-label-caps text-error">
                    DISPATCHED • ETA 6 MIN (SECTOR 7)
                  </div>
                </div>
              </div>
              <span className="material-symbols-outlined text-[18px] text-error animate-pulse">
                navigation
              </span>
            </div>

            <div className="flex items-center justify-between p-space-xs bg-surface-container-low rounded">
              <div className="flex items-center gap-space-xs">
                <div className="w-8 h-8 rounded-full bg-tertiary text-on-tertiary flex items-center justify-center font-bold text-xs">
                  C2
                </div>
                <div>
                  <div className="font-body-sm text-body-sm font-semibold text-on-surface">
                    Crew 2 • Water Quality Lab
                  </div>
                  <div className="font-label-caps text-label-caps text-tertiary">
                    ROUTINE SAMPLING • TOWER 3
                  </div>
                </div>
              </div>
              <span className="material-symbols-outlined text-[18px] text-tertiary">check_circle</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
