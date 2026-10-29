import { useState, useMemo, useRef, useEffect } from 'react';
import {
  SimulationInputs,
  DEFAULT_SIMULATION_INPUTS,
  runWealthSimulation,
  formatINR,
  LayoffScenario,
} from './utils/financialEngine';
import {
  exportToExcelWorkbook,
  generateExecutivePdfReport,
} from './utils/exportSuite';
import { ControlSidebar } from './components/ControlSidebar';
import { OnboardingWizardModal } from './components/OnboardingWizardModal';
import { DashboardCharts } from './components/DashboardCharts';
import { PerksComparatorAndLedger } from './components/PerksComparatorAndLedger';
import {
  Sun,
  Moon,
  FileText,
  FileSpreadsheet,
  SlidersHorizontal,
} from 'lucide-react';

export default function App() {
  const [inputs, setInputs] = useState<SimulationInputs>(DEFAULT_SIMULATION_INPUTS);
  const [isDark, setIsDark] = useState<boolean>(false);
  const [isWizardOpen, setIsWizardOpen] = useState<boolean>(false);
  const [isExportingPdf, setIsExportingPdf] = useState<boolean>(false);

  const dashboardSnapshotRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const root = document.documentElement;
    if (isDark) {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  }, [isDark]);

  const summary = useMemo(() => runWealthSimulation(inputs), [inputs]);

  const handleReset = () => {
    setInputs(DEFAULT_SIMULATION_INPUTS);
  };

  const handleExportExcel = () => {
    exportToExcelWorkbook(inputs, summary);
  };

  const handleExportPdf = async () => {
    setIsExportingPdf(true);
    try {
      await generateExecutivePdfReport(
        inputs,
        summary,
        dashboardSnapshotRef.current
      );
    } finally {
      setIsExportingPdf(false);
    }
  };

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <div className="min-h-screen bg-[#f6f6f4] dark:bg-[#09090b] text-zinc-950 dark:text-zinc-100 transition-colors">
      {/* STRICT 3-ZONE TOP BAR CONTRACT */}
      <header className="sticky top-0 z-30 flex items-center justify-between gap-8 px-6 py-3.5 border-b border-zinc-300 dark:border-zinc-800 bg-white dark:bg-[#09090b]">
        {/* Zone 1: Single text element wordmark */}
        <a
          href="#overview-section"
          onClick={(e) => {
            e.preventDefault();
            scrollToSection('overview-section');
          }}
          className="text-lg font-bold tracking-tight text-zinc-950 dark:text-white whitespace-nowrap shrink-0 font-display"
        >
          Gov vs. Corp
        </a>

        {/* Zone 2: 5 concise single-line text navigation links */}
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-zinc-600 dark:text-zinc-400">
          <a
            href="#overview-section"
            onClick={(e) => {
              e.preventDefault();
              scrollToSection('overview-section');
            }}
            className="hover:text-zinc-950 dark:hover:text-white hover:underline underline-offset-4 transition-colors whitespace-nowrap shrink-0"
          >
            Overview
          </a>
          <a
            href="#trajectory-section"
            onClick={(e) => {
              e.preventDefault();
              scrollToSection('trajectory-section');
            }}
            className="hover:text-zinc-950 dark:hover:text-white hover:underline underline-offset-4 transition-colors whitespace-nowrap shrink-0"
          >
            Salary &amp; Wealth
          </a>
          <a
            href="#retirement-section"
            onClick={(e) => {
              e.preventDefault();
              scrollToSection('retirement-section');
            }}
            className="hover:text-zinc-950 dark:hover:text-white hover:underline underline-offset-4 transition-colors whitespace-nowrap shrink-0"
          >
            Retirement &amp; NPS
          </a>
          <a
            href="#perks-section"
            onClick={(e) => {
              e.preventDefault();
              scrollToSection('perks-section');
            }}
            className="hover:text-zinc-950 dark:hover:text-white hover:underline underline-offset-4 transition-colors whitespace-nowrap shrink-0"
          >
            Perks Matrix
          </a>
          <a
            href="#ledger-section"
            onClick={(e) => {
              e.preventDefault();
              scrollToSection('ledger-section');
            }}
            className="hover:text-zinc-950 dark:hover:text-white hover:underline underline-offset-4 transition-colors whitespace-nowrap shrink-0"
          >
            Annual Ledger
          </a>
        </nav>

        {/* Zone 3: 1 Primary Action Button */}
        <div className="flex items-center shrink-0">
          <button
            type="button"
            onClick={() => setIsWizardOpen(true)}
            className="inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold text-white bg-zinc-950 hover:bg-zinc-800 dark:bg-white dark:text-zinc-950 dark:hover:bg-zinc-200 rounded-md transition-colors whitespace-nowrap shrink-0 cursor-pointer"
          >
            <SlidersHorizontal className="w-3.5 h-3.5" />
            Configure Wizard
          </button>
        </div>
      </header>

      {/* MAIN WORKSPACE CANVAS: LEFT CONTROL SIDEBAR + RIGHT ANALYTICS VIEWPORT */}
      <div className="flex flex-col lg:flex-row max-w-[1600px] mx-auto">
        {/* Editable Control Sidebar with Dropdowns & Text Entry Boxes */}
        <ControlSidebar
          inputs={inputs}
          onChange={setInputs}
          onReset={handleReset}
          onOpenWizard={() => setIsWizardOpen(true)}
        />

        {/* Primary Dashboard Viewport */}
        <main className="flex-1 min-w-0 p-4 sm:p-6 lg:p-8 space-y-6">
          {/* WORKSPACE TOOLBAR & CONTEXT BANNER */}
          <div
            id="overview-section"
            className="flex flex-col xl:flex-row xl:items-center justify-between gap-4 pb-5 border-b border-zinc-300 dark:border-zinc-800"
          >
            <div>
              <div className="text-xs font-medium text-zinc-600 dark:text-zinc-400 mb-1">
                <span>7th CPC Pay Matrix (Level {inputs.govPayLevel})</span>
                <span className="mx-1.5" aria-hidden="true">
                  ·
                </span>
                <span>{inputs.govRetirementScheme} Pension</span>
                <span className="mx-1.5" aria-hidden="true">
                  ·
                </span>
                <span>Private CTC {formatINR(inputs.pvtCurrentCTC)}</span>
                <span className="mx-1.5" aria-hidden="true">
                  ·
                </span>
                <span>
                  Age {inputs.currentAge} to {inputs.lifeExpectancy} Horizon
                </span>
              </div>
              <h1
                className="text-2xl sm:text-3xl font-bold tracking-tight text-zinc-950 dark:text-white"
                style={{ textWrap: 'balance' }}
              >
                Indian Government vs. Private Career Wealth Simulator
              </h1>
            </div>

            {/* Interactive Controls: Valuation Dropdown, Export & Theme */}
            <div className="flex flex-wrap items-center gap-2.5">
              {/* Valuation Mode Dropdown */}
              <select
                value={inputs.valueMode}
                onChange={(e) =>
                  setInputs({
                    ...inputs,
                    valueMode: e.target.value as 'nominal' | 'real',
                  })
                }
                aria-label="Valuation Display Mode"
                className="rounded-md border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 px-3 py-2 text-xs font-semibold text-zinc-950 dark:text-white cursor-pointer"
              >
                <option value="nominal">Future Value (Nominal ₹)</option>
                <option value="real">Today&apos;s Purchasing Power (Real ₹)</option>
              </select>

              {/* Quick Export Actions */}
              <button
                type="button"
                onClick={handleExportExcel}
                className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold rounded-md border border-[#86efac] dark:border-[#14532d] bg-[#dcfce7] dark:bg-[#052e16]/60 text-[#14532d] dark:text-[#86efac] hover:opacity-90 transition-opacity whitespace-nowrap shrink-0 cursor-pointer"
              >
                <FileSpreadsheet className="w-3.5 h-3.5" />
                Excel (.xlsx)
              </button>

              <button
                type="button"
                onClick={handleExportPdf}
                disabled={isExportingPdf}
                className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold rounded-md border border-[#93c5fd] dark:border-[#1e3a8a] bg-[#dbeafe] dark:bg-[#172554]/60 text-[#1e3a8a] dark:text-[#93c5fd] hover:opacity-90 transition-opacity whitespace-nowrap shrink-0 cursor-pointer"
              >
                <FileText className="w-3.5 h-3.5" />
                {isExportingPdf ? 'Exporting...' : 'PDF Report'}
              </button>

              {/* Light / Black Theme Toggle */}
              <button
                type="button"
                onClick={() => setIsDark(!isDark)}
                aria-label="Toggle color theme"
                className="p-2 rounded-md border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-zinc-800 dark:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors cursor-pointer"
              >
                {isDark ? (
                  <Sun className="w-4 h-4" />
                ) : (
                  <Moon className="w-4 h-4" />
                )}
              </button>
            </div>
          </div>

          {/* SNAPSHOT WRAPPER FOR PDF CAPTURE */}
          <div ref={dashboardSnapshotRef} className="space-y-6">
            {/* TOP ROW: 4 KPI SUMMARY CARDS (LIGHT GREEN, LIGHT BLUE, LIGHT RED, CRISP WHITE/BLACK) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
              {/* KPI 1: Government Path Summary (Light Green Surface) */}
              <div className="rounded-lg border border-[#86efac] dark:border-[#14532d] bg-[#f0fdf4] dark:bg-[#052e16]/35 p-5 flex flex-col justify-between">
                <div>
                  <div className="text-xs font-bold text-[#14532d] dark:text-[#86efac]">
                    Government Career (Level {inputs.govPayLevel} · {inputs.govRetirementScheme})
                  </div>
                  <div className="mt-3 space-y-2">
                    <div className="flex items-baseline justify-between">
                      <span className="text-xs text-zinc-700 dark:text-zinc-300">
                        Corpus at Age 60
                      </span>
                      <span className="text-xl font-bold font-mono tabular-nums text-zinc-950 dark:text-white">
                        {formatINR(summary.govCorpusAt60)}
                      </span>
                    </div>
                    <div className="flex items-baseline justify-between">
                      <span className="text-xs text-zinc-700 dark:text-zinc-300">
                        Lifetime Post-Tax Pay
                      </span>
                      <span className="text-sm font-bold font-mono tabular-nums text-[#15803d] dark:text-[#86efac]">
                        {formatINR(summary.govLifetimeEarningsPostTax)}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="mt-4 pt-3 border-t border-[#bbf7d0] dark:border-[#14532d] text-[11px] text-[#166534] dark:text-[#86efac] font-mono tabular-nums">
                  Yr-1 In-Hand: {formatINR(summary.records[0].govMonthlyNetInHand)}/m · Pension:{' '}
                  {formatINR(summary.govMonthlyPensionAt60)}/m
                </div>
              </div>

              {/* KPI 2: Private Sector Summary (Light Blue Surface) */}
              <div className="rounded-lg border border-[#93c5fd] dark:border-[#1e3a8a] bg-[#eff6ff] dark:bg-[#172554]/35 p-5 flex flex-col justify-between">
                <div>
                  <div className="text-xs font-bold text-[#1e3a8a] dark:text-[#93c5fd]">
                    Private Sector Career (CTC {formatINR(inputs.pvtCurrentCTC)})
                  </div>
                  <div className="mt-3 space-y-2">
                    <div className="flex items-baseline justify-between">
                      <span className="text-xs text-zinc-700 dark:text-zinc-300">
                        Corpus at Age 60
                      </span>
                      <span className="text-xl font-bold font-mono tabular-nums text-zinc-950 dark:text-white">
                        {formatINR(summary.pvtCorpusAt60)}
                      </span>
                    </div>
                    <div className="flex items-baseline justify-between">
                      <span className="text-xs text-zinc-700 dark:text-zinc-300">
                        Lifetime Post-Tax Pay
                      </span>
                      <span className="text-sm font-bold font-mono tabular-nums text-[#1d4ed8] dark:text-[#93c5fd]">
                        {formatINR(summary.pvtLifetimeEarningsPostTax)}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="mt-4 pt-3 border-t border-[#bfdbfe] dark:border-[#1e3a8a] text-[11px] text-[#1e40af] dark:text-[#93c5fd] font-mono tabular-nums">
                  Yr-1 In-Hand: {formatINR(summary.records[0].pvtMonthlyNetInHand)}/m · Final:{' '}
                  {formatINR(summary.pvtFinalMonthlyInHand)}/m
                </div>
              </div>

              {/* KPI 3: Crossover Age & Stress Risk (Light Red Surface) */}
              <div className="rounded-lg border border-[#fda4af] dark:border-[#881337] bg-[#fff1f2] dark:bg-[#4c0519]/30 p-5 flex flex-col justify-between">
                <div>
                  <div className="text-xs font-bold text-[#881337] dark:text-[#fda4af]">
                    Net Worth Crossover &amp; Risk Point
                  </div>
                  <div className="mt-3">
                    <div className="text-2xl font-bold font-mono tabular-nums text-zinc-950 dark:text-white">
                      {summary.crossoverAge
                        ? `Age ${summary.crossoverAge}`
                        : 'No Crossover'}
                    </div>
                    <p className="text-xs text-zinc-700 dark:text-zinc-300 mt-1">
                      {summary.crossoverAge
                        ? summary.crossoverDirection === 'GovOvertakesPvt'
                          ? `Govt overtakes Private net worth at Age ${summary.crossoverAge}.`
                          : `Private overtakes Govt net worth at Age ${summary.crossoverAge}.`
                        : `${summary.winnerAt60} path leads across the entire career horizon.`}
                    </p>
                  </div>
                </div>
                <div className="mt-4 pt-3 border-t border-[#fecdd3] dark:border-[#881337] text-[11px] text-[#9f1239] dark:text-[#fda4af] font-mono tabular-nums">
                  Age 80 Survival: Govt {formatINR(summary.govCorpusAt80)} · Pvt{' '}
                  {formatINR(summary.pvtCorpusAt80)}
                </div>
              </div>

              {/* KPI 4: Dynamic Winner Verdict (Crisp Black & White Surface) */}
              <div className="rounded-lg border border-zinc-950 dark:border-zinc-300 bg-zinc-950 text-white dark:bg-white dark:text-zinc-950 p-5 flex flex-col justify-between">
                <div>
                  <div className="text-xs font-semibold text-zinc-400 dark:text-zinc-500">
                    Financial Trajectory Verdict
                  </div>
                  <div className="mt-3">
                    <div className="text-xl font-bold">
                      {summary.winnerAt60} Wins at Age 60
                    </div>
                    <div className="text-xs font-mono tabular-nums text-zinc-300 dark:text-zinc-700 mt-1">
                      Net Worth Lead: +{formatINR(summary.wealthDeltaAt60)}
                    </div>
                  </div>
                </div>
                <div className="mt-4 pt-3 border-t border-zinc-800 dark:border-zinc-200 text-[11px] text-zinc-300 dark:text-zinc-600">
                  Age {inputs.lifeExpectancy} Winner:{' '}
                  <strong className="text-white dark:text-zinc-950">
                    {summary.winnerAt80}
                  </strong>{' '}
                  by{' '}
                  <span className="font-mono tabular-nums">
                    {formatINR(summary.wealthDeltaAt80)}
                  </span>
                </div>
              </div>
            </div>

            {/* STRESS TEST / LAYOFF SIMULATOR BAR (WITH DROPDOWN SELECTOR) */}
            <div className="rounded-lg border border-zinc-300 dark:border-zinc-800 bg-white dark:bg-[#0c0c0e] p-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <div className="text-xs font-bold text-zinc-950 dark:text-white">
                  Private Sector Stress Test &amp; Layoff Shock Simulator
                </div>
                <p className="text-xs text-zinc-600 dark:text-zinc-400 mt-0.5">
                  Simulate 1 or 2 six-month career breaks/layoffs in the private sector (pauses SIP &amp; EPF, forfeits bonus, and draws emergency living expenses)
                  {inputs.layoffScenario !== 'none' && (
                    <span className="ml-2 px-2 py-0.5 rounded bg-[#ffe4e6] text-[#9f1239] font-mono tabular-nums font-bold">
                      Compounded Corpus Loss: -{formatINR(summary.layoffWealthImpact)}
                    </span>
                  )}
                </p>
              </div>

              <div className="flex items-center gap-2 shrink-0 self-start md:self-auto">
                <label className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">
                  Layoff Scenario:
                </label>
                <select
                  value={inputs.layoffScenario}
                  onChange={(e) =>
                    setInputs({
                      ...inputs,
                      layoffScenario: e.target.value as LayoffScenario,
                    })
                  }
                  className="rounded-md border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 px-3 py-1.5 text-xs font-semibold text-zinc-950 dark:text-white cursor-pointer"
                >
                  <option value="none">0 Layoffs (Uninterrupted Career)</option>
                  <option value="one">1 Career Break (6 Months at Age 32)</option>
                  <option value="two">2 Career Breaks (6 Months at Age 32 &amp; 40)</option>
                </select>
              </div>
            </div>

            {/* PRIMARY INTERACTIVE CHARTS */}
            <DashboardCharts inputs={inputs} summary={summary} isDark={isDark} />
          </div>

          {/* INTANGIBLE PERKS COMPARATOR & YEAR-BY-YEAR DATA LEDGER */}
          <PerksComparatorAndLedger
            inputs={inputs}
            summary={summary}
            onExportExcel={handleExportExcel}
            onExportPdf={handleExportPdf}
            isExportingPdf={isExportingPdf}
          />

          {/* QUIET EDITORIAL FOOTER */}
          <footer className="pt-6 pb-8 border-t border-zinc-300 dark:border-zinc-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-zinc-600 dark:text-zinc-400">
            <div>
              Gov vs. Corp: Indian Career Wealth Simulator · 7th CPC Pay Matrix, PFRDA Auto-Choice &amp; FY 2025-26 New Tax Regime Engine
            </div>
            <div className="flex items-center gap-4">
              <button
                type="button"
                onClick={handleReset}
                className="font-semibold hover:text-zinc-950 dark:hover:text-white transition-colors cursor-pointer"
              >
                Reset Parameters
              </button>
              <span aria-hidden="true">·</span>
              <button
                type="button"
                onClick={handleExportExcel}
                className="font-semibold hover:text-zinc-950 dark:hover:text-white transition-colors cursor-pointer"
              >
                Download .XLSX
              </button>
            </div>
          </footer>
        </main>
      </div>

      {/* 3-Step Guided Configuration Wizard Modal */}
      <OnboardingWizardModal
        isOpen={isWizardOpen}
        inputs={inputs}
        onChange={setInputs}
        onClose={() => setIsWizardOpen(false)}
      />
    </div>
  );
}
