import React, { useState } from 'react';
import {
  SimulationInputs,
  CityTier,
  RetirementScheme,
  NPSAllocationMode,
} from '../utils/financialEngine';
import { CPC_PAY_MATRIX, CAREER_PRESETS, CareerPreset } from '../data/cpcMatrix';
import { X, ArrowRight, ArrowLeft, Check } from 'lucide-react';

interface OnboardingWizardModalProps {
  isOpen: boolean;
  inputs: SimulationInputs;
  onChange: (updated: SimulationInputs) => void;
  onClose: () => void;
}

export const OnboardingWizardModal: React.FC<OnboardingWizardModalProps> = ({
  isOpen,
  inputs,
  onChange,
  onClose,
}) => {
  const [step, setStep] = useState<1 | 2 | 3>(1);

  if (!isOpen) return null;

  const currentLevelData =
    CPC_PAY_MATRIX.find((l) => l.level === inputs.govPayLevel) || CPC_PAY_MATRIX[9];
  const matrixBasic =
    currentLevelData.cells[Math.min(inputs.govCellIndex, currentLevelData.cells.length - 1)] ||
    56100;
  const effectiveBasic =
    inputs.govBasicOverride && inputs.govBasicOverride > 0
      ? inputs.govBasicOverride
      : matrixBasic;

  const updateField = <K extends keyof SimulationInputs>(
    key: K,
    value: SimulationInputs[K]
  ) => {
    onChange({
      ...inputs,
      [key]: value,
    });
  };

  const applyPreset = (preset: CareerPreset) => {
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

  const inputClass =
    'w-full rounded-md border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 px-3 py-2 text-xs font-mono tabular-nums text-zinc-950 dark:text-zinc-100 focus:outline-none focus:border-zinc-950 dark:focus:border-white';

  const selectClass =
    'w-full rounded-md border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 px-3 py-2 text-xs font-medium text-zinc-950 dark:text-zinc-100 focus:outline-none focus:border-zinc-950 dark:focus:border-white cursor-pointer';

  const labelClass = 'block text-xs font-semibold text-zinc-800 dark:text-zinc-200 mb-1';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
      <div className="w-full max-w-2xl rounded-lg border border-zinc-300 dark:border-zinc-800 bg-white dark:bg-[#0c0c0e] shadow-2xl overflow-hidden">
        {/* Top Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-zinc-200 dark:border-zinc-800">
          <div>
            <h2 className="text-base font-bold text-zinc-950 dark:text-white">
              Guided Career Parameter Setup
            </h2>
            <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">
              Step {step} of 3 ·{' '}
              {step === 1
                ? 'Common & Macro Horizon'
                : step === 2
                ? 'Government Job Profile (7th CPC, NPS/UPS & Fitment)'
                : 'Private Sector Compensation, Switches & Compounding'}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-md text-zinc-500 hover:text-zinc-950 dark:hover:text-white transition-colors cursor-pointer"
            aria-label="Close wizard"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Step Progress Selector */}
        <div className="grid grid-cols-3 border-b border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950">
          {[
            { num: 1 as const, title: '01. Macro & Horizon' },
            { num: 2 as const, title: '02. Government (7th CPC)' },
            { num: 3 as const, title: '03. Private Sector' },
          ].map((item) => (
            <button
              key={item.num}
              type="button"
              onClick={() => setStep(item.num)}
              className={`py-3 px-4 text-xs font-semibold text-left border-b-2 transition-colors cursor-pointer ${
                step === item.num
                  ? 'border-zinc-950 dark:border-white text-zinc-950 dark:text-white bg-white dark:bg-[#0c0c0e]'
                  : 'border-transparent text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-300'
              }`}
            >
              {item.title}
            </button>
          ))}
        </div>

        {/* Body Content */}
        <div className="p-6 space-y-5 max-h-[68vh] overflow-y-auto">
          {step === 1 && (
            <div className="space-y-5">
              <div>
                <label className={labelClass}>Benchmark Career Templates</label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {CAREER_PRESETS.map((preset) => (
                    <button
                      key={preset.id}
                      type="button"
                      onClick={() => applyPreset(preset)}
                      className="text-left p-3 rounded-md border border-zinc-200 dark:border-zinc-800 hover:border-zinc-950 dark:hover:border-white bg-zinc-50/60 dark:bg-zinc-900/50 transition-colors cursor-pointer"
                    >
                      <div className="text-xs font-bold text-zinc-950 dark:text-white">
                        {preset.name}
                      </div>
                      <div className="text-[11px] text-zinc-600 dark:text-zinc-400 font-mono tabular-nums mt-0.5">
                        {preset.subtitle}
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-3 border-t border-zinc-200 dark:border-zinc-800">
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
                    className={inputClass}
                  />
                </div>

                <div>
                  <label className={labelClass}>Life Expectancy Horizon</label>
                  <select
                    value={inputs.lifeExpectancy}
                    onChange={(e) => updateField('lifeExpectancy', Number(e.target.value))}
                    className={selectClass}
                  >
                    <option value={75}>Age 75</option>
                    <option value={80}>Age 80 (Default)</option>
                    <option value={85}>Age 85</option>
                    <option value={90}>Age 90</option>
                  </select>
                </div>

                <div>
                  <label className={labelClass}>Annual Inflation Rate (%)</label>
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
                    className={inputClass}
                  />
                </div>
              </div>

              <div>
                <label className={labelClass}>Valuation Display Basis</label>
                <select
                  value={inputs.valueMode}
                  onChange={(e) =>
                    updateField('valueMode', e.target.value as 'nominal' | 'real')
                  }
                  className={selectClass}
                >
                  <option value="nominal">Future Value (Nominal Unadjusted ₹)</option>
                  <option value="real">
                    Today&apos;s Purchasing Power (Inflation-Adjusted Real ₹)
                  </option>
                </select>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="sm:col-span-2">
                  <label className={labelClass}>7th CPC Pay Level (1 to 18)</label>
                  <select
                    value={inputs.govPayLevel}
                    onChange={(e) =>
                      onChange({
                        ...inputs,
                        govPayLevel: Number(e.target.value),
                        govCellIndex: 0,
                        govBasicOverride: null,
                      })
                    }
                    className={selectClass}
                  >
                    {CPC_PAY_MATRIX.map((lvl) => (
                      <option key={lvl.level} value={lvl.level}>
                        {lvl.label} — ₹{lvl.cells[0].toLocaleString('en-IN')}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className={labelClass}>Matrix Cell / Stage</label>
                  <select
                    value={inputs.govCellIndex}
                    onChange={(e) =>
                      onChange({
                        ...inputs,
                        govCellIndex: Number(e.target.value),
                        govBasicOverride: null,
                      })
                    }
                    className={selectClass}
                  >
                    {currentLevelData.cells.map((c, idx) => (
                      <option key={idx} value={idx}>
                        Cell {idx + 1} (₹{c.toLocaleString('en-IN')})
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className={labelClass}>Monthly Basic Pay (₹)</label>
                  <input
                    type="number"
                    step={100}
                    value={effectiveBasic}
                    onChange={(e) =>
                      updateField('govBasicOverride', Number(e.target.value) || null)
                    }
                    className={inputClass}
                  />
                </div>

                <div>
                  <label className={labelClass}>Current DA (%)</label>
                  <input
                    type="number"
                    min={0}
                    max={100}
                    value={inputs.govCurrentDA}
                    onChange={(e) =>
                      updateField('govCurrentDA', Number(e.target.value) || 0)
                    }
                    className={inputClass}
                  />
                </div>

                <div>
                  <label className={labelClass}>City Class (HRA/TA)</label>
                  <select
                    value={inputs.govCityTier}
                    onChange={(e) => updateField('govCityTier', e.target.value as CityTier)}
                    className={selectClass}
                  >
                    <option value="X">Tier X Metro (30% HRA)</option>
                    <option value="Y">Tier Y City (20% HRA)</option>
                    <option value="Z">Tier Z Town (10% HRA)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-3 border-t border-zinc-200 dark:border-zinc-800">
                <div>
                  <label className={labelClass}>Retirement Pension Scheme</label>
                  <select
                    value={inputs.govRetirementScheme}
                    onChange={(e) =>
                      updateField('govRetirementScheme', e.target.value as RetirementScheme)
                    }
                    className={selectClass}
                  >
                    <option value="UPS">UPS (50% Guaranteed Inflation-Indexed Pension)</option>
                    <option value="NPS">NPS (10% + 14% Market Corpus)</option>
                  </select>
                </div>

                <div>
                  <label className={labelClass}>NPS Lifecycle Allocation Rule</label>
                  <select
                    value={inputs.npsAllocationMode}
                    onChange={(e) =>
                      updateField('npsAllocationMode', e.target.value as NPSAllocationMode)
                    }
                    className={selectClass}
                  >
                    <option value="LC75">Auto Choice LC75 (75% Equity Cap)</option>
                    <option value="LC50">Auto Choice LC50 (50% Equity Cap)</option>
                    <option value="Active">Active Choice (Constant 75%)</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className={labelClass}>Starting Annual CTC (₹)</label>
                  <input
                    type="number"
                    step={50000}
                    value={inputs.pvtCurrentCTC}
                    onChange={(e) =>
                      updateField('pvtCurrentCTC', Number(e.target.value) || 600000)
                    }
                    className={inputClass}
                  />
                </div>

                <div>
                  <label className={labelClass}>Basic Pay (% of CTC)</label>
                  <input
                    type="number"
                    min={30}
                    max={70}
                    value={inputs.pvtBasicPct}
                    onChange={(e) =>
                      updateField('pvtBasicPct', Number(e.target.value) || 45)
                    }
                    className={inputClass}
                  />
                </div>

                <div>
                  <label className={labelClass}>Annual Appraisal (%)</label>
                  <input
                    type="number"
                    step={0.5}
                    value={inputs.pvtAnnualAppraisalPct}
                    onChange={(e) =>
                      updateField('pvtAnnualAppraisalPct', Number(e.target.value) || 8)
                    }
                    className={inputClass}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-3 border-t border-zinc-200 dark:border-zinc-800">
                <div>
                  <label className={labelClass}>Total Job Switches</label>
                  <select
                    value={inputs.pvtTotalSwitches}
                    onChange={(e) => updateField('pvtTotalSwitches', Number(e.target.value))}
                    className={selectClass}
                  >
                    <option value={0}>0 Switches</option>
                    <option value={1}>1 Switch</option>
                    <option value={2}>2 Switches</option>
                    <option value={3}>3 Switches</option>
                    <option value={4}>4 Switches</option>
                    <option value={5}>5 Switches</option>
                  </select>
                </div>

                <div>
                  <label className={labelClass}>Hike per Switch (%)</label>
                  <input
                    type="number"
                    step={5}
                    value={inputs.pvtSwitchHikePct}
                    onChange={(e) =>
                      updateField('pvtSwitchHikePct', Number(e.target.value) || 30)
                    }
                    className={inputClass}
                  />
                </div>

                <div>
                  <label className={labelClass}>Career Plateau Age</label>
                  <select
                    value={inputs.pvtPlateauAge}
                    onChange={(e) => updateField('pvtPlateauAge', Number(e.target.value))}
                    className={selectClass}
                  >
                    <option value={40}>Age 40</option>
                    <option value={45}>Age 45 (Default)</option>
                    <option value={50}>Age 50</option>
                    <option value={55}>Age 55</option>
                  </select>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer Navigation */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950">
          {step > 1 ? (
            <button
              type="button"
              onClick={() => setStep((step - 1) as 1 | 2)}
              className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-zinc-700 dark:text-zinc-300 hover:text-zinc-950 dark:hover:text-white cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              Back
            </button>
          ) : (
            <div />
          )}

          {step < 3 ? (
            <button
              type="button"
              onClick={() => setStep((step + 1) as 2 | 3)}
              className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-zinc-950 dark:bg-white dark:text-zinc-950 rounded-md hover:opacity-90 transition-opacity cursor-pointer"
            >
              Next Step
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          ) : (
            <button
              type="button"
              onClick={onClose}
              className="inline-flex items-center gap-1.5 px-5 py-2 text-xs font-semibold text-white bg-zinc-950 dark:bg-white dark:text-zinc-950 rounded-md hover:opacity-90 transition-opacity cursor-pointer"
            >
              <Check className="w-3.5 h-3.5" />
              Apply Configuration
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
