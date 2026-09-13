import React from 'react';
import { ScreenId } from '../../types';

interface CriticalAlertsDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigate: (screen: ScreenId) => void;
  onFocusIncident: (incidentId: string) => void;
}

export const CriticalAlertsDrawer: React.FC<CriticalAlertsDrawerProps> = ({
  isOpen,
  onClose,
  onNavigate,
  onFocusIncident,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-inverse-surface/40 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="w-full max-w-md bg-surface-container-lowest h-full shadow-2xl overflow-y-auto p-space-lg flex flex-col justify-between animate-in slide-in-from-right duration-250 border-l border-outline-variant/30">
        <div>
          <div className="flex items-center justify-between pb-space-sm border-b border-surface-container mb-space-md">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-error animate-ping"></span>
              <h3 className="font-headline-sm text-headline-sm text-on-surface">
                Active Critical Grid Alerts
              </h3>
            </div>
            <button
              onClick={onClose}
              className="p-1 rounded text-outline hover:text-on-surface bg-surface-container-low"
            >
              <span className="material-symbols-outlined text-[20px]">close</span>
            </button>
          </div>

          <div className="flex flex-col gap-space-md">
            {/* Alert 1 */}
            <div className="p-space-md rounded-lg bg-error-container/40 border border-error/30 flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <span className="font-data-mono-sm text-data-mono-sm font-bold text-error flex items-center gap-1">
                  <span className="material-symbols-outlined text-[16px]">warning</span> PIPE BURST S-704
                </span>
                <span className="font-label-caps text-label-caps bg-error text-on-error px-1.5 py-0.5 rounded font-bold">
                  PRIORITY 1
                </span>
              </div>
              <h4 className="font-body-md text-body-md font-bold text-on-surface">
                Elmwood Ave 24" Main Shear
              </h4>
              <p className="font-body-sm text-body-sm text-on-surface-variant">
                Pressure collapsed to 18.2 PSI (-64%). Discharge loss estimated at 8,940 GPM.
              </p>
              <div className="flex items-center gap-2 pt-1">
                <button
                  onClick={() => {
                    onNavigate('issues');
                    onFocusIncident('inc-8921');
                    onClose();
                  }}
                  className="px-3 py-1.5 bg-error text-on-error rounded font-label-caps text-label-caps uppercase font-bold hover:bg-error/90"
                >
                  Inspect Incident
                </button>
                <button
                  onClick={() => {
                    onNavigate('dashboard');
                    onClose();
                  }}
                  className="px-3 py-1.5 bg-surface-container-lowest text-on-surface rounded font-label-caps text-label-caps uppercase hover:bg-surface-container"
                >
                  Locate on Map
                </button>
              </div>
            </div>

            {/* Alert 2 */}
            <div className="p-space-md rounded-lg bg-error-container/30 border border-error/20 flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <span className="font-data-mono-sm text-data-mono-sm font-bold text-error flex items-center gap-1">
                  <span className="material-symbols-outlined text-[16px]">bolt</span> WO-9042
                </span>
                <span className="font-label-caps text-label-caps bg-error text-on-error px-1.5 py-0.5 rounded font-bold">
                  P1 DISPATCH
                </span>
              </div>
              <h4 className="font-body-md text-body-md font-bold text-on-surface">
                Mainline Shearing at Westwood Crossing
              </h4>
              <p className="font-body-sm text-body-sm text-on-surface-variant">
                Elapsed 14m. Est. Loss: 420 GPM. Team Gamma recommended for fast deploy.
              </p>
              <button
                onClick={() => {
                  onNavigate('field-teams');
                  onClose();
                }}
                className="w-full py-1.5 bg-surface-container-high text-primary rounded font-label-caps text-label-caps uppercase font-bold hover:bg-surface-variant text-center"
              >
                Open Dispatch Board
              </button>
            </div>

            {/* Alert 3 */}
            <div className="p-space-md rounded-lg bg-surface-container-low border border-outline-variant/30 flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <span className="font-data-mono-sm text-data-mono-sm font-bold text-outline flex items-center gap-1">
                  <span className="material-symbols-outlined text-[16px]">signal_cellular_off</span> SENSOR #R-004
                </span>
                <span className="font-label-caps text-label-caps bg-surface-container-high text-outline px-1.5 py-0.5 rounded font-bold">
                  TIMEOUT
                </span>
              </div>
              <h4 className="font-body-md text-body-md font-bold text-on-surface">
                Echo Sounder Offline • Valley Basin East
              </h4>
              <p className="font-body-sm text-body-sm text-on-surface-variant">
                Telemetry signal missing for &gt;15 minutes. Hydrostatic backup active.
              </p>
            </div>
          </div>
        </div>

        <div className="pt-space-md border-t border-surface-container">
          <button
            onClick={() => {
              onNavigate('emergency-protocols');
              onClose();
            }}
            className="w-full py-2 bg-error text-on-error rounded font-body-sm text-body-sm font-semibold hover:bg-error/90 flex items-center justify-center gap-2"
          >
            <span className="material-symbols-outlined text-[18px]">emergency</span>
            <span>Open Emergency Isolation Protocols</span>
          </button>
        </div>
      </div>
    </div>
  );
};
