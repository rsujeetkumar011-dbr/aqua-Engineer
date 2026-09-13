import React, { useState } from 'react';

interface AuditEntry {
  id: string;
  timestamp: string;
  actor: string;
  action: string;
  targetNode: string;
  status: 'SUCCESS' | 'OVERRIDE' | 'REVERTED';
  shaHash: string;
}

const INITIAL_AUDIT_LOG: AuditEntry[] = [
  {
    id: 'AUD-9912',
    timestamp: 'Today, 14:14:02 UTC',
    actor: 'Marcus Vance (LEAD-ENG-0842)',
    action: 'Remote Valve Actuation - Sector 7 Isolation (V-401 closed 100%)',
    targetNode: 'VALVE-HUB-401',
    status: 'SUCCESS',
    shaHash: '8b7f102a...e991',
  },
  {
    id: 'AUD-9911',
    timestamp: 'Today, 14:12:30 UTC',
    actor: 'SCADA Auto-Dispatcher',
    action: 'Work Order WO-9042 Assigned to Team Alpha',
    targetNode: 'TRUCK-12-CREW',
    status: 'SUCCESS',
    shaHash: '4a1c90ff...b231',
  },
  {
    id: 'AUD-9910',
    timestamp: 'Today, 13:42:04 UTC',
    actor: 'System Sensor Watchdog',
    action: 'Pressure Gradient Tripped: 58.4 PSI -> 18.2 PSI (-68.8%)',
    targetNode: 'SCADA-TRNK-4481',
    status: 'OVERRIDE',
    shaHash: '19ef488a...90aa',
  },
  {
    id: 'AUD-9909',
    timestamp: 'Today, 13:38:55 UTC',
    actor: 'Operator J. Sterling (ENG-0312)',
    action: 'VFD Speed Recalibrated: North Station Alpha 54.8 Hz -> 58.2 Hz',
    targetNode: 'NSA-4019-VFD',
    status: 'SUCCESS',
    shaHash: '38da00bb...cc71',
  },
  {
    id: 'AUD-9908',
    timestamp: 'Today, 12:15:10 UTC',
    actor: 'Dr. Ronald Vance, PE',
    action: 'October 2024 Regulatory Compliance Dossier Electronically Certified',
    targetNode: 'DOC-2024-10-OCT',
    status: 'SUCCESS',
    shaHash: 'f4201889...994e',
  },
];

export const AuditTrailScreen: React.FC = () => {
  const [filter, setFilter] = useState<string>('all');

  const filteredLogs = INITIAL_AUDIT_LOG.filter((log) => {
    if (filter === 'override') return log.status === 'OVERRIDE';
    return true;
  });

  return (
    <div className="flex flex-col w-full gap-space-lg">
      <div className="bg-surface-container-lowest p-space-lg rounded-lg shadow-sm border border-outline-variant/20 flex flex-col sm:flex-row sm:items-center justify-between gap-space-md">
        <div>
          <div className="flex items-center gap-space-xs">
            <span className="material-symbols-outlined text-primary text-[20px]">
              history_toggle_off
            </span>
            <span className="font-label-caps text-label-caps uppercase text-primary font-bold">
              Cryptographic Audit Log
            </span>
          </div>
          <h1 className="font-headline-lg text-headline-lg text-on-surface font-bold">
            SCADA Immutable Action & Valve Actuation Trail
          </h1>
          <p className="font-body-md text-body-md text-on-surface-variant max-w-2xl mt-0.5">
            Tamper-evident record of all operator telecommands, automated valve isolations, and regulatory sign-offs.
          </p>
        </div>

        <div className="inline-flex p-1 bg-surface-container rounded-lg">
          <button
            onClick={() => setFilter('all')}
            className={`px-3 py-1.5 rounded font-body-sm text-body-sm transition-all cursor-pointer ${
              filter === 'all'
                ? 'bg-surface-container-lowest text-primary font-bold shadow-sm'
                : 'text-on-surface-variant'
            }`}
          >
            All Logs ({INITIAL_AUDIT_LOG.length})
          </button>
          <button
            onClick={() => setFilter('override')}
            className={`px-3 py-1.5 rounded font-body-sm text-body-sm transition-all cursor-pointer ${
              filter === 'override'
                ? 'bg-surface-container-lowest text-primary font-bold shadow-sm'
                : 'text-on-surface-variant'
            }`}
          >
            Safety Trips / Overrides
          </button>
        </div>
      </div>

      <div className="bg-surface-container-lowest p-space-md rounded-lg shadow-sm border border-outline-variant/20 flex flex-col gap-space-md">
        <div className="overflow-x-auto">
          <table className="w-full text-left font-body-sm text-body-sm">
            <thead className="bg-surface-container-low text-on-surface-variant font-label-caps text-label-caps uppercase">
              <tr>
                <th className="p-2.5 rounded-l">Log ID</th>
                <th className="p-2.5">Timestamp (UTC)</th>
                <th className="p-2.5">Operator / Subsystem</th>
                <th className="p-2.5">Action Executed</th>
                <th className="p-2.5">Target SCADA Node</th>
                <th className="p-2.5">Integrity Hash</th>
                <th className="p-2.5 rounded-r text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-container text-on-surface font-data-mono-sm text-data-mono-sm">
              {filteredLogs.map((entry) => (
                <tr key={entry.id} className="hover:bg-surface-container-low/60 transition-colors">
                  <td className="p-2.5 font-bold text-primary">{entry.id}</td>
                  <td className="p-2.5 text-outline">{entry.timestamp}</td>
                  <td className="p-2.5 font-body-sm font-semibold text-on-surface">{entry.actor}</td>
                  <td className="p-2.5 font-body-sm text-on-surface-variant">{entry.action}</td>
                  <td className="p-2.5 text-outline">{entry.targetNode}</td>
                  <td className="p-2.5 text-secondary">{entry.shaHash}</td>
                  <td className="p-2.5 text-right">
                    <span
                      className={`px-2 py-0.5 rounded font-label-caps text-[10px] font-bold ${
                        entry.status === 'SUCCESS'
                          ? 'bg-tertiary-fixed/40 text-tertiary'
                          : 'bg-error-container text-on-error-container'
                      }`}
                    >
                      {entry.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
