import React, { useState } from 'react';

export const SystemSettingsScreen: React.FC = () => {
  const [pollingRate, setPollingRate] = useState('2s');
  const [pressureMin, setPressureMin] = useState(50);
  const [pressureMax, setPressureMax] = useState(65);
  const [autoIsolateThreshold, setAutoIsolateThreshold] = useState(15.0);
  const [autoSmsBroadcast, setAutoSmsBroadcast] = useState(true);
  const [acousticSensitivity, setAcousticSensitivity] = useState('High');
  const [savedToast, setSavedToast] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSavedToast(true);
    setTimeout(() => setSavedToast(false), 2500);
  };

  return (
    <div className="flex flex-col w-full gap-space-lg">
      <div className="bg-surface-container-lowest p-space-lg rounded-lg shadow-sm border border-outline-variant/20 flex items-center justify-between">
        <div>
          <div className="flex items-center gap-space-xs">
            <span className="material-symbols-outlined text-primary text-[20px]">settings</span>
            <span className="font-label-caps text-label-caps uppercase text-primary font-bold">
              System Governance
            </span>
          </div>
          <h1 className="font-headline-lg text-headline-lg text-on-surface font-bold">
            SCADA Telemetry & Grid Parameters
          </h1>
          <p className="font-body-md text-body-md text-on-surface-variant mt-0.5">
            Configure RTU sensor polling intervals, automated valve trip thresholds, and emergency alert routing.
          </p>
        </div>
      </div>

      {savedToast && (
        <div className="p-space-md rounded-lg bg-tertiary-fixed/30 border border-tertiary flex items-center gap-space-sm text-on-surface">
          <span className="material-symbols-outlined text-tertiary">check_circle</span>
          <span className="font-body-sm text-body-sm font-semibold">
            Telemetry parameters successfully flashed to District 4 SCADA Controller.
          </span>
        </div>
      )}

      <form onSubmit={handleSave} className="grid grid-cols-1 md:grid-cols-2 gap-space-lg">
        {/* Card 1: Sensor Polling */}
        <div className="bg-surface-container-lowest p-space-md rounded-lg shadow-sm border border-outline-variant/20 flex flex-col gap-space-md">
          <div className="border-b border-surface-container pb-space-xs">
            <h3 className="font-headline-sm text-headline-sm text-on-surface">
              RTU Sensor Polling & Latency
            </h3>
            <p className="font-data-mono-sm text-data-mono-sm text-outline">
              Telemetry frequency across 340 hydrostatic nodes
            </p>
          </div>

          <div className="flex flex-col gap-space-sm">
            <div>
              <label className="block font-label-caps text-label-caps uppercase text-outline mb-1">
                Telemetry Scan Interval
              </label>
              <select
                value={pollingRate}
                onChange={(e) => setPollingRate(e.target.value)}
                className="w-full bg-surface-container-low p-2 rounded text-body-sm text-on-surface border border-outline-variant/30"
              >
                <option value="1s">1 Second (Ultra-Dense Real-Time)</option>
                <option value="2s">2 Seconds (Nominal Operations)</option>
                <option value="5s">5 Seconds (Bandwidth Conservative)</option>
                <option value="10s">10 Seconds (Power-Save Mode)</option>
              </select>
            </div>

            <div>
              <label className="block font-label-caps text-label-caps uppercase text-outline mb-1">
                Acoustic Leak Sensor Sensitivity
              </label>
              <select
                value={acousticSensitivity}
                onChange={(e) => setAcousticSensitivity(e.target.value)}
                className="w-full bg-surface-container-low p-2 rounded text-body-sm text-on-surface border border-outline-variant/30"
              >
                <option value="Maximum">Maximum (Sub-surface micro-fractures)</option>
                <option value="High">High (Standard ductile pipe monitoring)</option>
                <option value="Moderate">Moderate (Reduced false-positive noise)</option>
              </select>
            </div>
          </div>
        </div>

        {/* Card 2: Pressure Alarms */}
        <div className="bg-surface-container-lowest p-space-md rounded-lg shadow-sm border border-outline-variant/20 flex flex-col gap-space-md">
          <div className="border-b border-surface-container pb-space-xs">
            <h3 className="font-headline-sm text-headline-sm text-on-surface">
              Nominal Hydraulic Bands
            </h3>
            <p className="font-data-mono-sm text-data-mono-sm text-outline">
              Nominal District 4 operating ranges
            </p>
          </div>

          <div className="grid grid-cols-2 gap-space-md">
            <div>
              <label className="block font-label-caps text-label-caps uppercase text-outline mb-1">
                Min Pressure Alarm (PSI)
              </label>
              <input
                type="number"
                value={pressureMin}
                onChange={(e) => setPressureMin(Number(e.target.value))}
                className="w-full bg-surface-container-low p-2 rounded font-data-mono-md text-data-mono-md text-on-surface border border-outline-variant/30"
              />
            </div>
            <div>
              <label className="block font-label-caps text-label-caps uppercase text-outline mb-1">
                Max Pressure Alarm (PSI)
              </label>
              <input
                type="number"
                value={pressureMax}
                onChange={(e) => setPressureMax(Number(e.target.value))}
                className="w-full bg-surface-container-low p-2 rounded font-data-mono-md text-data-mono-md text-on-surface border border-outline-variant/30"
              />
            </div>
          </div>

          <div>
            <label className="block font-label-caps text-label-caps uppercase text-outline mb-1">
              Catastrophic Burst Auto-Trip (PSI drop within 30s)
            </label>
            <input
              type="number"
              step="0.5"
              value={autoIsolateThreshold}
              onChange={(e) => setAutoIsolateThreshold(Number(e.target.value))}
              className="w-full bg-surface-container-low p-2 rounded font-data-mono-md text-data-mono-md text-error border border-outline-variant/30 font-bold"
            />
          </div>
        </div>

        {/* Card 3: Automated Dispatch Integration */}
        <div className="bg-surface-container-lowest p-space-md rounded-lg shadow-sm border border-outline-variant/20 flex flex-col gap-space-md md:col-span-2">
          <div className="border-b border-surface-container pb-space-xs">
            <h3 className="font-headline-sm text-headline-sm text-on-surface">
              Automated Alert Protocols
            </h3>
          </div>

          <div className="flex items-center justify-between p-space-sm bg-surface-container-low rounded">
            <div>
              <p className="font-body-sm text-body-sm font-semibold text-on-surface">
                Immediate Public Advisory Routing
              </p>
              <p className="font-body-sm text-body-sm text-outline">
                Auto-generate and queue public SMS notices when &gt;500 households face pressure deficit.
              </p>
            </div>
            <input
              type="checkbox"
              checked={autoSmsBroadcast}
              onChange={(e) => setAutoSmsBroadcast(e.target.checked)}
              className="w-5 h-5 rounded text-primary focus:ring-0 cursor-pointer"
            />
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              className="px-space-lg py-2.5 bg-primary text-on-primary hover:bg-primary-container rounded-lg font-body-sm text-body-sm font-semibold shadow-sm transition-all cursor-pointer"
            >
              Save Configuration Settings
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};
