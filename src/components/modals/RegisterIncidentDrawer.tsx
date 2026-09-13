import React, { useState } from 'react';
import { Incident } from '../../types';

interface RegisterIncidentDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (incident: Partial<Incident>) => void;
  initialType?: string;
}

export const RegisterIncidentDrawer: React.FC<RegisterIncidentDrawerProps> = ({
  isOpen,
  onClose,
  onSubmit,
  initialType,
}) => {
  const [incidentType, setIncidentType] = useState(initialType || 'Main Pipeline Burst');
  const [priority, setPriority] = useState<'critical' | 'high' | 'medium' | 'low'>('critical');
  const [location, setLocation] = useState('Westview Boulevard & 11th Ave, District 3');
  const [lossRate, setLossRate] = useState(45.0);
  const [households, setHouseholds] = useState(850);
  const [sensorId, setSensorId] = useState('SCADA-D3-MN-098');
  const [instructions, setInstructions] = useState(
    'Acoustic leak sensor confirmed high amplitude vibration. Requesting immediate isolation of valve V-312 and backup chlorination sampling.'
  );
  const [attachedFileName, setAttachedFileName] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newIncident: Partial<Incident> = {
      title: `${incidentType} - ${location.split(',')[0]}`,
      description: instructions,
      district: location.includes('District') ? location.match(/District \d+/)?.[0] || 'Dist 4' : 'Dist 4',
      locationName: location,
      priority,
      statusLabel: priority === 'critical' ? 'Critical Rupture' : priority === 'high' ? 'High Priority' : 'Medium',
      statusBadge: 'Dispatched',
      classification: incidentType as any,
      slaTimeRemaining: priority === 'critical' ? '45m remaining' : '2h remaining',
      flowDeficitM3H: Number(lossRate),
      impactHouseholds: Number(households),
      pressureDrop: '-3.8 bar (to 1.4 bar)',
      fieldCrew: 'Pending Crew Assignment',
      isolationValves: 'Isolation Required',
      gpsCoords: { lat: 34.052, lng: -118.243 },
      photoUrl:
        'https://lh3.googleusercontent.com/aida-public/AB6AXuCfHAQGQA17BCvrmmY3gzpfo7qnbvbqC-on5cQjRISx36CYzpVLCCP11sEwxx35kqst8T8ilEW_IvwKuEoYEimDD9sK918n2m28BPZzGo19-KJbF3mSI3kHD2tYv1553HQSebO6FEvlDV45gDPXTL0W1zdD2jwOkeFgJEGk2lcQAuTStG41DQB2SuUNMOKo0qWGYZaAulGtRSoq6dnY-o41vs5trrPJCqodCKEEmHTAmG00wXtl9EsT-A',
      timeline: [
        {
          id: `t-${Date.now()}`,
          time: new Date().toTimeString().slice(0, 8),
          title: 'Manual Intake Registered',
          description: `Dispatched into SCADA queue with priority ${priority.toUpperCase()}.`,
          type: 'alert',
        },
      ],
    };

    onSubmit(newIncident);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-inverse-surface/40 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="w-full max-w-xl bg-surface-container-lowest h-full shadow-2xl overflow-y-auto p-space-lg flex flex-col justify-between animate-in slide-in-from-right duration-300">
        {/* Top Header */}
        <div className="flex flex-col gap-space-md">
          <div className="flex items-center justify-between pb-space-sm border-b border-outline-variant/20">
            <div className="flex items-center gap-space-sm">
              <div className="w-8 h-8 rounded bg-primary-container text-on-primary-container flex items-center justify-center shadow-sm">
                <span className="material-symbols-outlined text-[20px]">add_alert</span>
              </div>
              <div>
                <h3 className="font-headline-sm text-headline-sm text-on-surface">
                  Register Water Infrastructure Incident
                </h3>
                <p className="font-label-caps text-label-caps uppercase text-outline">
                  Direct Telemetry & Manual Intake Protocol
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="text-outline hover:text-on-surface p-1 rounded bg-surface-container-low transition-colors"
            >
              <span className="material-symbols-outlined text-[24px]">close</span>
            </button>
          </div>

          {/* Form */}
          <form id="incident-form" onSubmit={handleSubmit} className="flex flex-col gap-space-md">
            {/* Classification & Priority */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-space-md">
              <div>
                <label className="block font-label-caps text-label-caps uppercase text-outline mb-1">
                  Incident Type
                </label>
                <select
                  value={incidentType}
                  onChange={(e) => setIncidentType(e.target.value)}
                  className="w-full bg-surface-container-low text-on-surface font-body-sm text-body-sm px-3 py-2 rounded focus:outline-none focus:ring-1 focus:ring-primary border border-outline-variant/30"
                >
                  <option>Main Pipeline Burst</option>
                  <option>Low Pressure Anomaly</option>
                  <option>Water Quality / Turbidity Spike</option>
                  <option>Isolation Gate Valve Malfunction</option>
                  <option>Hydrant Rupture / Vehicle Impact</option>
                  <option>Bulk Meter Sensor Drift</option>
                </select>
              </div>

              <div>
                <label className="block font-label-caps text-label-caps uppercase text-outline mb-1">
                  Priority Matrix
                </label>
                <select
                  value={priority}
                  onChange={(e) => setPriority(e.target.value as any)}
                  className={`w-full bg-surface-container-low font-body-sm text-body-sm px-3 py-2 rounded focus:outline-none focus:ring-1 focus:ring-primary border border-outline-variant/30 font-semibold ${
                    priority === 'critical' ? 'text-error' : priority === 'high' ? 'text-primary' : 'text-on-surface'
                  }`}
                >
                  <option value="critical">Critical (Tier 1 - Sub-1hr SLA)</option>
                  <option value="high">High (Tier 2 - Sub-3hr SLA)</option>
                  <option value="medium">Medium (Tier 3 - Sub-8hr SLA)</option>
                  <option value="low">Low (Scheduled Maintenance)</option>
                </select>
              </div>
            </div>

            {/* Location */}
            <div>
              <label className="block font-label-caps text-label-caps uppercase text-outline mb-1">
                Location / Hydraulic District
              </label>
              <div className="relative">
                <span className="material-symbols-outlined absolute left-3 top-2.5 text-outline text-[18px]">
                  place
                </span>
                <input
                  type="text"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="w-full bg-surface-container-low text-on-surface font-body-sm text-body-sm pl-9 pr-3 py-2 rounded focus:outline-none focus:ring-1 focus:ring-primary border border-outline-variant/30"
                  placeholder="e.g. Elmwood Ave & 4th St, District 4, Grid 404"
                  required
                />
              </div>
            </div>

            {/* Loss Rate & Population */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-space-md">
              <div>
                <label className="block font-label-caps text-label-caps uppercase text-outline mb-1">
                  Est. Water Loss Rate (m³/hr)
                </label>
                <div className="relative">
                  <input
                    type="number"
                    step="0.1"
                    value={lossRate}
                    onChange={(e) => setLossRate(Number(e.target.value))}
                    className="w-full bg-surface-container-low text-on-surface font-data-mono-md text-data-mono-md px-3 py-2 rounded focus:outline-none focus:ring-1 focus:ring-primary border border-outline-variant/30"
                    required
                  />
                  <span className="absolute right-3 top-2 font-data-mono-sm text-data-mono-sm text-outline">
                    m³/hr
                  </span>
                </div>
              </div>

              <div>
                <label className="block font-label-caps text-label-caps uppercase text-outline mb-1">
                  Affected Households / Pop.
                </label>
                <div className="relative">
                  <input
                    type="number"
                    value={households}
                    onChange={(e) => setHouseholds(Number(e.target.value))}
                    className="w-full bg-surface-container-low text-on-surface font-data-mono-md text-data-mono-md px-3 py-2 rounded focus:outline-none focus:ring-1 focus:ring-primary border border-outline-variant/30"
                    required
                  />
                  <span className="absolute right-3 top-2 font-data-mono-sm text-data-mono-sm text-outline">
                    units
                  </span>
                </div>
              </div>
            </div>

            {/* SCADA Transducer ID */}
            <div>
              <label className="block font-label-caps text-label-caps uppercase text-outline mb-1">
                Correlated SCADA Transducer ID
              </label>
              <input
                type="text"
                value={sensorId}
                onChange={(e) => setSensorId(e.target.value)}
                className="w-full bg-surface-container-low text-on-surface font-data-mono-sm text-data-mono-sm px-3 py-2 rounded focus:outline-none focus:ring-1 focus:ring-primary border border-outline-variant/30"
                placeholder="e.g. TRNK-0914-PR, VLV-401-FL"
              />
            </div>

            {/* Dispatch Instructions */}
            <div>
              <label className="block font-label-caps text-label-caps uppercase text-outline mb-1">
                Initial Dispatch & Valve Instructions
              </label>
              <textarea
                rows={3}
                value={instructions}
                onChange={(e) => setInstructions(e.target.value)}
                className="w-full bg-surface-container-low text-on-surface font-body-sm text-body-sm p-3 rounded focus:outline-none focus:ring-1 focus:ring-primary border border-outline-variant/30"
                placeholder="Specify valve tag numbers to isolate, safe access perimeter, or traffic closure requirements..."
              />
            </div>

            {/* Upload Area */}
            <div>
              <label className="block font-label-caps text-label-caps uppercase text-outline mb-1">
                Sensor Log / Photographic Attachment
              </label>
              <label className="bg-surface-container-low p-space-md rounded flex flex-col items-center justify-center text-center cursor-pointer hover:bg-surface-container border border-dashed border-outline-variant/50 transition-colors">
                <input
                  type="file"
                  className="hidden"
                  onChange={(e) => {
                    if (e.target.files && e.target.files[0]) {
                      setAttachedFileName(e.target.files[0].name);
                    }
                  }}
                />
                <span className="material-symbols-outlined text-[32px] text-primary mb-1">
                  cloud_upload
                </span>
                <p className="font-body-sm text-body-sm font-semibold text-on-surface">
                  {attachedFileName ? attachedFileName : 'Drag and drop telemetry dump or photos'}
                </p>
                <p className="font-label-caps text-label-caps uppercase text-outline mt-0.5">
                  CSV, WAV Acoustic Logs, or JPG (up to 25MB)
                </p>
              </label>
            </div>
          </form>
        </div>

        {/* Drawer Action Buttons */}
        <div className="pt-space-lg flex items-center justify-end gap-space-sm border-t border-outline-variant/20 mt-4">
          <button
            type="button"
            onClick={onClose}
            className="px-space-md py-2 rounded text-on-surface-variant hover:bg-surface-container font-body-md text-body-md transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            form="incident-form"
            className="px-space-lg py-2 rounded bg-primary text-on-primary font-body-md text-body-md font-semibold hover:bg-primary-container shadow-sm flex items-center gap-1.5 transition-all cursor-pointer"
          >
            <span className="material-symbols-outlined text-[18px]">send</span>
            <span>Submit & Dispatch Protocol</span>
          </button>
        </div>
      </div>
    </div>
  );
};
