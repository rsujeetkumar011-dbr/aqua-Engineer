import React, { useState } from 'react';

interface BroadcastModalProps {
  isOpen: boolean;
  onClose: () => void;
  onBroadcast: (title: string, recipients: string) => void;
}

export const BroadcastModal: React.FC<BroadcastModalProps> = ({
  isOpen,
  onClose,
  onBroadcast,
}) => {
  const [advisoryType, setAdvisoryType] = useState('Low Pressure Warning & Voluntary Conservation');
  const [targetDistrict, setTargetDistrict] = useState('District 4 (Highlands & Metro Core)');
  const [message, setMessage] = useState(
    'MUNICIPAL WATER UTILITY: Maintenance crews are isolating a 24-inch rupture along Elmwood Ave. Residents may experience temporary pressure fluctuation below 35 PSI. Boil water order NOT currently in effect.'
  );
  const [channels, setChannels] = useState({
    sms: true,
    mobilePush: true,
    municipalRadio: true,
    epaRegistry: true,
  });

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-on-surface/40 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="bg-surface-container-lowest rounded-xl shadow-2xl w-full max-w-lg overflow-hidden border border-outline-variant/30">
        <div className="bg-surface-container-low px-space-lg py-space-md flex items-center justify-between border-b border-surface-container">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-primary text-[22px]">cell_tower</span>
            <h3 className="font-headline-sm text-headline-sm text-on-surface">
              Broadcast Hydraulic Advisory
            </h3>
          </div>
          <button onClick={onClose} className="p-1 rounded text-outline hover:text-on-surface">
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        <div className="p-space-lg flex flex-col gap-space-md">
          <div>
            <label className="block font-label-caps text-label-caps uppercase text-outline mb-1">
              Advisory Protocol
            </label>
            <select
              value={advisoryType}
              onChange={(e) => setAdvisoryType(e.target.value)}
              className="w-full bg-surface-container-low text-on-surface font-body-sm text-body-sm px-3 py-2 rounded border border-outline-variant/30 focus:outline-none focus:ring-1 focus:ring-primary"
            >
              <option>Low Pressure Warning & Voluntary Conservation</option>
              <option>Precautionary Boil-Water Notice</option>
              <option>Immediate Traffic Detour & Excavation Zone</option>
              <option>Post-Repair Flush & Clear Notice</option>
            </select>
          </div>

          <div>
            <label className="block font-label-caps text-label-caps uppercase text-outline mb-1">
              Target Distribution Reach
            </label>
            <div className="bg-surface-container-low p-space-sm rounded flex items-center justify-between">
              <span className="font-body-sm text-body-sm font-semibold text-on-surface">
                {targetDistrict}
              </span>
              <span className="font-data-mono-sm text-data-mono-sm text-primary font-bold">
                48,200 ACCOUNTS
              </span>
            </div>
          </div>

          <div>
            <label className="block font-label-caps text-label-caps uppercase text-outline mb-1">
              Advisory Dispatch Channels
            </label>
            <div className="grid grid-cols-2 gap-2 text-body-sm">
              <label className="flex items-center gap-2 p-2 bg-surface-container-low rounded cursor-pointer">
                <input
                  type="checkbox"
                  checked={channels.sms}
                  onChange={(e) => setChannels({ ...channels, sms: e.target.checked })}
                  className="rounded text-primary focus:ring-0"
                />
                <span>SMS Emergency Wire</span>
              </label>
              <label className="flex items-center gap-2 p-2 bg-surface-container-low rounded cursor-pointer">
                <input
                  type="checkbox"
                  checked={channels.mobilePush}
                  onChange={(e) => setChannels({ ...channels, mobilePush: e.target.checked })}
                  className="rounded text-primary focus:ring-0"
                />
                <span>Utility App Push</span>
              </label>
              <label className="flex items-center gap-2 p-2 bg-surface-container-low rounded cursor-pointer">
                <input
                  type="checkbox"
                  checked={channels.municipalRadio}
                  onChange={(e) => setChannels({ ...channels, municipalRadio: e.target.checked })}
                  className="rounded text-primary focus:ring-0"
                />
                <span>VHF Civil Broadcast</span>
              </label>
              <label className="flex items-center gap-2 p-2 bg-surface-container-low rounded cursor-pointer">
                <input
                  type="checkbox"
                  checked={channels.epaRegistry}
                  onChange={(e) => setChannels({ ...channels, epaRegistry: e.target.checked })}
                  className="rounded text-primary focus:ring-0"
                />
                <span>EPA / State Audit Log</span>
              </label>
            </div>
          </div>

          <div>
            <label className="block font-label-caps text-label-caps uppercase text-outline mb-1">
              Public Safety Message Body
            </label>
            <textarea
              rows={3}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="w-full bg-surface-container-low text-on-surface font-body-sm text-body-sm p-3 rounded border border-outline-variant/30 focus:outline-none focus:ring-1 focus:ring-primary"
            />
          </div>
        </div>

        <div className="bg-surface-container-low px-space-lg py-space-md flex items-center justify-between border-t border-surface-container">
          <button
            onClick={onClose}
            className="px-space-md py-2 rounded font-body-sm text-body-sm text-on-surface-variant hover:text-on-surface"
          >
            Cancel
          </button>
          <button
            onClick={() => {
              onBroadcast(advisoryType, targetDistrict);
              onClose();
            }}
            className="flex items-center gap-1.5 px-space-lg py-2 rounded bg-primary text-on-primary font-body-sm text-body-sm font-semibold hover:bg-primary-container shadow-sm cursor-pointer"
          >
            <span className="material-symbols-outlined text-[18px]">campaign</span>
            <span>Broadcast Notice</span>
          </button>
        </div>
      </div>
    </div>
  );
};
