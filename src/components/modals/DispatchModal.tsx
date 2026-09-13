import React, { useState } from 'react';
import { WorkOrder } from '../../types';

interface DispatchModalProps {
  isOpen: boolean;
  onClose: () => void;
  workOrder?: WorkOrder | null;
  onConfirm: (workOrderId: string, crewName: string, vehicle: string, channel: string) => void;
}

export const DispatchModal: React.FC<DispatchModalProps> = ({
  isOpen,
  onClose,
  workOrder,
  onConfirm,
}) => {
  const [assignedVehicle, setAssignedVehicle] = useState('Heavy Crane Unit #02 (Hydraulic Assist)');
  const [radioChannel, setRadioChannel] = useState('TAC-04 (Emergency Ops Net)');
  const [directives, setDirectives] = useState(
    'Immediate deployment required. Coordinate with LAPD for lane closure on 4th. Team Alpha already on-scene securing 12" isolation valves.'
  );

  if (!isOpen) return null;

  const targetTitle = workOrder
    ? `${workOrder.title} (${workOrder.code})`
    : 'Mainline Shearing at Westwood Crossing (WO-9042)';

  const targetPriority = workOrder?.priorityLabel || 'P1 - Burst';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-on-surface/40 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="bg-surface-container-lowest rounded-xl shadow-xl w-full max-w-2xl overflow-hidden animate-in zoom-in-95 duration-200 border border-outline-variant/30">
        {/* Modal Header */}
        <div className="bg-surface-container-low px-space-lg py-space-md flex items-center justify-between border-b border-surface-container">
          <div className="flex items-center gap-space-xs">
            <span className="material-symbols-outlined text-primary text-[22px]">
              send_time_extension
            </span>
            <h3 className="font-headline-sm text-headline-sm text-on-surface">
              Automated Work Order Crew Dispatch
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded text-outline hover:text-on-surface transition-colors"
          >
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-space-lg flex flex-col gap-space-md">
          {/* Incident Ref Pill */}
          <div className="bg-error-container/30 p-space-sm rounded-lg flex items-center justify-between border border-error/20">
            <div className="flex items-center gap-space-xs">
              <span className="material-symbols-outlined text-error text-[20px]">crisis_alert</span>
              <div>
                <p className="font-body-sm text-body-sm font-semibold text-on-surface">
                  Target Incident: {targetTitle}
                </p>
                <p className="font-data-mono-sm text-data-mono-sm text-outline">
                  Priority 1 High-Velocity Leak • 420 GPM
                </p>
              </div>
            </div>
            <span className="font-data-mono-sm text-data-mono-sm px-2 py-0.5 rounded bg-error text-on-error font-bold">
              {targetPriority}
            </span>
          </div>

          {/* Recommended Crew Match Card */}
          <div>
            <span className="font-label-caps text-label-caps uppercase text-outline block mb-1">
              Algorithmic Route & Equipment Recommendation
            </span>
            <div className="bg-primary-fixed/20 p-space-md rounded-lg flex items-start justify-between border border-primary/20">
              <div>
                <div className="flex items-center gap-space-xs">
                  <span className="font-headline-sm text-headline-sm text-primary font-bold">
                    Team Gamma (Lead: D. Zhao)
                  </span>
                  <span className="px-2 py-0.5 rounded bg-tertiary-fixed text-tertiary font-label-caps text-label-caps font-bold">
                    98% OPTIMAL
                  </span>
                </div>
                <p className="font-body-sm text-body-sm text-on-surface-variant mt-1">
                  Currently staged at North Hub Yard with Heavy Crane #02. Equipped with necessary 12" clamp
                  sleeves & hydro-excavator coupling.
                </p>
                <div className="flex items-center gap-space-md mt-2 font-data-mono-sm text-data-mono-sm text-primary">
                  <span>Distance: 3.4 miles</span>
                  <span>•</span>
                  <span>Est. Transit: 9.2 mins</span>
                </div>
              </div>
            </div>
          </div>

          {/* Form fields for overrides */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-space-md">
            <div>
              <label className="block font-label-caps text-label-caps uppercase text-outline mb-1">
                Assigned Vehicle Unit
              </label>
              <input
                type="text"
                value={assignedVehicle}
                onChange={(e) => setAssignedVehicle(e.target.value)}
                className="w-full bg-surface-container-low px-space-sm py-2 rounded font-data-mono-md text-data-mono-md text-on-surface border border-outline-variant/30 focus:outline-none focus:ring-1 focus:ring-primary"
              />
            </div>
            <div>
              <label className="block font-label-caps text-label-caps uppercase text-outline mb-1">
                Radio Channel Assignment
              </label>
              <input
                type="text"
                value={radioChannel}
                onChange={(e) => setRadioChannel(e.target.value)}
                className="w-full bg-surface-container-low px-space-sm py-2 rounded font-data-mono-md text-data-mono-md text-on-surface border border-outline-variant/30 focus:outline-none focus:ring-1 focus:ring-primary"
              />
            </div>
          </div>

          <div>
            <label className="block font-label-caps text-label-caps uppercase text-outline mb-1">
              Dispatch Instructions & Safety Directives
            </label>
            <textarea
              rows={3}
              value={directives}
              onChange={(e) => setDirectives(e.target.value)}
              className="w-full bg-surface-container-low p-space-sm rounded font-body-sm text-body-sm text-on-surface border border-outline-variant/30 focus:outline-none focus:ring-1 focus:ring-primary"
            />
          </div>
        </div>

        {/* Modal Footer */}
        <div className="bg-surface-container-low px-space-lg py-space-md flex items-center justify-between border-t border-surface-container">
          <button
            onClick={onClose}
            className="px-space-md py-2 rounded font-body-sm text-body-sm text-on-surface-variant hover:text-on-surface transition-colors"
          >
            Cancel Operation
          </button>
          <button
            onClick={() => {
              onConfirm(
                workOrder?.id || 'wo-9042',
                'Team Gamma',
                assignedVehicle,
                radioChannel
              );
              onClose();
            }}
            className="flex items-center gap-space-xs px-space-lg py-2 rounded bg-primary text-on-primary font-body-sm text-body-sm font-semibold hover:bg-primary-container shadow-sm transition-colors cursor-pointer"
          >
            <span className="material-symbols-outlined text-[18px]">cell_tower</span>
            <span>Transmit Dispatch Orders</span>
          </button>
        </div>
      </div>
    </div>
  );
};
