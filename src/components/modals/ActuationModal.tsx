import React, { useState } from 'react';
import { GisNode } from '../../types';

interface ActuationModalProps {
  isOpen: boolean;
  onClose: () => void;
  node: GisNode;
  onApplyActuation: (nodeId: string, vfd: string, valvePos: string) => void;
}

export const ActuationModal: React.FC<ActuationModalProps> = ({
  isOpen,
  onClose,
  node,
  onApplyActuation,
}) => {
  const [vfdHz, setVfdHz] = useState<number>(58.2);
  const [valvePercent, setValvePercent] = useState<number>(92);
  const [emergencyTrip, setEmergencyTrip] = useState<boolean>(false);
  const [executing, setExecuting] = useState<boolean>(false);

  if (!isOpen) return null;

  const handleExecute = () => {
    setExecuting(true);
    setTimeout(() => {
      setExecuting(false);
      onApplyActuation(
        node.id,
        emergencyTrip ? '0.0 Hz (TRIPPED)' : `${vfdHz.toFixed(1)} Hz (OK)`,
        emergencyTrip ? '0% CLOSED' : `${valvePercent}% OPEN`
      );
      onClose();
    }, 800);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-on-surface/40 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="bg-surface-container-lowest rounded-xl shadow-2xl w-full max-w-lg overflow-hidden border border-outline-variant/30">
        {/* Header */}
        <div className="bg-surface-container-low px-space-lg py-space-md flex items-center justify-between border-b border-surface-container">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-primary text-[24px]">power_input</span>
            <div>
              <h3 className="font-headline-sm text-headline-sm text-on-surface">
                Remote SCADA Telecommand
              </h3>
              <p className="font-data-mono-sm text-data-mono-sm text-outline">
                {node.name} ({node.id})
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded text-outline hover:text-on-surface"
          >
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        {/* Content */}
        <div className="p-space-lg flex flex-col gap-space-md">
          {/* Node Coordinates & Baseline */}
          <div className="bg-surface-container-low p-space-sm rounded-lg flex items-center justify-between text-body-sm">
            <span className="font-data-mono-sm text-data-mono-sm text-on-surface-variant">
              Telemetry Grid: D4-HYDRAULIC-400
            </span>
            <span className="font-label-caps text-label-caps bg-tertiary-fixed text-tertiary px-2 py-0.5 rounded font-bold">
              RTU CONNECTED
            </span>
          </div>

          {/* VFD Motor Drive Frequency */}
          <div className="flex flex-col gap-1.5">
            <div className="flex items-center justify-between">
              <label className="font-label-caps text-label-caps uppercase text-outline">
                VFD Booster Motor Frequency
              </label>
              <span className="font-data-mono-md text-data-mono-md text-primary font-bold">
                {vfdHz.toFixed(1)} Hz
              </span>
            </div>
            <input
              type="range"
              min="40.0"
              max="60.0"
              step="0.1"
              value={vfdHz}
              disabled={emergencyTrip}
              onChange={(e) => setVfdHz(parseFloat(e.target.value))}
              className="w-full accent-primary h-2 bg-surface-container rounded-lg cursor-pointer"
            />
            <div className="flex justify-between font-data-mono-sm text-[11px] text-outline">
              <span>40.0 Hz (Min Pressure)</span>
              <span>58.2 Hz (Nominal)</span>
              <span>60.0 Hz (Max Flow)</span>
            </div>
          </div>

          {/* Valve Position Actuator */}
          <div className="flex flex-col gap-1.5">
            <div className="flex items-center justify-between">
              <label className="font-label-caps text-label-caps uppercase text-outline">
                Hydraulic Control Valve Position
              </label>
              <span className="font-data-mono-md text-data-mono-md text-secondary font-bold">
                {valvePercent}% OPEN
              </span>
            </div>
            <input
              type="range"
              min="0"
              max="100"
              step="1"
              value={valvePercent}
              disabled={emergencyTrip}
              onChange={(e) => setValvePercent(parseInt(e.target.value, 10))}
              className="w-full accent-secondary h-2 bg-surface-container rounded-lg cursor-pointer"
            />
            <div className="flex justify-between font-data-mono-sm text-[11px] text-outline">
              <span>0% (Fully Closed)</span>
              <span>50% (Throttled)</span>
              <span>100% (Full Bore)</span>
            </div>
          </div>

          {/* Emergency Trip */}
          <div className="p-space-sm rounded-lg bg-error-container/30 border border-error/20 flex items-center justify-between">
            <div>
              <p className="font-body-sm text-body-sm font-semibold text-error">
                Emergency Immediate Trip
              </p>
              <p className="font-data-mono-sm text-data-mono-sm text-on-surface-variant">
                Instant motor power cut and solenoid backflow drop.
              </p>
            </div>
            <button
              type="button"
              onClick={() => setEmergencyTrip(!emergencyTrip)}
              className={`px-3 py-1 rounded font-label-caps text-label-caps uppercase font-bold transition-all ${
                emergencyTrip
                  ? 'bg-error text-on-error shadow-sm'
                  : 'bg-surface-container text-outline hover:text-error'
              }`}
            >
              {emergencyTrip ? 'TRIPPED' : 'ARM TRIP'}
            </button>
          </div>
        </div>

        {/* Footer */}
        <div className="bg-surface-container-low px-space-lg py-space-md flex items-center justify-between border-t border-surface-container">
          <button
            onClick={onClose}
            className="px-space-md py-2 rounded font-body-sm text-body-sm text-on-surface-variant hover:text-on-surface"
          >
            Cancel
          </button>
          <button
            onClick={handleExecute}
            disabled={executing}
            className="flex items-center gap-1.5 px-space-lg py-2 rounded bg-primary text-on-primary font-body-sm text-body-sm font-semibold hover:bg-primary-container shadow-sm cursor-pointer disabled:opacity-50"
          >
            {executing ? (
              <>
                <span className="material-symbols-outlined text-[18px] animate-spin">sync</span>
                <span>Transmitting Telemetry...</span>
              </>
            ) : (
              <>
                <span className="material-symbols-outlined text-[18px]">bolt</span>
                <span>Execute SCADA Telecommand</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
