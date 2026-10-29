import React, { useState } from 'react';
import {
  SimulationInputs,
  CityTier,
  RetirementScheme,
  NPSAllocationMode,
  getHraPercentage,
  getBaseTransportAllowance,
} from '../utils/financialEngine';
import { CPC_PAY_MATRIX, CAREER_PRESETS, CareerPreset } from '../data/cpcMatrix';
import { RotateCcw } from 'lucide-react';

interface ControlSidebarProps {
  inputs: SimulationInputs;
  onChange: (updated: SimulationInputs) => void;
  onReset: () => void;
  onOpenWizard: () => void;
}

export const ControlSidebar: React.FC<ControlSidebarProps> = ({
  inputs,
  onChange,
  onReset,
  onOpenWizard,
}) => {
  const [activeTab, setActiveTab] = useState<'gov' | 'pvt' | 'macro'>('gov');

  const currentLevelData =
    CPC_PAY_MATRIX.find((l) => l.level === inputs.govPayLevel) || CPC_PAY_MATRIX[9];
  const matrixBasic =
    currentLevelData.cells[Math.min(inputs.govCellIndex, currentLevelData.cells.length - 1)] ||
    56100;
  const effectiveBasic =
    inputs.govBasicOverride && inputs.govBasicOverride > 0
      ? inputs.govBasicOverride
      : matrixBasic;

  const currentHraPct = getHraPercentage(inputs.govCityTier, inputs.govCurrentDA);
  const currentBaseTA = getBaseTransportAllowance(inputs.govPayLevel, inputs.govCityTier, 1);

  const updateField = <K extends keyof SimulationInputs>(
    key: K,
    value: SimulationInputs[K]
  ) => {
    onChange({
      ...inputs,
      [key]: value,
    });
  };

  const applyPreset = (presetId: string) => {
    const preset: CareerPreset | undefined = CAREER_PRESETS.find((p) => p.id === presetId);
    if (!preset) return;
    onChange({
      ...inputs,
      govPayLevel: preset.govLevel,
      govCellIndex: preset.govCellIndex,
      govBasicOverride: null,
      govPromotionInterval: preset.govPromotionInterval,
      pvtCurrentCTC: preset.pvtStartingCTC,
      pvtBasicPct: preset.pvtBasicPercent,
      pvtVariablePct: preset.pvtVariablePercent,
      pvtAnnualAppraisalPct: preset.pvtAnnualAppraisal,
      pvtSwitchHikePct: preset.pvtSwitchHike,
    });
  };

  const currentPresetId =
    CAREER_PRESETS.find(
      (p) => p.govLevel === inputs.govPayLevel && p.pvtStartingCTC === inputs.pvtCurrentCTC
    )?.id || 'custom';

  const effectiveFitmentFactor = (
    (1 + inputs.govCurrentDA / 100) *
    (1 + inputs.govPayCommissionRealHikePct / 100)
  ).toFixed(2);

  const inputBoxClass =
    'w-full rounded-md border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 px-3 py-2 text-xs font-mono tabular-nums text-zinc-950 dark:text-zinc-100 focus:outline-none focus:border-zinc-950 dark:focus:border-white transition-colors';

  const selectBoxClass =
    'w-full rounded-md border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 px-3 py-2 text-xs font-medium text-zinc-950 dark:text-zinc-100 focus:outline-none focus:border-zinc-950 dark:focus:border-white transition-colors cursor-pointer';

  const labelClass = 'block text-[11px] font-semibold text-zinc-700 dark:text-zinc-300 mb-1';

  return (
    <aside className="w-full lg:w-[360px] xl:w-[380px] shrink-0 border-b lg:border-b-0 lg:border-r border-zinc-300 dark:border-zinc-800 bg-white dark:bg-[#0c0c0e] flex flex-col">
      {/* Header Bar */}
      <div className="p-4 border-b border-zinc-200 dark:border-zinc-800">
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-bold tracking-tight text-zinc-950 dark:text-white">
            Model Inputs &amp; Assumptions
          </span>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onOpenWizard}
              className="text-xs font-semibold text-zinc-900 dark:text-zinc-200 underline underline-offset-4 hover:text-blue-700 dark:hover:text-blue-300 whitespace-nowrap shrink-0 cursor-pointer"
            >
              Guided Form
            </button>
            <span className="text-zinc-300 dark:text-zinc-700" aria-hidden="true">
              |
            </span>
            <button
              type="button"
              onClick={onReset}
              title="Reset to default parameters"
              className="inline-flex items-center gap-1 text-xs font-medium text-zinc-500 hover:text-zinc-950 dark:hover:text-white transition-colors whitespace-nowrap shrink-0 cursor-pointer"
            >
              <RotateCcw className="w-3 h-3" />
              Reset
            </button>
          </div>
        </div>

        {/* Benchmark Profile Dropdown instead of cluttered cards */}
        <div className="mb-3">
          <label className={labelClass}>Benchmark Career Comparison Preset</label>
          <select
            value={currentPresetId}
            onChange={(e) => applyPreset(e.target.value)}
            className={selectBoxClass}
          >
            <option value="custom">Custom User Configuration</option>
            {CAREER_PRESETS.map((preset) => (
              <option key={preset.id} value={preset.id}>
                {preset.name}
              </option>
            ))}
          </select>
        </div>

        {/* 3-Section Tab Selector */}
        <div className="grid grid-cols-3 gap-1 p-1 bg-zinc-100 dark:bg-zinc-900 rounded-md border border-zinc-200 dark:border-zinc-800">
          <button
            type="button"
            onClick={() => setActiveTab('gov')}
            className={`py-1.5 px-2 text-xs font-semibold rounded transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
              activeTab === 'gov'
                ? 'bg-[#dcfce7] text-[#14532d] border border-[#86efac]'
                : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-950 dark:hover:text-white'
            }`}
          >
            1. Govt (CPC)
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('pvt')}
            className={`py-1.5 px-2 text-xs font-semibold rounded transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
              activeTab === 'pvt'
                ? 'bg-[#dbeafe] text-[#1e3a8a] border border-[#93c5fd]'
                : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-950 dark:hover:text-white'
            }`}
          >
            2. Private Job
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('macro')}
            className={`py-1.5 px-2 text-xs font-semibold rounded transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
              activeTab === 'macro'
                ? 'bg-zinc-950 text-white dark:bg-white dark:text-zinc-950'
                : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-950 dark:hover:text-white'
            }`}
          >
            3. Age &amp; Macro
          </button>
        </div>
      </div>

      {/* Form Controls Body */}
      <div className="p-4 space-y-4 overflow-y-auto max-h-[calc(100vh-185px)]">
        {/* TAB 1: GOVERNMENT (7th CPC) */}
        {activeTab === 'gov' && (
          <div className="space-y-4">
            <div className="p-3 rounded-md bg-[#f0fdf4] dark:bg-[#052e16]/40 border border-[#bbf7d0] dark:border-[#14532d] flex items-center justify-between">
              <div>
                <div className="text-[11px] font-semibold text-[#166534] dark:text-[#86efac]">
                  Starting Monthly Basic + DA
                </div>
                <div className="text-sm font-bold font-mono tabular-nums text-zinc-950 dark:text-white">
                  ₹{effectiveBasic.toLocaleString('en-IN')} + ₹
                  {Math.round((effectiveBasic * inputs.govCurrentDA) / 100).toLocaleString(
                    'en-IN'
                  )}{' '}
                  DA
                </div>
              </div>
              <div className="text-right font-mono tabular-nums text-[11px] text-[#15803d] dark:text-[#86efac]">
                <div>HRA: {currentHraPct}%</div>
                <div>TA: ₹{currentBaseTA}+DA</div>
              </div>
            </div>

            {/* Pay Matrix Level Dropdown */}
            <div>
              <label className={labelClass}>7th CPC Pay Level (Level 1 to 18)</label>
              <select
                value={inputs.govPayLevel}
                onChange={(e) => {
                  onChange({
                    ...inputs,
                    govPayLevel: Number(e.target.value),
                    govCellIndex: 0,
                    govBasicOverride: null,
                  });
                }}
                className={selectBoxClass}
              >
                {CPC_PAY_MATRIX.map((lvl) => (
                  <option key={lvl.level} value={lvl.level}>
                    {lvl.label} — Entry ₹{lvl.cells[0].toLocaleString('en-IN')}
                  </option>
                ))}
              </select>
              <p className="text-[11px] text-zinc-500 dark:text-zinc-400 mt-1">
                Typical Posts: {currentLevelData.typicalRoles}
              </p>
            </div>

            {/* Matrix Cell Dropdown + Direct Basic Pay Text Entry */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className={labelClass}>Pay Matrix Cell / Stage</label>
                <select
                  value={inputs.govCellIndex}
                  onChange={(e) =>
                    onChange({
                      ...inputs,
                      govCellIndex: Number(e.target.value),
                      govBasicOverride: null,
                    })
                  }
                  className={selectBoxClass}
                >
                  {currentLevelData.cells.map((cellVal, idx) => (
                    <option key={idx} value={idx}>
                      Cell {idx + 1} (₹{cellVal.toLocaleString('en-IN')})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className={labelClass}>Custom Basic Pay (₹/mo)</label>
                <div className="relative">
                  <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-xs font-mono text-zinc-400">
                    ₹
                  </span>
                  <input
                    type="number"
                    min={18000}
                    max={500000}
                    step={100}
                    value={effectiveBasic}
                    onChange={(e) =>
                      updateField('govBasicOverride', Number(e.target.value) || null)
                    }
                    className={`${inputBoxClass} pl-6`}
                  />
                </div>
              </div>
            </div>

            {/* Current DA % Box, Bi-Annual DA Hike Dropdown, and City Tier Dropdown */}
            <div className="grid grid-cols-2 gap-3 pt-3 border-t border-zinc-200 dark:border-zinc-800">
              <div>
                <label className={labelClass}>Current DA Rate (%)</label>
                <div className="relative">
                  <input
                    type="number"
                    min={0}
                    max={120}
                    step={1}
                    value={inputs.govCurrentDA}
                    onChange={(e) =>
                      updateField(
                        'govCurrentDA',
                        Math.max(0, Math.min(120, Number(e.target.value) || 0))
                      )
                    }
                    className={`${inputBoxClass} pr-7`}
                  />
                  <span className="absolute right-2.5 top-1/2 -translate-y-1/2 text-xs font-mono text-zinc-400">
                    %
                  </span>
                </div>
              </div>

              <div>
                <label className={labelClass}>Bi-Annual DA Hike (Jan/Jul)</label>
                <select
                  value={inputs.govBiAnnualDaHike}
                  onChange={(e) => updateField('govBiAnnualDaHike', Number(e.target.value))}
                  className={selectBoxClass}
                >
                  <option value={2}>+2% / 6mo (+4% Annual)</option>
                  <option value={3}>+3% / 6mo (+6% Annual)</option>
                  <option value={3.5}>+3.5% / 6mo (+7% Annual)</option>
                  <option value={4}>+4% / 6mo (+8% Annual)</option>
                  <option value={5}>+5% / 6mo (+10% Annual)</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className={labelClass}>City Class (HRA &amp; TA)</label>
                <select
                  value={inputs.govCityTier}
                  onChange={(e) => updateField('govCityTier', e.target.value as CityTier)}
                  className={selectBoxClass}
                >
                  <option value="X">Class X Metro (30% HRA)</option>
                  <option value="Y">Class Y Tier-2 (20% HRA)</option>
                  <option value="Z">Class Z Other (10% HRA)</option>
                </select>
              </div>

              <div>
                <label className={labelClass}>Extra / Dept Allowance (%)</label>
                <div className="relative">
                  <input
                    type="number"
                    min={0}
                    max={50}
                    step={1}
                    value={inputs.govSpecialAllowancePct}
                    onChange={(e) =>
                      updateField(
                        'govSpecialAllowancePct',
                        Math.max(0, Math.min(50, Number(e.target.value) || 0))
                      )
                    }
                    className={`${inputBoxClass} pr-7`}
                  />
                  <span className="absolute right-2.5 top-1/2 -translate-y-1/2 text-xs font-mono text-zinc-400">
                    %
                  </span>
                </div>
              </div>
            </div>

            {/* Promotions & 10-Year Pay Commission Fitment */}
            <div className="pt-3 border-t border-zinc-200 dark:border-zinc-800 space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className={labelClass}>Promotion / MACP Cycle</label>
                  <select
                    value={inputs.govPromotionInterval}
                    onChange={(e) =>
                      updateField('govPromotionInterval', Number(e.target.value))
                    }
                    className={selectBoxClass}
                  >
                    <option value={5}>Every 5 Yrs (Fast Cadre)</option>
                    <option value={8}>Every 8 Yrs (Group-A Avg)</option>
                    <option value={10}>Every 10 Yrs (MACP Rule)</option>
                    <option value={12}>Every 12 Yrs (Slow)</option>
                  </select>
                </div>

                <div>
                  <label className={labelClass}>Annual Matrix Increment</label>
                  <select
                    value={inputs.govAnnualIncrementPct}
                    onChange={(e) =>
                      updateField('govAnnualIncrementPct', Number(e.target.value))
                    }
                    className={selectBoxClass}
                  >
                    <option value={3}>3.0% (Standard 7th CPC)</option>
                    <option value={3.5}>3.5% (Enhanced)</option>
                    <option value={4}>4.0% (High Progression)</option>
                  </select>
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-[11px] font-semibold text-zinc-700 dark:text-zinc-300">
                    10-Year Pay Commission Real Basic Jump (%)
                  </label>
                  <span className="text-[11px] font-mono tabular-nums text-[#15803d] dark:text-[#86efac]">
                    ~{effectiveFitmentFactor}x Fitment on Basic
                  </span>
                </div>
                <div className="grid grid-cols-12 gap-2">
                  <div className="col-span-7">
                    <select
                      value={inputs.govPayCommissionRealHikePct}
                      onChange={(e) =>
                        updateField('govPayCommissionRealHikePct', Number(e.target.value))
                      }
                      className={selectBoxClass}
                    >
                      <option value={14}>+14% Real Jump (Conservative)</option>
                      <option value={20}>+20% Real Jump (7th CPC Benchmark)</option>
                      <option value={25}>+25% Real Jump (Optimistic)</option>
                      <option value={30}>+30% Real Jump (6th CPC Style)</option>
                    </select>
                  </div>
                  <div className="col-span-5 relative">
                    <input
                      type="number"
                      min={5}
                      max={50}
                      value={inputs.govPayCommissionRealHikePct}
                      onChange={(e) =>
                        updateField(
                          'govPayCommissionRealHikePct',
                          Math.max(0, Math.min(50, Number(e.target.value) || 0))
                        )
                      }
                      className={`${inputBoxClass} pr-6`}
                    />
                    <span className="absolute right-2.5 top-1/2 -translate-y-1/2 text-xs font-mono text-zinc-400">
                      %
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Pension Scheme Dropdown & Allocation */}
            <div className="pt-3 border-t border-zinc-200 dark:border-zinc-800 space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className={labelClass}>Retirement Pension Scheme</label>
                  <select
                    value={inputs.govRetirementScheme}
                    onChange={(e) =>
                      updateField('govRetirementScheme', e.target.value as RetirementScheme)
                    }
                    className={selectBoxClass}
                  >
                    <option value="UPS">UPS (50% Guaranteed Pension)</option>
                    <option value="NPS">NPS (10% + 14% Market Corpus)</option>
                  </select>
                </div>

                <div>
                  <label className={labelClass}>NPS Lifecycle Choice</label>
                  <select
                    value={inputs.npsAllocationMode}
                    onChange={(e) =>
                      updateField('npsAllocationMode', e.target.value as NPSAllocationMode)
                    }
                    className={selectBoxClass}
                  >
                    <option value="LC75">Auto LC75 (75% Equity Cap)</option>
                    <option value="LC50">Auto LC50 (50% Equity Cap)</option>
                    <option value="Active">Active Choice (Constant 75%)</option>
                  </select>
                </div>
              </div>

              {/* Voluntary SIP Box */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className={labelClass}>Personal SIP (% of Net Pay)</label>
                  <div className="relative">
                    <input
                      type="number"
                      min={0}
                      max={75}
                      step={1}
                      value={inputs.govSipPct}
                      onChange={(e) =>
                        updateField(
                          'govSipPct',
                          Math.max(0, Math.min(75, Number(e.target.value) || 0))
                        )
                      }
                      className={`${inputBoxClass} pr-7`}
                    />
                    <span className="absolute right-2.5 top-1/2 -translate-y-1/2 text-xs font-mono text-zinc-400">
                      %
                    </span>
                  </div>
                </div>

                <div>
                  <label className={labelClass}>MF SIP Expected CAGR (%)</label>
                  <div className="relative">
                    <input
                      type="number"
                      min={6}
                      max={20}
                      step={0.5}
                      value={inputs.govSipCagr}
                      onChange={(e) => {
                        const val = Math.max(4, Math.min(22, Number(e.target.value) || 12));
                        onChange({
                          ...inputs,
                          govSipCagr: val,
                          pvtSipCagr: val,
                        });
                      }}
                      className={`${inputBoxClass} pr-7`}
                    />
                    <span className="absolute right-2.5 top-1/2 -translate-y-1/2 text-xs font-mono text-zinc-400">
                      %
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: PRIVATE JOB PROFILE */}
        {activeTab === 'pvt' && (
          <div className="space-y-4">
            <div className="p-3 rounded-md bg-[#eff6ff] dark:bg-[#172554]/40 border border-[#bfdbfe] dark:border-[#1e3a8a] flex items-center justify-between">
              <div>
                <div className="text-[11px] font-semibold text-[#1e40af] dark:text-[#93c5fd]">
                  Starting Annual CTC Package
                </div>
                <div className="text-sm font-bold font-mono tabular-nums text-zinc-950 dark:text-white">
                  ₹{inputs.pvtCurrentCTC.toLocaleString('en-IN')} (
                  {(inputs.pvtCurrentCTC / 100000).toFixed(2)} LPA)
                </div>
              </div>
              <div className="text-right font-mono tabular-nums text-[11px] text-[#1d4ed8] dark:text-[#93c5fd]">
                <div>Basic: {inputs.pvtBasicPct}%</div>
                <div>EPF: {inputs.pvtEpfRate}%</div>
              </div>
            </div>

            {/* Direct CTC Entry in Lakhs or Rupees */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className={labelClass}>Annual CTC (in ₹ Rupees)</label>
                <div className="relative">
                  <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-xs font-mono text-zinc-400">
                    ₹
                  </span>
                  <input
                    type="number"
                    min={300000}
                    max={20000000}
                    step={50000}
                    value={inputs.pvtCurrentCTC}
                    onChange={(e) =>
                      updateField(
                        'pvtCurrentCTC',
                        Math.max(100000, Number(e.target.value) || 0)
                      )
                    }
                    className={`${inputBoxClass} pl-6`}
                  />
                </div>
              </div>

              <div>
                <label className={labelClass}>Quick CTC Package Tier</label>
                <select
                  value={inputs.pvtCurrentCTC}
                  onChange={(e) => updateField('pvtCurrentCTC', Number(e.target.value))}
                  className={selectBoxClass}
                >
                  <option value={600000}>₹6.0 LPA (Entry IT / Support)</option>
                  <option value={900000}>₹9.0 LPA (Analyst / Core Eng)</option>
                  <option value={1200000}>₹12.0 LPA (Mid-Tier Tech)</option>
                  <option value={1800000}>₹18.0 LPA (Product SDE / MBA)</option>
                  <option value={2400000}>₹24.0 LPA (Tier-1 SDE-1)</option>
                  <option value={3600000}>₹36.0 LPA (FAANG / Quant)</option>
                  <option value={5000000}>₹50.0 LPA (Senior Tech / VP)</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className={labelClass}>Basic Pay (% of CTC)</label>
                <div className="relative">
                  <input
                    type="number"
                    min={30}
                    max={70}
                    step={1}
                    value={inputs.pvtBasicPct}
                    onChange={(e) =>
                      updateField(
                        'pvtBasicPct',
                        Math.max(25, Math.min(75, Number(e.target.value) || 45))
                      )
                    }
                    className={`${inputBoxClass} pr-7`}
                  />
                  <span className="absolute right-2.5 top-1/2 -translate-y-1/2 text-xs font-mono text-zinc-400">
                    %
                  </span>
                </div>
              </div>

              <div>
                <label className={labelClass}>Variable / Bonus (% of CTC)</label>
                <div className="relative">
                  <input
                    type="number"
                    min={0}
                    max={40}
                    step={1}
                    value={inputs.pvtVariablePct}
                    onChange={(e) =>
                      updateField(
                        'pvtVariablePct',
                        Math.max(0, Math.min(45, Number(e.target.value) || 0))
                      )
                    }
                    className={`${inputBoxClass} pr-7`}
                  />
                  <span className="absolute right-2.5 top-1/2 -translate-y-1/2 text-xs font-mono text-zinc-400">
                    %
                  </span>
                </div>
              </div>
            </div>

            {/* Appraisals & Job Switches */}
            <div className="pt-3 border-t border-zinc-200 dark:border-zinc-800 space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className={labelClass}>Annual Appraisal Hike (%)</label>
                  <div className="relative">
                    <input
                      type="number"
                      min={2}
                      max={25}
                      step={0.5}
                      value={inputs.pvtAnnualAppraisalPct}
                      onChange={(e) =>
                        updateField(
                          'pvtAnnualAppraisalPct',
                          Math.max(0, Math.min(30, Number(e.target.value) || 8))
                        )
                      }
                      className={`${inputBoxClass} pr-7`}
                    />
                    <span className="absolute right-2.5 top-1/2 -translate-y-1/2 text-xs font-mono text-zinc-400">
                      %
                    </span>
                  </div>
                </div>

                <div>
                  <label className={labelClass}>Hike per Job Switch (%)</label>
                  <div className="relative">
                    <input
                      type="number"
                      min={10}
                      max={80}
                      step={5}
                      value={inputs.pvtSwitchHikePct}
                      onChange={(e) =>
                        updateField(
                          'pvtSwitchHikePct',
                          Math.max(0, Math.min(100, Number(e.target.value) || 30))
                        )
                      }
                      className={`${inputBoxClass} pr-7`}
                    />
                    <span className="absolute right-2.5 top-1/2 -translate-y-1/2 text-xs font-mono text-zinc-400">
                      %
                    </span>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className={labelClass}>Planned Job Switches</label>
                  <select
                    value={inputs.pvtTotalSwitches}
                    onChange={(e) => updateField('pvtTotalSwitches', Number(e.target.value))}
                    className={selectBoxClass}
                  >
                    <option value={0}>0 Switches (Single Firm)</option>
                    <option value={1}>1 Career Switch</option>
                    <option value={2}>2 Career Switches</option>
                    <option value={3}>3 Career Switches</option>
                    <option value={4}>4 Career Switches</option>
                    <option value={5}>5 Career Switches</option>
                  </select>
                </div>

                <div>
                  <label className={labelClass}>Gap Between Switches</label>
                  <select
                    value={inputs.pvtSwitchIntervalYears}
                    onChange={(e) =>
                      updateField('pvtSwitchIntervalYears', Number(e.target.value))
                    }
                    className={selectBoxClass}
                  >
                    <option value={2}>Every 2 Years</option>
                    <option value={3}>Every 3 Years</option>
                    <option value={4}>Every 4 Years</option>
                    <option value={5}>Every 5 Years</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className={labelClass}>Career Plateau Age</label>
                  <select
                    value={inputs.pvtPlateauAge}
                    onChange={(e) => updateField('pvtPlateauAge', Number(e.target.value))}
                    className={selectBoxClass}
                  >
                    <option value={40}>Age 40 (Early Compression)</option>
                    <option value={45}>Age 45 (Standard Industry)</option>
                    <option value={50}>Age 50 (Late Plateau)</option>
                    <option value={55}>Age 55 (Executive Track)</option>
                  </select>
                </div>

                <div>
                  <label className={labelClass}>Target Retirement Age</label>
                  <select
                    value={inputs.pvtRetirementAge}
                    onChange={(e) => updateField('pvtRetirementAge', Number(e.target.value))}
                    className={selectBoxClass}
                  >
                    <option value={50}>Age 50 (Early FIRE)</option>
                    <option value={55}>Age 55 (Mid-50s Exit)</option>
                    <option value={58}>Age 58 (Standard Corporate)</option>
                    <option value={60}>Age 60 (Match Govt Age 60)</option>
                  </select>
                </div>
              </div>
            </div>

            {/* EPF & SIP Text Entry Boxes */}
            <div className="pt-3 border-t border-zinc-200 dark:border-zinc-800 grid grid-cols-2 gap-3">
              <div>
                <label className={labelClass}>EPF Interest Rate (%)</label>
                <div className="relative">
                  <input
                    type="number"
                    min={6}
                    max={10}
                    step={0.05}
                    value={inputs.pvtEpfRate}
                    onChange={(e) =>
                      updateField(
                        'pvtEpfRate',
                        Math.max(5, Math.min(12, Number(e.target.value) || 8.15))
                      )
                    }
                    className={`${inputBoxClass} pr-7`}
                  />
                  <span className="absolute right-2.5 top-1/2 -translate-y-1/2 text-xs font-mono text-zinc-400">
                    %
                  </span>
                </div>
              </div>

              <div>
                <label className={labelClass}>Private SIP (% of Net Pay)</label>
                <div className="relative">
                  <input
                    type="number"
                    min={0}
                    max={75}
                    step={1}
                    value={inputs.pvtSipPct}
                    onChange={(e) =>
                      updateField(
                        'pvtSipPct',
                        Math.max(0, Math.min(75, Number(e.target.value) || 0))
                      )
                    }
                    className={`${inputBoxClass} pr-7`}
                  />
                  <span className="absolute right-2.5 top-1/2 -translate-y-1/2 text-xs font-mono text-zinc-400">
                    %
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: MACRO & HORIZON */}
        {activeTab === 'macro' && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className={labelClass}>Current Entry Age (Yrs)</label>
                <input
                  type="number"
                  min={20}
                  max={50}
                  value={inputs.currentAge}
                  onChange={(e) =>
                    updateField(
                      'currentAge',
                      Math.max(20, Math.min(50, Number(e.target.value) || 25))
                    )
                  }
                  className={inputBoxClass}
                />
              </div>

              <div>
                <label className={labelClass}>Life Expectancy Age</label>
                <select
                  value={inputs.lifeExpectancy}
                  onChange={(e) => updateField('lifeExpectancy', Number(e.target.value))}
                  className={selectBoxClass}
                >
                  <option value={75}>Age 75 (15 Yrs Post-Ret.)</option>
                  <option value={80}>Age 80 (20 Yrs Post-Ret.)</option>
                  <option value={85}>Age 85 (25 Yrs Post-Ret.)</option>
                  <option value={90}>Age 90 (30 Yrs Post-Ret.)</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className={labelClass}>Annual CPI Inflation (%)</label>
                <div className="relative">
                  <input
                    type="number"
                    min={2}
                    max={12}
                    step={0.5}
                    value={inputs.inflationRate}
                    onChange={(e) =>
                      updateField(
                        'inflationRate',
                        Math.max(2, Math.min(12, Number(e.target.value) || 6))
                      )
                    }
                    className={`${inputBoxClass} pr-7`}
                  />
                  <span className="absolute right-2.5 top-1/2 -translate-y-1/2 text-xs font-mono text-zinc-400">
                    %
                  </span>
                </div>
              </div>

              <div>
                <label className={labelClass}>NPS Annuity Yield at 60</label>
                <div className="relative">
                  <input
                    type="number"
                    min={4}
                    max={10}
                    step={0.25}
                    value={inputs.npsAnnuityRate}
                    onChange={(e) =>
                      updateField(
                        'npsAnnuityRate',
                        Math.max(4, Math.min(10, Number(e.target.value) || 6.5))
                      )
                    }
                    className={`${inputBoxClass} pr-7`}
                  />
                  <span className="absolute right-2.5 top-1/2 -translate-y-1/2 text-xs font-mono text-zinc-400">
                    %
                  </span>
                </div>
              </div>
            </div>

            <div className="pt-3 border-t border-zinc-200 dark:border-zinc-800">
              <label className={labelClass}>Valuation Purchasing Power Basis</label>
              <select
                value={inputs.valueMode}
                onChange={(e) =>
                  updateField('valueMode', e.target.value as 'nominal' | 'real')
                }
                className={selectBoxClass}
              >
                <option value="nominal">Future Nominal Value (Unadjusted ₹)</option>
                <option value="real">Today&apos;s Purchasing Power (Inflation-Adjusted ₹)</option>
              </select>
            </div>
          </div>
        )}
      </div>
    </aside>
  );
};
