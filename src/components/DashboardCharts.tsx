import React, { useState } from 'react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ReferenceLine,
  Brush,
} from 'recharts';
import {
  SimulationInputs,
  SimulationSummary,
  YearlyRecord,
  formatINR,
} from '../utils/financialEngine';

interface DashboardChartsProps {
  inputs: SimulationInputs;
  summary: SimulationSummary;
  isDark: boolean;
}

export const DashboardCharts: React.FC<DashboardChartsProps> = ({
  inputs,
  summary,
  isDark,
}) => {
  const [salaryCadence, setSalaryCadence] = useState<'monthly' | 'annual'>('monthly');
  const [wealthBreakdownMode, setWealthBreakdownMode] = useState<'total' | 'components'>(
    'total'
  );
  const [visibleSeries, setVisibleSeries] = useState<{
    gov: boolean;
    pvt: boolean;
  }>({ gov: true, pvt: true });

  const gridStroke = isDark ? '#27272a' : '#e4e4e7';
  const axisStroke = isDark ? '#a1a1aa' : '#52525b';

  // Rich non-emerald palette: Forest Green (#16a34a), Royal Cobalt Blue (#2563eb), Crimson Coral (#e11d48)
  const govColor = '#16a34a';
  const pvtColor = '#2563eb';
  const alertRedColor = '#e11d48';

  const careerRecords = summary.records.filter((r) => r.age <= 60);
  const survivalRecords = summary.records.filter((r) => r.age >= 60);

  const payCommissionRecords = careerRecords.filter((r) => r.isPayCommissionYear);
  const pvtSwitchRecords = careerRecords.filter((r) => r.isPvtSwitchYear);

  const toggleSeries = (key: 'gov' | 'pvt') => {
    setVisibleSeries((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  return (
    <div className="space-y-6">
      {/* CHART 1: MASTER SALARY TRAJECTORY */}
      <section
        id="trajectory-section"
        className="rounded-lg border border-zinc-300 dark:border-zinc-800 bg-white dark:bg-[#0c0c0e] p-5"
      >
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 mb-4 border-b border-zinc-200 dark:border-zinc-800">
          <div>
            <h2 className="text-base font-bold text-zinc-950 dark:text-white">
              01. Master Post-Tax In-Hand Salary Trajectory (Age {inputs.currentAge} to 60)
            </h2>
            <p className="text-xs text-zinc-600 dark:text-zinc-400 mt-0.5">
              Net take-home salary after New Regime Tax &amp; mandatory pension/EPF · Dotted lines mark 10-Yr Pay Commissions &amp; Job Switches
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2 shrink-0">
            <div className="flex items-center gap-1 p-1 bg-zinc-100 dark:bg-zinc-900 rounded-md border border-zinc-200 dark:border-zinc-800">
              <button
                type="button"
                onClick={() => toggleSeries('gov')}
                className={`px-2.5 py-1 text-xs font-semibold rounded transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                  visibleSeries.gov
                    ? 'bg-[#dcfce7] text-[#14532d] border border-[#86efac]'
                    : 'text-zinc-500 hover:text-zinc-950 dark:hover:text-white'
                }`}
              >
                Govt Line
              </button>
              <button
                type="button"
                onClick={() => toggleSeries('pvt')}
                className={`px-2.5 py-1 text-xs font-semibold rounded transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                  visibleSeries.pvt
                    ? 'bg-[#dbeafe] text-[#1e3a8a] border border-[#93c5fd]'
                    : 'text-zinc-500 hover:text-zinc-950 dark:hover:text-white'
                }`}
              >
                Private Line
              </button>
            </div>

            <div className="flex items-center gap-1 p-1 bg-zinc-100 dark:bg-zinc-900 rounded-md border border-zinc-200 dark:border-zinc-800">
              <button
                type="button"
                onClick={() => setSalaryCadence('monthly')}
                className={`px-2.5 py-1 text-xs font-semibold rounded transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                  salaryCadence === 'monthly'
                    ? 'bg-zinc-950 text-white dark:bg-white dark:text-zinc-950'
                    : 'text-zinc-600 dark:text-zinc-400'
                }`}
              >
                Monthly In-Hand
              </button>
              <button
                type="button"
                onClick={() => setSalaryCadence('annual')}
                className={`px-2.5 py-1 text-xs font-semibold rounded transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                  salaryCadence === 'annual'
                    ? 'bg-zinc-950 text-white dark:bg-white dark:text-zinc-950'
                    : 'text-zinc-600 dark:text-zinc-400'
                }`}
              >
                Annual In-Hand
              </button>
            </div>
          </div>
        </div>

        <div className="h-[360px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={careerRecords}
              margin={{ top: 12, right: 20, left: 10, bottom: 8 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke={gridStroke} vertical={false} />
              <XAxis
                dataKey="age"
                stroke={axisStroke}
                tick={{ fontSize: 11, fontFamily: 'JetBrains Mono, monospace' }}
                tickFormatter={(val) => `Age ${val}`}
              />
              <YAxis
                stroke={axisStroke}
                tick={{ fontSize: 11, fontFamily: 'JetBrains Mono, monospace' }}
                tickFormatter={(val) => formatINR(val, true)}
                width={76}
              />
              <Tooltip
                content={({ active, payload }) => {
                  if (!active || !payload || !payload.length) return null;
                  const row = payload[0].payload as YearlyRecord;
                  return (
                    <div className="rounded-md border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-950 p-3 shadow-xl text-xs space-y-1.5 min-w-[245px]">
                      <div className="flex items-center justify-between font-bold text-zinc-950 dark:text-white pb-1 border-b border-zinc-200 dark:border-zinc-800">
                        <span>
                          Age {row.age} ({row.year})
                        </span>
                        <span className="font-mono tabular-nums text-[11px] text-zinc-500">
                          Level {row.govPayLevel} · DA {row.govDaPct}%
                        </span>
                      </div>

                      {row.isPayCommissionYear && (
                        <div className="px-2 py-1 rounded bg-[#dcfce7] text-[#14532d] text-[11px] font-semibold">
                          10-Year Pay Commission Revision (+{inputs.govPayCommissionRealHikePct}% Real Basic)
                        </div>
                      )}
                      {row.isPvtSwitchYear && (
                        <div className="px-2 py-1 rounded bg-[#dbeafe] text-[#1e3a8a] text-[11px] font-semibold">
                          Private Sector Job Switch (+{inputs.pvtSwitchHikePct}% CTC Hike)
                        </div>
                      )}
                      {row.isPvtLayoffYear && (
                        <div className="px-2 py-1 rounded bg-[#ffe4e6] text-[#881337] text-[11px] font-semibold">
                          6-Month Career Layoff Shock Applied
                        </div>
                      )}

                      {visibleSeries.gov && (
                        <div className="flex items-center justify-between text-[#15803d] dark:text-[#86efac]">
                          <span>Govt Net In-Hand:</span>
                          <span className="font-mono tabular-nums font-bold">
                            {formatINR(
                              salaryCadence === 'monthly'
                                ? row.govMonthlyNetInHand
                                : row.govAnnualNetInHand
                            )}
                            {salaryCadence === 'monthly' ? '/mo' : '/yr'}
                          </span>
                        </div>
                      )}
                      {visibleSeries.pvt && (
                        <div className="flex items-center justify-between text-[#1d4ed8] dark:text-[#93c5fd]">
                          <span>Private Net In-Hand:</span>
                          <span className="font-mono tabular-nums font-bold">
                            {formatINR(
                              salaryCadence === 'monthly'
                                ? row.pvtMonthlyNetInHand
                                : row.pvtAnnualNetInHand
                            )}
                            {salaryCadence === 'monthly' ? '/mo' : '/yr'}
                          </span>
                        </div>
                      )}
                      <div className="pt-1 border-t border-zinc-200 dark:border-zinc-800 flex items-center justify-between text-[11px] text-zinc-500 font-mono tabular-nums">
                        <span>Govt Basic: {formatINR(row.govMonthlyBasic)}</span>
                        <span>Pvt CTC: {formatINR(row.pvtAnnualCTC)}</span>
                      </div>
                    </div>
                  );
                }}
              />
              <Legend wrapperStyle={{ fontSize: '12px', paddingTop: '8px' }} />

              {payCommissionRecords.map((pc) => (
                <ReferenceLine
                  key={`cpc-${pc.age}`}
                  x={pc.age}
                  stroke={govColor}
                  strokeDasharray="3 3"
                  label={{
                    value: `${pc.year} CPC`,
                    position: 'insideTopRight',
                    fill: govColor,
                    fontSize: 10,
                  }}
                />
              ))}

              {pvtSwitchRecords.map((sw) => (
                <ReferenceLine
                  key={`sw-${sw.age}`}
                  x={sw.age}
                  stroke={pvtColor}
                  strokeDasharray="2 4"
                  label={{
                    value: `Switch`,
                    position: 'insideTopLeft',
                    fill: pvtColor,
                    fontSize: 10,
                  }}
                />
              ))}

              {visibleSeries.gov && (
                <Line
                  type="monotone"
                  dataKey={
                    salaryCadence === 'monthly'
                      ? 'govMonthlyNetInHand'
                      : 'govAnnualNetInHand'
                  }
                  name="Government Net In-Hand"
                  stroke={govColor}
                  strokeWidth={2.5}
                  dot={(props) => {
                    const { cx, cy, payload } = props;
                    if (payload.isPayCommissionYear) {
                      return (
                        <circle
                          key={`dot-gov-${payload.age}`}
                          cx={cx}
                          cy={cy}
                          r={5}
                          fill={govColor}
                          stroke="#ffffff"
                          strokeWidth={1.5}
                        />
                      );
                    }
                    return <g key={`dot-gov-${payload.age}`} />;
                  }}
                  activeDot={{ r: 6 }}
                />
              )}

              {visibleSeries.pvt && (
                <Line
                  type="monotone"
                  dataKey={
                    salaryCadence === 'monthly'
                      ? 'pvtMonthlyNetInHand'
                      : 'pvtAnnualNetInHand'
                  }
                  name="Private Net In-Hand"
                  stroke={pvtColor}
                  strokeWidth={2.5}
                  dot={(props) => {
                    const { cx, cy, payload } = props;
                    if (payload.isPvtSwitchYear || payload.isPvtLayoffYear) {
                      return (
                        <circle
                          key={`dot-pvt-${payload.age}`}
                          cx={cx}
                          cy={cy}
                          r={5}
                          fill={payload.isPvtLayoffYear ? alertRedColor : pvtColor}
                          stroke="#ffffff"
                          strokeWidth={1.5}
                        />
                      );
                    }
                    return <g key={`dot-pvt-${payload.age}`} />;
                  }}
                  activeDot={{ r: 6 }}
                />
              )}

              <Brush
                dataKey="age"
                height={22}
                stroke={isDark ? '#3f3f46' : '#d4d4d8'}
                fill={isDark ? '#18181b' : '#f4f4f5'}
                tickFormatter={(val) => `${val}y`}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </section>

      {/* CHART 2: TOTAL WEALTH & INVESTMENT COMPOUNDING GRAPH */}
      <section className="rounded-lg border border-zinc-300 dark:border-zinc-800 bg-white dark:bg-[#0c0c0e] p-5">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 mb-4 border-b border-zinc-200 dark:border-zinc-800">
          <div>
            <h2 className="text-base font-bold text-zinc-950 dark:text-white">
              02. Total Wealth &amp; Investment Compounding Trajectory
            </h2>
            <p className="text-xs text-zinc-600 dark:text-zinc-400 mt-0.5">
              Accumulated Net Worth: Govt ({inputs.govRetirementScheme} Corpus + Gratuity + Personal MF SIP) vs. Private (EPF + Gratuity + Personal MF SIP)
            </p>
          </div>

          <div className="flex items-center gap-1 p-1 bg-zinc-100 dark:bg-zinc-900 rounded-md border border-zinc-200 dark:border-zinc-800 self-start md:self-auto">
            <button
              type="button"
              onClick={() => setWealthBreakdownMode('total')}
              className={`px-3 py-1 text-xs font-semibold rounded transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                wealthBreakdownMode === 'total'
                  ? 'bg-zinc-950 text-white dark:bg-white dark:text-zinc-950'
                  : 'text-zinc-600 dark:text-zinc-400'
              }`}
            >
              Total Net Worth
            </button>
            <button
              type="button"
              onClick={() => setWealthBreakdownMode('components')}
              className={`px-3 py-1 text-xs font-semibold rounded transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                wealthBreakdownMode === 'components'
                  ? 'bg-zinc-950 text-white dark:bg-white dark:text-zinc-950'
                  : 'text-zinc-600 dark:text-zinc-400'
              }`}
            >
              Pension/EPF vs. MF Breakdown
            </button>
          </div>
        </div>

        <div className="h-[350px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={careerRecords}
              margin={{ top: 12, right: 20, left: 10, bottom: 8 }}
            >
              <defs>
                <linearGradient id="govGreenFill" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={govColor} stopOpacity={0.28} />
                  <stop offset="95%" stopColor={govColor} stopOpacity={0.02} />
                </linearGradient>
                <linearGradient id="pvtBlueFill" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={pvtColor} stopOpacity={0.28} />
                  <stop offset="95%" stopColor={pvtColor} stopOpacity={0.02} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke={gridStroke} vertical={false} />
              <XAxis
                dataKey="age"
                stroke={axisStroke}
                tick={{ fontSize: 11, fontFamily: 'JetBrains Mono, monospace' }}
                tickFormatter={(val) => `Age ${val}`}
              />
              <YAxis
                stroke={axisStroke}
                tick={{ fontSize: 11, fontFamily: 'JetBrains Mono, monospace' }}
                tickFormatter={(val) => formatINR(val, true)}
                width={76}
              />
              <Tooltip
                content={({ active, payload }) => {
                  if (!active || !payload || !payload.length) return null;
                  const row = payload[0].payload as YearlyRecord;
                  const delta = row.govTotalNetWorth - row.pvtTotalNetWorth;
                  return (
                    <div className="rounded-md border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-950 p-3 shadow-xl text-xs space-y-1.5 min-w-[260px]">
                      <div className="font-bold text-zinc-950 dark:text-white pb-1 border-b border-zinc-200 dark:border-zinc-800 flex justify-between">
                        <span>
                          Age {row.age} ({row.year})
                        </span>
                        <span className="font-mono tabular-nums text-[11px] text-zinc-500">
                          {delta >= 0
                            ? `Govt +${formatINR(delta)}`
                            : `Pvt +${formatINR(Math.abs(delta))}`}
                        </span>
                      </div>

                      <div className="space-y-1">
                        <div className="flex justify-between font-bold text-[#15803d] dark:text-[#86efac]">
                          <span>Govt Total Net Worth:</span>
                          <span className="font-mono tabular-nums">
                            {formatINR(row.govTotalNetWorth)}
                          </span>
                        </div>
                        <div className="flex justify-between text-[11px] text-zinc-500 font-mono tabular-nums pl-2">
                          <span>• NPS/UPS + Gratuity:</span>
                          <span>{formatINR(row.govNpsCorpus + row.govGratuityAccrued)}</span>
                        </div>
                        <div className="flex justify-between text-[11px] text-zinc-500 font-mono tabular-nums pl-2">
                          <span>• Personal MF SIP Corpus:</span>
                          <span>{formatINR(row.govMfCorpus)}</span>
                        </div>
                      </div>

                      <div className="space-y-1 pt-1 border-t border-zinc-200 dark:border-zinc-800">
                        <div className="flex justify-between font-bold text-[#1d4ed8] dark:text-[#93c5fd]">
                          <span>Private Total Net Worth:</span>
                          <span className="font-mono tabular-nums">
                            {formatINR(row.pvtTotalNetWorth)}
                          </span>
                        </div>
                        <div className="flex justify-between text-[11px] text-zinc-500 font-mono tabular-nums pl-2">
                          <span>• EPF + Gratuity:</span>
                          <span>{formatINR(row.pvtEpfCorpus + row.pvtGratuityAccrued)}</span>
                        </div>
                        <div className="flex justify-between text-[11px] text-zinc-500 font-mono tabular-nums pl-2">
                          <span>• Personal MF SIP Corpus:</span>
                          <span>{formatINR(row.pvtMfCorpus)}</span>
                        </div>
                      </div>
                    </div>
                  );
                }}
              />
              <Legend wrapperStyle={{ fontSize: '12px', paddingTop: '8px' }} />

              {summary.crossoverAge && summary.crossoverAge <= 60 && (
                <ReferenceLine
                  x={summary.crossoverAge}
                  stroke={alertRedColor}
                  strokeWidth={2}
                  strokeDasharray="4 4"
                  label={{
                    value: `Crossover Age ${summary.crossoverAge}`,
                    position: 'top',
                    fill: alertRedColor,
                    fontSize: 11,
                  }}
                />
              )}

              {wealthBreakdownMode === 'total' ? (
                <>
                  <Area
                    type="monotone"
                    dataKey="govTotalNetWorth"
                    name="Government Total Net Worth"
                    stroke={govColor}
                    strokeWidth={2.5}
                    fill="url(#govGreenFill)"
                  />
                  <Area
                    type="monotone"
                    dataKey="pvtTotalNetWorth"
                    name="Private Total Net Worth"
                    stroke={pvtColor}
                    strokeWidth={2.5}
                    fill="url(#pvtBlueFill)"
                  />
                </>
              ) : (
                <>
                  <Area
                    type="monotone"
                    dataKey="govMfCorpus"
                    name="Govt Personal MF SIP"
                    stroke={govColor}
                    strokeWidth={2}
                    fill="url(#govGreenFill)"
                  />
                  <Area
                    type="monotone"
                    dataKey="govNpsCorpus"
                    name="Govt NPS/Pension Pool"
                    stroke="#15803d"
                    strokeWidth={1.8}
                    strokeDasharray="4 2"
                    fill="none"
                  />
                  <Area
                    type="monotone"
                    dataKey="pvtMfCorpus"
                    name="Private Personal MF SIP"
                    stroke={pvtColor}
                    strokeWidth={2}
                    fill="url(#pvtBlueFill)"
                  />
                  <Area
                    type="monotone"
                    dataKey="pvtEpfCorpus"
                    name="Private EPF Corpus"
                    stroke="#1e40af"
                    strokeWidth={1.8}
                    strokeDasharray="4 2"
                    fill="none"
                  />
                </>
              )}
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </section>

      {/* BOTTOM SPLIT ROW: CHART 3 & CHART 4 */}
      <div
        id="retirement-section"
        className="grid grid-cols-1 xl:grid-cols-12 gap-6 items-stretch"
      >
        {/* Chart 3: Post-Retirement Cashflow Survival */}
        <section className="xl:col-span-7 rounded-lg border border-zinc-300 dark:border-zinc-800 bg-white dark:bg-[#0c0c0e] p-5 flex flex-col justify-between">
          <div>
            <div className="pb-4 mb-4 border-b border-zinc-200 dark:border-zinc-800">
              <h2 className="text-base font-bold text-zinc-950 dark:text-white">
                03. Post-Retirement Cashflow Survival (Age 60 to {inputs.lifeExpectancy})
              </h2>
              <p className="text-xs text-zinc-600 dark:text-zinc-400 mt-0.5">
                {inputs.govRetirementScheme === 'UPS'
                  ? 'Govt UPS inflation-indexed monthly pension shields the liquid MF corpus vs. Private 100% SWP drawdown'
                  : 'Govt 40% NPS Annuity + SWP vs. Private 100% Systematic Withdrawal Plan (SWP) adjusted for inflation'}
              </p>
            </div>

            <div className="h-[280px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart
                  data={survivalRecords}
                  margin={{ top: 10, right: 16, left: 10, bottom: 4 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke={gridStroke} vertical={false} />
                  <XAxis
                    dataKey="age"
                    stroke={axisStroke}
                    tick={{ fontSize: 11, fontFamily: 'JetBrains Mono, monospace' }}
                    tickFormatter={(val) => `Age ${val}`}
                  />
                  <YAxis
                    stroke={axisStroke}
                    tick={{ fontSize: 11, fontFamily: 'JetBrains Mono, monospace' }}
                    tickFormatter={(val) => formatINR(val, true)}
                    width={74}
                  />
                  <Tooltip
                    content={({ active, payload }) => {
                      if (!active || !payload || !payload.length) return null;
                      const row = payload[0].payload as YearlyRecord;
                      return (
                        <div className="rounded-md border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-950 p-3 shadow-xl text-xs space-y-1.5 min-w-[235px]">
                          <div className="font-bold text-zinc-950 dark:text-white pb-1 border-b border-zinc-200 dark:border-zinc-800">
                            Post-Retirement · Age {row.age} ({row.year})
                          </div>
                          <div className="flex justify-between text-[#15803d] dark:text-[#86efac] font-bold">
                            <span>Govt Liquid Corpus:</span>
                            <span className="font-mono tabular-nums">
                              {formatINR(row.govLiquidRetirementBalance)}
                            </span>
                          </div>
                          <div className="flex justify-between text-[11px] text-zinc-500 font-mono tabular-nums">
                            <span>Govt Pension Inflow:</span>
                            <span>{formatINR(row.govPostRetirementAnnualPension)}/yr</span>
                          </div>
                          <div className="flex justify-between text-[#1d4ed8] dark:text-[#93c5fd] font-bold pt-1 border-t border-zinc-200 dark:border-zinc-800">
                            <span>Pvt SWP Balance:</span>
                            <span className="font-mono tabular-nums">
                              {formatINR(row.pvtLiquidRetirementBalance)}
                            </span>
                          </div>
                          <div className="flex justify-between text-[11px] text-[#be123c] dark:text-[#fda4af] font-mono tabular-nums">
                            <span>Living Expense Outflow:</span>
                            <span>{formatINR(row.annualLivingExpenseTarget)}/yr</span>
                          </div>
                        </div>
                      );
                    }}
                  />
                  <Legend wrapperStyle={{ fontSize: '12px', paddingTop: '6px' }} />
                  <Area
                    type="monotone"
                    dataKey="govLiquidRetirementBalance"
                    name="Govt Residual Wealth (Pension + MF)"
                    stroke={govColor}
                    strokeWidth={2.5}
                    fill="url(#govGreenFill)"
                  />
                  <Area
                    type="monotone"
                    dataKey="pvtLiquidRetirementBalance"
                    name="Private SWP Residual Corpus"
                    stroke={pvtColor}
                    strokeWidth={2.5}
                    fill="url(#pvtBlueFill)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-zinc-200 dark:border-zinc-800 flex flex-wrap items-center justify-between gap-2 text-xs text-zinc-600 dark:text-zinc-400">
            <span>
              Govt Monthly Pension at 60:{' '}
              <strong className="font-mono tabular-nums text-[#15803d] dark:text-[#86efac]">
                {formatINR(summary.govMonthlyPensionAt60)}/mo
              </strong>
            </span>
            <span aria-hidden="true">·</span>
            <span>
              Age {inputs.lifeExpectancy} Estate: Govt{' '}
              <strong className="font-mono tabular-nums text-zinc-950 dark:text-white">
                {formatINR(summary.govCorpusAt80)}
              </strong>{' '}
              vs. Pvt{' '}
              <strong className="font-mono tabular-nums text-zinc-950 dark:text-white">
                {formatINR(summary.pvtCorpusAt80)}
              </strong>
            </span>
          </div>
        </section>

        {/* Chart 4: NPS Asset Allocation Shift */}
        <section className="xl:col-span-5 rounded-lg border border-zinc-300 dark:border-zinc-800 bg-white dark:bg-[#0c0c0e] p-5 flex flex-col justify-between">
          <div>
            <div className="pb-4 mb-4 border-b border-zinc-200 dark:border-zinc-800">
              <h2 className="text-base font-bold text-zinc-950 dark:text-white">
                04. NPS Auto-Choice Lifecycle Glidepath ({inputs.npsAllocationMode})
              </h2>
              <p className="text-xs text-zinc-600 dark:text-zinc-400 mt-0.5">
                Automatic PFRDA equity tapering from Age 36 to 55 shifting into Government (G) &amp; Corporate (C) Bonds
              </p>
            </div>

            <div className="h-[280px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart
                  data={careerRecords}
                  stackOffset="expand"
                  margin={{ top: 10, right: 16, left: 0, bottom: 4 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke={gridStroke} vertical={false} />
                  <XAxis
                    dataKey="age"
                    stroke={axisStroke}
                    tick={{ fontSize: 11, fontFamily: 'JetBrains Mono, monospace' }}
                    tickFormatter={(val) => `${val}y`}
                  />
                  <YAxis
                    stroke={axisStroke}
                    tick={{ fontSize: 11, fontFamily: 'JetBrains Mono, monospace' }}
                    tickFormatter={(val) => `${Math.round(val * 100)}%`}
                    width={46}
                  />
                  <Tooltip
                    content={({ active, payload }) => {
                      if (!active || !payload || !payload.length) return null;
                      const row = payload[0].payload as YearlyRecord;
                      return (
                        <div className="rounded-md border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-950 p-3 shadow-xl text-xs space-y-1 font-mono tabular-nums">
                          <div className="font-sans font-bold text-zinc-950 dark:text-white pb-1 border-b border-zinc-200 dark:border-zinc-800">
                            Age {row.age} · Blended Return: {row.npsBlendedReturn}%
                          </div>
                          <div className="text-[#16a34a]">
                            Equity (E): {row.npsEquityWeight}%
                          </div>
                          <div className="text-[#2563eb]">
                            Corporate Bonds (C): {row.npsCorpBondWeight}%
                          </div>
                          <div className="text-[#e11d48]">
                            Government Securities (G): {row.npsGovBondWeight}%
                          </div>
                        </div>
                      );
                    }}
                  />
                  <Legend wrapperStyle={{ fontSize: '12px', paddingTop: '6px' }} />
                  <Area
                    type="monotone"
                    dataKey="npsEquityWeight"
                    stackId="1"
                    name="Equity (E)"
                    stroke="#16a34a"
                    fill="#86efac"
                    fillOpacity={0.85}
                  />
                  <Area
                    type="monotone"
                    dataKey="npsCorpBondWeight"
                    stackId="1"
                    name="Corp Bonds (C)"
                    stroke="#2563eb"
                    fill="#93c5fd"
                    fillOpacity={0.85}
                  />
                  <Area
                    type="monotone"
                    dataKey="npsGovBondWeight"
                    stackId="1"
                    name="Govt Bonds (G)"
                    stroke="#e11d48"
                    fill="#fecdd3"
                    fillOpacity={0.85}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-zinc-200 dark:border-zinc-800 text-xs text-zinc-600 dark:text-zinc-400">
            Tapering Rule: Up to Age 35, Equity is held at{' '}
            <span className="font-mono tabular-nums text-zinc-950 dark:text-white font-semibold">
              {inputs.npsAllocationMode === 'LC50' ? '50%' : '75%'}
            </span>
            ; reduces annually from Age 36 until settling at{' '}
            <span className="font-mono tabular-nums text-zinc-950 dark:text-white font-semibold">
              {inputs.npsAllocationMode === 'LC50' ? '10%' : '15%'}
            </span>{' '}
            by Age 55.
          </div>
        </section>
      </div>
    </div>
  );
};
