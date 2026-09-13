import React, { useState } from 'react';

export const EmergencyProtocolsScreen: React.FC = () => {
  const [activeDrill, setActiveDrill] = useState<boolean>(false);
  const [drillStep, setDrillStep] = useState<number>(0);

  const startDrill = () => {
    setActiveDrill(true);
    setDrillStep(1);
    const interval = setInterval(() => {
      setDrillStep((prev) => {
        if (prev >= 4) {
          clearInterval(interval);
          return 4;
        }
        return prev + 1;
      });
    }, 1200);
  };

  return (
    <div className="flex flex-col w-full gap-space-lg">
      <div className="bg-surface-container-lowest p-space-lg rounded-lg shadow-sm border border-outline-variant/20 flex flex-col sm:flex-row sm:items-center justify-between gap-space-md">
        <div>
          <div className="flex items-center gap-space-xs">
            <span className="material-symbols-outlined text-error text-[20px]">
              emergency_home
            </span>
            <span className="font-label-caps text-label-caps uppercase text-error font-bold">
              Standard Operating Protocols
            </span>
          </div>
          <h1 className="font-headline-lg text-headline-lg text-on-surface font-bold">
            Emergency Hydraulic Protocols & Disaster Mitigation
          </h1>
          <p className="font-body-md text-body-md text-on-surface-variant max-w-2xl mt-0.5">
            Formalized SOP sequences for catastrophic trunk shears, rapid microbiological isolation,
            and regional boil-water directives.
          </p>
        </div>

        <button
          onClick={startDrill}
          className="px-space-lg py-2.5 bg-error text-on-error hover:bg-error/90 rounded-lg font-body-sm text-body-sm font-semibold shadow-sm transition-all flex items-center gap-2 cursor-pointer"
        >
          <span className="material-symbols-outlined text-[18px]">play_circle</span>
          <span>Execute Simulation Drill</span>
        </button>
      </div>

      {activeDrill && (
        <div className="bg-surface-container-lowest p-space-md rounded-lg shadow-sm border border-error/40 flex flex-col gap-space-sm animate-in fade-in">
          <div className="flex items-center justify-between">
            <span className="font-headline-sm text-headline-sm text-error font-bold flex items-center gap-1.5">
              <span className="material-symbols-outlined text-[20px] animate-spin">sync</span>
              Simulated Level 1 Mainline Shear Isolation Drill In Progress
            </span>
            <span className="font-data-mono-sm text-data-mono-sm text-outline">
              Step {drillStep} of 4
            </span>
          </div>

          <div className="w-full bg-surface-container-low h-2 rounded-full overflow-hidden">
            <div
              className="bg-error h-full rounded-full transition-all duration-500"
              style={{ width: `${(drillStep / 4) * 100}%` }}
            ></div>
          </div>

          <p className="font-body-sm text-body-sm text-on-surface">
            {drillStep === 1 && 'Initiating telemetry pressure delta detection (>40% drop within 20s)...'}
            {drillStep === 2 && 'Actuating motorized butterfly valves V-401 and V-408 in Sector 7...'}
            {drillStep === 3 && 'Routing backup flow via East Ridge Bypass to maintain hospital pressure...'}
            {drillStep === 4 && 'Simulation Complete: Isolation achieved in 4.8 seconds. Zero civil water loss.'}
          </p>
        </div>
      )}

      {/* Protocols Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-space-lg">
        {/* Protocol 1 */}
        <div className="bg-surface-container-lowest p-space-md rounded-lg shadow-sm border border-outline-variant/20 flex flex-col justify-between gap-space-md">
          <div>
            <div className="flex items-center justify-between pb-space-xs border-b border-surface-container">
              <span className="font-headline-sm text-headline-sm text-on-surface font-bold">
                SOP-01: Major Trunk Pipe Shear (≥16" Diameter)
              </span>
              <span className="bg-error text-on-error px-2 py-0.5 rounded font-label-caps text-label-caps font-bold">
                TIER 1
              </span>
            </div>
            <ol className="mt-space-md flex flex-col gap-2 font-body-sm text-body-sm text-on-surface-variant list-decimal pl-4">
              <li>
                <strong className="text-on-surface">Instant Isolation:</strong> Trigger motorized gate
                valves upstream and downstream of suspected break.
              </li>
              <li>
                <strong className="text-on-surface">Pressure Relief:</strong> Step down booster pump VFD
                at feeder station to prevent water hammer.
              </li>
              <li>
                <strong className="text-on-surface">Crew Mobilization:</strong> Auto-dispatch heavy vac
                and repair rig unit with 12"-24" mechanical repair clamp sleeves.
              </li>
              <li>
                <strong className="text-on-surface">Public Advisory:</strong> Broadcast civil text notification
                to registered households within 200m radius.
              </li>
            </ol>
          </div>
          <button
            onClick={startDrill}
            className="w-full py-2 bg-surface-container-low text-primary hover:bg-surface-container rounded font-label-caps text-label-caps uppercase font-bold text-center"
          >
            Review Step-by-step Execution Runbook →
          </button>
        </div>

        {/* Protocol 2 */}
        <div className="bg-surface-container-lowest p-space-md rounded-lg shadow-sm border border-outline-variant/20 flex flex-col justify-between gap-space-md">
          <div>
            <div className="flex items-center justify-between pb-space-xs border-b border-surface-container">
              <span className="font-headline-sm text-headline-sm text-on-surface font-bold">
                SOP-02: Microbiological / Turbidity Exceedance
              </span>
              <span className="bg-secondary-container text-on-secondary-container px-2 py-0.5 rounded font-label-caps text-label-caps font-bold">
                HEALTH SAFEGUARD
              </span>
            </div>
            <ol className="mt-space-md flex flex-col gap-2 font-body-sm text-body-sm text-on-surface-variant list-decimal pl-4">
              <li>
                <strong className="text-on-surface">Divert to Detention Basin:</strong> Reroute water
                surpassing 1.0 NTU away from municipal distribution into retention reservoir.
              </li>
              <li>
                <strong className="text-on-surface">Chlorination Boost:</strong> Step up sodium
                hypochlorite dosing by 0.5 mg/L at dosing skid #3.
              </li>
              <li>
                <strong className="text-on-surface">Grab Sample Verification:</strong> Dispatch Mobile
                Quality Lab Van #04 for benchtop photometric titration.
              </li>
              <li>
                <strong className="text-on-surface">State Notice:</strong> File expedited incident form to
                State Department of Drinking Water.
              </li>
            </ol>
          </div>
          <button className="w-full py-2 bg-surface-container-low text-primary hover:bg-surface-container rounded font-label-caps text-label-caps uppercase font-bold text-center">
            Review Chemical Neutralization Tables →
          </button>
        </div>
      </div>
    </div>
  );
};
