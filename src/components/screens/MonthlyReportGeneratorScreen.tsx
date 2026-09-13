import React, { useState } from 'react';
import { ARCHIVED_DOSSIERS } from '../../data/mockData';

export const MonthlyReportGeneratorScreen: React.FC = () => {
  const [activeAuditTab, setActiveAuditTab] = useState<'compliance' | 'nrw' | 'sla'>('compliance');
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [generationSuccess, setGenerationSuccess] = useState<boolean>(false);
  const [isSigned, setIsSigned] = useState<boolean>(false);
  const [signerName, setSignerName] = useState<string>('Marcus Vance, Operations Lead');

  const handleGenerateDossier = () => {
    setIsGenerating(true);
    setGenerationSuccess(false);
    setTimeout(() => {
      setIsGenerating(false);
      setGenerationSuccess(true);
    }, 1500);
  };

  const handlePrintPdf = () => {
    window.print();
  };

  const handleDownloadCsv = () => {
    const csvContent =
      'data:text/csv;charset=utf-8,' +
      'Metric,October 2024,Benchmark,ComplianceStatus\n' +
      'System Input Volume (SIV),884000 m³,N/A,Normal\n' +
      'Billed Authorized Consumption,742560 m³,84.0%,Revenue Generating\n' +
      'Unbilled Authorized Consumption,38896 m³,4.4%,Firefighting and Flushing\n' +
      'Apparent Losses (Commercial),26520 m³,3.0%,Under Target\n' +
      'Real Losses (Physical Ruptures),76024 m³,8.6%,Under Target\n' +
      'Non-Revenue Water (NRW),11.6%,<15.0%,PASS Band A\n' +
      'Infrastructure Leakage Index (ILI),1.42,<2.0,Excellent\n' +
      'EPA Purity Compliance,99.82%,>99.0%,PASS Grade A\n';
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `AquaFlow_Monthly_Hydraulic_Audit_Oct2024.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="flex flex-col w-full gap-space-lg">
      {/* Dossier Header & Regulatory Context */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-space-md bg-surface-container-lowest p-space-lg rounded-lg shadow-sm border border-outline-variant/20">
        <div>
          <div className="flex items-center gap-space-xs">
            <span className="material-symbols-outlined text-primary text-[20px]">verified</span>
            <span className="font-label-caps text-label-caps uppercase text-primary font-bold tracking-wider">
              Regulatory Filing Ref: #DOC-2024-10-OCT • State Water Board Audit Compliant
            </span>
          </div>
          <h1 className="font-headline-lg text-headline-lg text-on-surface font-bold tracking-tight">
            Monthly Compliance & Hydraulic Audit Dossier
          </h1>
          <p className="font-body-md text-body-md text-on-surface-variant max-w-2xl mt-0.5">
            Official supervisory ledger detailing non-revenue water (NRW) balance, EPA purity indices,
            and field telemetry MTTR.
          </p>
        </div>

        {/* Header Action Tools */}
        <div className="flex items-center gap-space-sm flex-wrap">
          <button
            onClick={handleDownloadCsv}
            className="flex items-center gap-1.5 px-space-md py-2 bg-surface-container-low text-primary hover:bg-surface-container font-body-sm text-body-sm font-semibold rounded border border-outline-variant/30 transition-colors cursor-pointer"
          >
            <span className="material-symbols-outlined text-[18px]">table_chart</span>
            <span>Export CSV</span>
          </button>

          <button
            onClick={handlePrintPdf}
            className="flex items-center gap-1.5 px-space-md py-2 bg-surface-container-low text-primary hover:bg-surface-container font-body-sm text-body-sm font-semibold rounded border border-outline-variant/30 transition-colors cursor-pointer"
          >
            <span className="material-symbols-outlined text-[18px]">picture_as_pdf</span>
            <span>Export PDF Dossier</span>
          </button>

          <button
            onClick={handleGenerateDossier}
            disabled={isGenerating}
            className="flex items-center gap-1.5 px-space-lg py-2 bg-primary text-on-primary hover:bg-primary-container font-body-sm text-body-sm font-semibold rounded shadow-sm transition-all cursor-pointer disabled:opacity-50"
          >
            {isGenerating ? (
              <>
                <span className="material-symbols-outlined text-[18px] animate-spin">sync</span>
                <span>Compiling SCADA Logs...</span>
              </>
            ) : (
              <>
                <span className="material-symbols-outlined text-[18px]">auto_awesome</span>
                <span>Generate Dossier</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Success Notification Alert */}
      {generationSuccess && (
        <div className="p-space-md rounded-lg bg-tertiary-fixed/30 border border-tertiary flex items-center justify-between animate-in fade-in">
          <div className="flex items-center gap-space-sm">
            <span className="material-symbols-outlined text-tertiary text-[24px]">check_circle</span>
            <div>
              <p className="font-body-sm text-body-sm font-bold text-on-surface">
                October 2024 Audit Dossier Compiled & Verified
              </p>
              <p className="font-data-mono-sm text-data-mono-sm text-outline">
                All 48,200 meter endpoints and 32 SCADA logbooks correlated with zero discrepancy.
              </p>
            </div>
          </div>
          <button
            onClick={() => setGenerationSuccess(false)}
            className="text-outline hover:text-on-surface text-sm"
          >
            ✕
          </button>
        </div>
      )}

      {/* Audit Period Ribbon */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-space-md">
        <div className="bg-surface-container-lowest p-space-md rounded-lg shadow-sm border border-outline-variant/20 flex items-center justify-between">
          <div>
            <span className="font-label-caps text-label-caps uppercase text-outline">Audit Period</span>
            <div className="font-headline-lg text-headline-lg text-on-surface font-bold">
              October 2024
            </div>
            <p className="font-data-mono-sm text-data-mono-sm text-tertiary font-semibold">
              31 Days Closed • Finalized
            </p>
          </div>
          <div className="w-12 h-12 rounded-lg bg-surface-container-low text-primary flex items-center justify-center">
            <span className="material-symbols-outlined text-[24px]">event_available</span>
          </div>
        </div>

        <div className="bg-surface-container-lowest p-space-md rounded-lg shadow-sm border border-outline-variant/20 flex items-center justify-between">
          <div>
            <span className="font-label-caps text-label-caps uppercase text-outline">
              System Inflow (SIV)
            </span>
            <div className="font-headline-lg text-headline-lg text-primary font-bold">
              884,000 m³
            </div>
            <p className="font-data-mono-sm text-data-mono-sm text-on-surface-variant">
              Daily Avg: 28.51 ML
            </p>
          </div>
          <div className="w-12 h-12 rounded-lg bg-primary-fixed/40 text-primary flex items-center justify-center">
            <span className="material-symbols-outlined text-[24px]">water</span>
          </div>
        </div>

        <div className="bg-surface-container-lowest p-space-md rounded-lg shadow-sm border border-outline-variant/20 flex items-center justify-between">
          <div>
            <span className="font-label-caps text-label-caps uppercase text-outline">
              Non-Revenue Water (NRW)
            </span>
            <div className="font-headline-lg text-headline-lg text-secondary font-bold">11.6%</div>
            <p className="font-data-mono-sm text-data-mono-sm text-tertiary font-semibold">
              -1.8% vs Sept (Target &lt;15%)
            </p>
          </div>
          <div className="w-12 h-12 rounded-lg bg-secondary-fixed/40 text-secondary flex items-center justify-center">
            <span className="material-symbols-outlined text-[24px]">pie_chart</span>
          </div>
        </div>

        <div className="bg-surface-container-lowest p-space-md rounded-lg shadow-sm border border-outline-variant/20 flex items-center justify-between">
          <div>
            <span className="font-label-caps text-label-caps uppercase text-outline">
              EPA Purity Rating
            </span>
            <div className="font-headline-lg text-headline-lg text-tertiary font-bold">
              99.82% PASS
            </div>
            <p className="font-data-mono-sm text-data-mono-sm text-tertiary font-semibold">
              Grade A Potable Standards
            </p>
          </div>
          <div className="w-12 h-12 rounded-lg bg-tertiary-fixed/40 text-tertiary flex items-center justify-center">
            <span className="material-symbols-outlined text-[24px]">health_and_safety</span>
          </div>
        </div>
      </div>

      {/* Main Audit Tabs Navigation */}
      <div className="bg-surface-container-lowest p-space-md rounded-lg shadow-sm border border-outline-variant/20 flex flex-col gap-space-md">
        <div className="flex items-center justify-between border-b border-surface-container pb-space-xs">
          <div className="inline-flex p-1 bg-surface-container rounded-lg">
            <button
              onClick={() => setActiveAuditTab('compliance')}
              className={`px-space-md py-1.5 rounded font-body-sm text-body-sm font-semibold transition-all cursor-pointer ${
                activeAuditTab === 'compliance'
                  ? 'bg-surface-container-lowest text-primary shadow-sm'
                  : 'text-on-surface-variant hover:text-on-surface'
              }`}
            >
              EPA Water Quality & Potability
            </button>
            <button
              onClick={() => setActiveAuditTab('nrw')}
              className={`px-space-md py-1.5 rounded font-body-sm text-body-sm font-semibold transition-all cursor-pointer ${
                activeAuditTab === 'nrw'
                  ? 'bg-surface-container-lowest text-primary shadow-sm'
                  : 'text-on-surface-variant hover:text-on-surface'
              }`}
            >
              IWA Water Balance & NRW Ledger
            </button>
            <button
              onClick={() => setActiveAuditTab('sla')}
              className={`px-space-md py-1.5 rounded font-body-sm text-body-sm font-semibold transition-all cursor-pointer ${
                activeAuditTab === 'sla'
                  ? 'bg-surface-container-lowest text-primary shadow-sm'
                  : 'text-on-surface-variant hover:text-on-surface'
              }`}
            >
              Field Response MTTR & SLA Analytics
            </button>
          </div>

          <span className="font-data-mono-sm text-data-mono-sm text-outline hidden sm:block">
            CALIBRATED TO ISO 24512 & AWWA M36
          </span>
        </div>

        {/* Tab 1: EPA Water Quality Compliance */}
        {activeAuditTab === 'compliance' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-space-md">
            <div className="bg-surface-container-low p-space-md rounded-lg border border-outline-variant/20 flex flex-col justify-between">
              <div>
                <span className="font-label-caps text-label-caps text-outline uppercase">
                  pH Consistency
                </span>
                <div className="font-headline-lg text-headline-lg text-on-surface font-bold mt-1">
                  7.42 avg
                </div>
                <p className="font-body-sm text-body-sm text-on-surface-variant mt-1">
                  Permissible: 6.5 - 8.5 pH. 0 excursions detected over 1,480 automated titrations.
                </p>
              </div>
              <div className="mt-space-md pt-2 border-t border-surface-container flex items-center justify-between font-label-caps text-label-caps text-tertiary font-bold">
                <span>100% COMPLIANT</span>
                <span className="material-symbols-outlined text-[18px]">verified</span>
              </div>
            </div>

            <div className="bg-surface-container-low p-space-md rounded-lg border border-outline-variant/20 flex flex-col justify-between">
              <div>
                <span className="font-label-caps text-label-caps text-outline uppercase">
                  Free Chlorine Residual
                </span>
                <div className="font-headline-lg text-headline-lg text-primary font-bold mt-1">
                  1.78 mg/L
                </div>
                <p className="font-body-sm text-body-sm text-on-surface-variant mt-1">
                  Regulatory Minimum: 0.20 mg/L. Maximum: 4.0 mg/L. Disinfection threshold maintained.
                </p>
              </div>
              <div className="mt-space-md pt-2 border-t border-surface-container flex items-center justify-between font-label-caps text-label-caps text-tertiary font-bold">
                <span>99.8% IN-RANGE</span>
                <span className="material-symbols-outlined text-[18px]">verified</span>
              </div>
            </div>

            <div className="bg-surface-container-low p-space-md rounded-lg border border-outline-variant/20 flex flex-col justify-between">
              <div>
                <span className="font-label-caps text-label-caps text-outline uppercase">
                  Turbidity Index
                </span>
                <div className="font-headline-lg text-headline-lg text-secondary font-bold mt-1">
                  0.38 NTU
                </div>
                <p className="font-body-sm text-body-sm text-on-surface-variant mt-1">
                  EPA Benchmark: &lt; 1.0 NTU. 2 transient spikes in Sector 7 isolated in &lt;15 mins.
                </p>
              </div>
              <div className="mt-space-md pt-2 border-t border-surface-container flex items-center justify-between font-label-caps text-label-caps text-tertiary font-bold">
                <span>99.5% PASS</span>
                <span className="material-symbols-outlined text-[18px]">verified</span>
              </div>
            </div>

            <div className="bg-surface-container-low p-space-md rounded-lg border border-outline-variant/20 flex flex-col justify-between">
              <div>
                <span className="font-label-caps text-label-caps text-outline uppercase">
                  Microbial Coliform
                </span>
                <div className="font-headline-lg text-headline-lg text-tertiary font-bold mt-1">
                  0 / 100 mL
                </div>
                <p className="font-body-sm text-body-sm text-on-surface-variant mt-1">
                  Zero presence of E. coli or total coliforms across 240 random district sample taps.
                </p>
              </div>
              <div className="mt-space-md pt-2 border-t border-surface-container flex items-center justify-between font-label-caps text-label-caps text-tertiary font-bold">
                <span>ZERO DETECTED</span>
                <span className="material-symbols-outlined text-[18px]">shield</span>
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: IWA Standard Water Balance Audit */}
        {activeAuditTab === 'nrw' && (
          <div className="flex flex-col gap-space-md">
            <div className="bg-surface-container-low p-space-md rounded-lg border border-outline-variant/20">
              <div className="flex items-center justify-between mb-space-sm">
                <div>
                  <h3 className="font-headline-sm text-headline-sm text-on-surface">
                    IWA / AWWA Standard Water Balance Breakdown
                  </h3>
                  <p className="font-data-mono-sm text-data-mono-sm text-outline">
                    System Input Volume (SIV): 884,000 m³ (100.0%)
                  </p>
                </div>
                <span className="font-data-mono-sm text-data-mono-sm font-bold text-tertiary bg-tertiary-fixed/30 px-2 py-1 rounded">
                  ILI: 1.42 (BAND A - EXCELLENT)
                </span>
              </div>

              {/* Graphical Balance Tree */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-space-md">
                {/* Branch 1: Authorized Consumption */}
                <div className="bg-surface-container-lowest p-space-md rounded-lg border border-outline-variant/30 flex flex-col gap-space-sm">
                  <div className="flex items-center justify-between border-b border-surface-container pb-space-xs">
                    <span className="font-body-md text-body-md font-bold text-primary">
                      Authorized Consumption
                    </span>
                    <span className="font-data-mono-md text-data-mono-md font-bold text-primary">
                      781,456 m³ (88.4%)
                    </span>
                  </div>

                  <div className="flex flex-col gap-2 font-body-sm text-body-sm">
                    <div className="flex items-center justify-between p-2 bg-surface-container-low rounded">
                      <div>
                        <p className="font-semibold text-on-surface">Billed Metered Accounts</p>
                        <p className="font-data-mono-sm text-[11px] text-outline">
                          Residential, Commercial, Industrial
                        </p>
                      </div>
                      <span className="font-data-mono-sm text-data-mono-sm font-bold text-on-surface">
                        742,560 m³ (84.0%)
                      </span>
                    </div>

                    <div className="flex items-center justify-between p-2 bg-surface-container-low rounded">
                      <div>
                        <p className="font-semibold text-on-surface">Unbilled Authorized Consumption</p>
                        <p className="font-data-mono-sm text-[11px] text-outline">
                          Firefighting, Main Line Scouring & Flushing
                        </p>
                      </div>
                      <span className="font-data-mono-sm text-data-mono-sm font-bold text-on-surface">
                        38,896 m³ (4.4%)
                      </span>
                    </div>
                  </div>
                </div>

                {/* Branch 2: Water Losses (NRW) */}
                <div className="bg-surface-container-lowest p-space-md rounded-lg border border-outline-variant/30 flex flex-col gap-space-sm">
                  <div className="flex items-center justify-between border-b border-surface-container pb-space-xs">
                    <span className="font-body-md text-body-md font-bold text-error">
                      Water Losses (Non-Revenue Water)
                    </span>
                    <span className="font-data-mono-md text-data-mono-md font-bold text-error">
                      102,544 m³ (11.6%)
                    </span>
                  </div>

                  <div className="flex flex-col gap-2 font-body-sm text-body-sm">
                    <div className="flex items-center justify-between p-2 bg-surface-container-low rounded">
                      <div>
                        <p className="font-semibold text-on-surface">Apparent Losses (Commercial)</p>
                        <p className="font-data-mono-sm text-[11px] text-outline">
                          Customer meter inaccuracy & data errors
                        </p>
                      </div>
                      <span className="font-data-mono-sm text-data-mono-sm font-bold text-secondary">
                        26,520 m³ (3.0%)
                      </span>
                    </div>

                    <div className="flex items-center justify-between p-2 bg-surface-container-low rounded">
                      <div>
                        <p className="font-semibold text-on-surface">Real Losses (Physical Ruptures)</p>
                        <p className="font-data-mono-sm text-[11px] text-outline">
                          Transmission bursts, service pipe leaks, tank overflow
                        </p>
                      </div>
                      <span className="font-data-mono-sm text-data-mono-sm font-bold text-error">
                        76,024 m³ (8.6%)
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tab 3: SLA & MTTR Analytics */}
        {activeAuditTab === 'sla' && (
          <div className="flex flex-col gap-space-md">
            <div className="bg-surface-container-low p-space-md rounded-lg border border-outline-variant/20 flex flex-col gap-space-sm">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-headline-sm text-headline-sm text-on-surface">
                    Mean Time To Repair (MTTR) & SLA Compliance Trend
                  </h3>
                  <p className="font-data-mono-sm text-data-mono-sm text-outline">
                    Daily breakdown for October 2024 across 4 operational zones
                  </p>
                </div>
                <span className="font-data-mono-md text-data-mono-md font-bold text-tertiary">
                  MTTR: 1h 48m (TARGET &lt; 2h 30m)
                </span>
              </div>

              {/* Trend Chart SVG */}
              <div className="h-44 w-full bg-surface-container-lowest p- space-sm rounded border border-outline-variant/30 flex flex-col justify-end">
                <svg
                  className="w-full h-full text-primary"
                  viewBox="0 0 500 120"
                  preserveAspectRatio="none"
                >
                  <path
                    d="M 0 80 Q 50 60, 100 70 T 200 50 T 300 65 T 400 35 T 500 40"
                    stroke="#006194"
                    strokeWidth="3"
                    fill="none"
                  />
                  <path
                    d="M 0 80 Q 50 60, 100 70 T 200 50 T 300 65 T 400 35 T 500 40 L 500 120 L 0 120 Z"
                    fill="#006194"
                    fillOpacity="0.08"
                  />
                  {/* SLA threshold line */}
                  <line
                    x1="0"
                    y1="90"
                    x2="500"
                    y2="90"
                    stroke="#ba1a1a"
                    strokeDasharray="4 4"
                    strokeWidth="1.5"
                  />
                  <text x="410" y="85" fill="#ba1a1a" fontSize="9" fontFamily="JetBrains Mono">
                    SLA Max Limit (2h 30m)
                  </text>
                </svg>
                <div className="flex justify-between font-data-mono-sm text-[10px] text-outline px-2 pt-1 border-t border-surface-container">
                  <span>Oct 1</span>
                  <span>Oct 8</span>
                  <span>Oct 15</span>
                  <span>Oct 22</span>
                  <span>Oct 31</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Official Supervisory Sign-Off & Verification */}
      <div className="bg-surface-container-lowest p-space-lg rounded-lg shadow-sm border border-outline-variant/20 flex flex-col md:flex-row items-start md:items-center justify-between gap-space-lg">
        <div className="flex items-start gap-space-md">
          <div className="w-16 h-16 rounded-lg bg-surface-container-low border border-outline-variant/40 flex items-center justify-center p-2 text-center">
            <span className="material-symbols-outlined text-[36px] text-primary">gavel</span>
          </div>
          <div>
            <div className="flex items-center gap-space-xs">
              <span className="font-label-caps text-label-caps uppercase text-primary font-bold">
                State Utility Certification Board
              </span>
              <span className="font-data-mono-sm text-data-mono-sm text-tertiary font-bold">
                • VERIFIED
              </span>
            </div>
            <h3 className="font-headline-sm text-headline-sm text-on-surface">
              Supervisory Attestation & Electronic Seal
            </h3>
            <p className="font-body-sm text-body-sm text-on-surface-variant max-w-xl">
              I hereby certify that the hydraulic inflow, non-revenue balance, and water quality
              telemetry represented in this dossier accurately reflect the audited SCADA registry.
            </p>
            <div className="flex items-center gap-space-md mt-2 font-data-mono-sm text-data-mono-sm text-outline">
              <span>Dr. Ronald Vance, PE (Hydraulic Board)</span>
              <span>•</span>
              <span>Elena Novak, REHS (Environmental Health)</span>
            </div>
          </div>
        </div>

        <div className="flex flex-col items-end gap-2 w-full md:w-auto">
          {isSigned ? (
            <div className="bg-tertiary-fixed/30 border border-tertiary p-space-sm rounded-lg text-right">
              <span className="font-label-caps text-label-caps text-tertiary font-bold flex items-center gap-1 justify-end">
                <span className="material-symbols-outlined text-[16px]">verified_user</span> DIGITALLY SEALED
              </span>
              <p className="font-data-mono-sm text-data-mono-sm text-on-surface font-semibold">
                Signed by: {signerName}
              </p>
              <p className="font-data-mono-sm text-[10px] text-outline">
                SHA256: 4e82b7c9...a19f (Verified)
              </p>
            </div>
          ) : (
            <button
              onClick={() => setIsSigned(true)}
              className="w-full md:w-auto px-space-lg py-2.5 bg-primary text-on-primary hover:bg-primary-container rounded-lg font-body-sm text-body-sm font-semibold shadow-sm transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <span className="material-symbols-outlined text-[18px]">draw</span>
              <span>Digitally Sign & Seal Dossier</span>
            </button>
          )}
        </div>
      </div>

      {/* Historical Compliance Dossiers Archive Table */}
      <div className="bg-surface-container-lowest p-space-md rounded-lg shadow-sm border border-outline-variant/20 flex flex-col gap-space-md">
        <div className="flex items-center justify-between border-b border-surface-container pb-space-xs">
          <div className="flex items-center gap-space-xs">
            <span className="material-symbols-outlined text-primary text-[20px]">folder_special</span>
            <h3 className="font-headline-sm text-headline-sm text-on-surface">
              Archived Compliance Dossiers
            </h3>
          </div>
          <span className="font-label-caps text-label-caps text-outline">STATE RETENTION: 7 YEARS</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left font-body-sm text-body-sm">
            <thead className="bg-surface-container-low text-on-surface-variant font-label-caps text-label-caps uppercase">
              <tr>
                <th className="p-2.5 rounded-l">Audit Period</th>
                <th className="p-2.5">Filing Classification</th>
                <th className="p-2.5">Inflow Vol.</th>
                <th className="p-2.5">NRW Rate</th>
                <th className="p-2.5">EPA Compliance</th>
                <th className="p-2.5">Status</th>
                <th className="p-2.5 rounded-r text-right">Download</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-container text-on-surface font-data-mono-sm text-data-mono-sm">
              {ARCHIVED_DOSSIERS.map((item, idx) => (
                <tr key={idx} className="hover:bg-surface-container-low/60 transition-colors">
                  <td className="p-2.5 font-body-sm text-body-sm font-semibold text-on-surface">
                    {item.period}
                  </td>
                  <td className="p-2.5 text-on-surface-variant">{item.auditType}</td>
                  <td className="p-2.5 font-bold">{item.inflowVolume}</td>
                  <td className="p-2.5 text-secondary font-bold">{item.nrwRate}</td>
                  <td className="p-2.5 text-tertiary font-bold">{item.epaCompliance}</td>
                  <td className="p-2.5">
                    <span className="bg-tertiary-fixed/40 text-tertiary px-2 py-0.5 rounded font-label-caps text-[10px] font-bold">
                      {item.status}
                    </span>
                  </td>
                  <td className="p-2.5 text-right">
                    <button
                      onClick={handleDownloadCsv}
                      className="text-primary hover:underline font-semibold cursor-pointer"
                    >
                      Download PDF/CSV
                    </button>
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
