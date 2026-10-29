import React, { useState, useMemo } from 'react';
import {
  SimulationInputs,
  SimulationSummary,
  formatINR,
} from '../utils/financialEngine';
import { INTANGIBLE_PERKS } from '../data/cpcMatrix';
import {
  Search,
  FileSpreadsheet,
  FileText,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';

interface PerksComparatorAndLedgerProps {
  inputs: SimulationInputs;
  summary: SimulationSummary;
  onExportExcel: () => void;
  onExportPdf: () => void;
  isExportingPdf: boolean;
}

export const PerksComparatorAndLedger: React.FC<PerksComparatorAndLedgerProps> = ({
  inputs,
  summary,
  onExportExcel,
  onExportPdf,
  isExportingPdf,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [tableFilter, setTableFilter] = useState<
    'career' | 'all' | 'milestones'
  >('career');
  const [isTableCollapsed, setIsTableCollapsed] = useState(false);

  const govAvgPerkScore = (
    INTANGIBLE_PERKS.reduce((acc, p) => acc + p.govScore, 0) /
    INTANGIBLE_PERKS.length
  ).toFixed(1);
  const pvtAvgPerkScore = (
    INTANGIBLE_PERKS.reduce((acc, p) => acc + p.pvtScore, 0) /
    INTANGIBLE_PERKS.length
  ).toFixed(1);

  const govAnnualPerksValue = INTANGIBLE_PERKS.reduce(
    (acc, p) => acc + p.govMonetaryEquivalentAnnual,
    0
  );
  const pvtAnnualPerksValue = INTANGIBLE_PERKS.reduce(
    (acc, p) => acc + p.pvtMonetaryEquivalentAnnual,
    0
  );

  const filteredRecords = useMemo(() => {
    return summary.records.filter((r) => {
      if (tableFilter === 'career' && r.age > 60) return false;
      if (
        tableFilter === 'milestones' &&
        !r.isPayCommissionYear &&
        !r.isPvtSwitchYear &&
        !r.isGovPromotionYear &&
        r.age !== inputs.currentAge &&
        r.age !== 60 &&
        r.age !== inputs.lifeExpectancy
      ) {
        return false;
      }

      if (searchQuery.trim()) {
        const q = searchQuery.trim().toLowerCase();
        const matchAge = `${r.age}`.includes(q) || `age ${r.age}`.includes(q);
        const matchYear = `${r.year}`.includes(q);
        const matchLevel = `level ${r.govPayLevel}`.includes(q);
        const matchEvent =
          (r.isPayCommissionYear && 'cpc pay commission'.includes(q)) ||
          (r.isPvtSwitchYear && 'switch'.includes(q)) ||
          (r.isGovPromotionYear && 'promotion macp'.includes(q));
        return matchAge || matchYear || matchLevel || matchEvent;
      }

      return true;
    });
  }, [summary.records, tableFilter, searchQuery, inputs.currentAge, inputs.lifeExpectancy]);

  return (
    <div className="space-y-6">
      {/* SECTION 5: INTANGIBLE BENEFITS & PERKS COMPARATOR */}
      <section
        id="perks-section"
        className="rounded-lg border border-zinc-300 dark:border-zinc-800 bg-white dark:bg-[#0c0c0e] p-5"
      >
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 mb-5 border-b border-zinc-200 dark:border-zinc-800">
          <div>
            <h2 className="text-base font-bold text-zinc-950 dark:text-white">
              05. Intangible Benefits &amp; Non-Salary Perks Matrix
            </h2>
            <p className="text-xs text-zinc-600 dark:text-zinc-400 mt-0.5">
              Quantifies sovereign CGHS healthcare, central pool housing, tenure immunity, and corporate equity upside beyond payslips
            </p>
          </div>

          <div className="flex items-center gap-4 text-xs font-mono tabular-nums text-zinc-700 dark:text-zinc-300 shrink-0">
            <div>
              <span className="text-zinc-500">Govt Composite: </span>
              <strong className="text-[#15803d] dark:text-[#86efac]">
                {govAvgPerkScore}/10
              </strong>{' '}
              <span>(~{formatINR(govAnnualPerksValue)}/yr)</span>
            </div>
            <span aria-hidden="true">·</span>
            <div>
              <span className="text-zinc-500">Private Composite: </span>
              <strong className="text-[#1d4ed8] dark:text-[#93c5fd]">
                {pvtAvgPerkScore}/10
              </strong>{' '}
              <span>(~{formatINR(pvtAnnualPerksValue)}/yr)</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {INTANGIBLE_PERKS.map((perk) => (
            <div
              key={perk.category}
              className="rounded-md border border-zinc-200 dark:border-zinc-800 p-4 flex flex-col justify-between gap-3"
            >
              <div className="flex items-center justify-between text-xs text-zinc-500 dark:text-zinc-400 border-b border-zinc-100 dark:border-zinc-800/80 pb-2">
                <span className="font-bold text-zinc-950 dark:text-white">
                  {perk.category}
                </span>
                <span className="font-mono tabular-nums">
                  Govt {perk.govScore}/10 · Pvt {perk.pvtScore}/10
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
                {/* Government Perk Column */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-[#15803d] dark:text-[#86efac]">
                      {perk.govTitle}
                    </span>
                  </div>
                  <div className="w-full h-1.5 bg-zinc-100 dark:bg-zinc-800 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-[#16a34a] rounded-full"
                      style={{ width: `${perk.govScore * 10}%` }}
                    />
                  </div>
                  <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed">
                    {perk.govDetails}
                  </p>
                  <div className="text-[11px] font-mono tabular-nums text-zinc-500">
                    Imputed Value: ~{formatINR(perk.govMonetaryEquivalentAnnual)}/yr
                  </div>
                </div>

                {/* Private Perk Column */}
                <div className="space-y-1.5 sm:border-l sm:border-zinc-200 dark:sm:border-zinc-800 sm:pl-4">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-[#1d4ed8] dark:text-[#93c5fd]">
                      {perk.pvtTitle}
                    </span>
                  </div>
                  <div className="w-full h-1.5 bg-zinc-100 dark:bg-zinc-800 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-[#2563eb] rounded-full"
                      style={{ width: `${perk.pvtScore * 10}%` }}
                    />
                  </div>
                  <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed">
                    {perk.pvtDetails}
                  </p>
                  <div className="text-[11px] font-mono tabular-nums text-zinc-500">
                    Imputed Value: ~{formatINR(perk.pvtMonetaryEquivalentAnnual)}/yr
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* SECTION 6: YEAR-BY-YEAR BREAKDOWN TABLE & EXPORT SUITE */}
      <section
        id="ledger-section"
        className="rounded-lg border border-zinc-300 dark:border-zinc-800 bg-white dark:bg-[#0c0c0e] overflow-hidden"
      >
        <div className="p-5 border-b border-zinc-200 dark:border-zinc-800 flex flex-col xl:flex-row xl:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-3">
              <h2 className="text-base font-bold text-zinc-950 dark:text-white">
                06. Year-by-Year Financial Ledger &amp; Export Suite
              </h2>
              <button
                type="button"
                onClick={() => setIsTableCollapsed(!isTableCollapsed)}
                className="inline-flex items-center gap-1 text-xs font-semibold text-zinc-600 hover:text-zinc-950 dark:text-zinc-400 dark:hover:text-white cursor-pointer"
              >
                {isTableCollapsed ? (
                  <>
                    <span>Expand Ledger</span>
                    <ChevronDown className="w-3.5 h-3.5" />
                  </>
                ) : (
                  <>
                    <span>Collapse</span>
                    <ChevronUp className="w-3.5 h-3.5" />
                  </>
                )}
              </button>
            </div>
            <p className="text-xs text-zinc-600 dark:text-zinc-400 mt-0.5">
              Complete annual audit trail ({inputs.valueMode === 'real' ? "Today's Real Purchasing Power ₹" : 'Nominal Future Value ₹'}) across Basic, DA%, Tax, In-Hand, and Compounded Corpus
            </p>
          </div>

          {/* Search, Dropdown Filter & Export Actions */}
          <div className="flex flex-wrap items-center gap-2.5">
            {/* Search Text Entry Box */}
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-zinc-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search age, year, CPC..."
                className="pl-8 pr-3 py-1.5 text-xs rounded-md border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-zinc-950 dark:text-white focus:outline-none focus:border-zinc-950 dark:focus:border-white w-44"
              />
            </div>

            {/* Horizon Dropdown Selector */}
            <select
              value={tableFilter}
              onChange={(e) =>
                setTableFilter(e.target.value as 'career' | 'all' | 'milestones')
              }
              className="rounded-md border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 px-3 py-1.5 text-xs font-medium text-zinc-950 dark:text-white cursor-pointer"
            >
              <option value="career">Active Career (Age {inputs.currentAge}–60)</option>
              <option value="all">Full Horizon (Age {inputs.currentAge}–{inputs.lifeExpectancy})</option>
              <option value="milestones">CPC &amp; Switch Spikes Only</option>
            </select>

            {/* Export Buttons */}
            <button
              type="button"
              onClick={onExportExcel}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-md border border-zinc-300 dark:border-zinc-700 bg-[#f0fdf4] dark:bg-zinc-900 text-[#14532d] dark:text-[#86efac] hover:bg-[#dcfce7] transition-colors whitespace-nowrap shrink-0 cursor-pointer"
            >
              <FileSpreadsheet className="w-3.5 h-3.5" />
              Export Raw Data to Excel (.xlsx)
            </button>

            <button
              type="button"
              onClick={onExportPdf}
              disabled={isExportingPdf}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold rounded-md bg-zinc-950 hover:bg-zinc-800 dark:bg-white dark:text-zinc-950 dark:hover:bg-zinc-200 disabled:opacity-60 text-white transition-colors whitespace-nowrap shrink-0 cursor-pointer"
            >
              <FileText className="w-3.5 h-3.5" />
              {isExportingPdf
                ? 'Generating PDF...'
                : 'Download Comprehensive PDF Report'}
            </button>
          </div>
        </div>

        {/* High-Density Financial Data Table */}
        {!isTableCollapsed && (
          <div className="overflow-x-auto max-h-[540px]">
            <table className="w-full text-left border-collapse">
              <thead className="sticky top-0 z-10 bg-zinc-100 dark:bg-zinc-950 border-b border-zinc-300 dark:border-zinc-800 text-[11px] font-bold text-zinc-700 dark:text-zinc-300">
                <tr>
                  <th className="py-2.5 px-3 whitespace-nowrap">Age / Yr</th>
                  <th className="py-2.5 px-3 whitespace-nowrap">Career Events</th>
                  <th className="py-2.5 px-3 text-right whitespace-nowrap text-[#15803d] dark:text-[#86efac]">
                    Govt Basic/mo
                  </th>
                  <th className="py-2.5 px-3 text-right whitespace-nowrap text-[#15803d] dark:text-[#86efac]">
                    DA %
                  </th>
                  <th className="py-2.5 px-3 text-right whitespace-nowrap text-[#15803d] dark:text-[#86efac]">
                    Govt Gross/yr
                  </th>
                  <th className="py-2.5 px-3 text-right whitespace-nowrap text-[#be123c] dark:text-[#fda4af]">
                    Govt Tax
                  </th>
                  <th className="py-2.5 px-3 text-right whitespace-nowrap text-[#15803d] dark:text-[#86efac]">
                    Govt Net/yr
                  </th>
                  <th className="py-2.5 px-3 text-right whitespace-nowrap text-[#15803d] dark:text-[#86efac]">
                    Govt Corpus
                  </th>
                  <th className="py-2.5 px-3 text-right whitespace-nowrap text-[#1d4ed8] dark:text-[#93c5fd]">
                    Pvt CTC/yr
                  </th>
                  <th className="py-2.5 px-3 text-right whitespace-nowrap text-[#be123c] dark:text-[#fda4af]">
                    Pvt Tax
                  </th>
                  <th className="py-2.5 px-3 text-right whitespace-nowrap text-[#1d4ed8] dark:text-[#93c5fd]">
                    Pvt Net/yr
                  </th>
                  <th className="py-2.5 px-3 text-right whitespace-nowrap text-[#1d4ed8] dark:text-[#93c5fd]">
                    Pvt Corpus
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-200 dark:divide-zinc-800/80 text-xs font-mono tabular-nums">
                {filteredRecords.length === 0 ? (
                  <tr>
                    <td
                      colSpan={12}
                      className="py-8 text-center font-sans text-zinc-500"
                    >
                      No year records match &ldquo;{searchQuery}&rdquo;.{' '}
                      <button
                        type="button"
                        onClick={() => {
                          setSearchQuery('');
                          setTableFilter('career');
                        }}
                        className="text-zinc-950 dark:text-white underline ml-1 cursor-pointer"
                      >
                        Reset filter
                      </button>
                    </td>
                  </tr>
                ) : (
                  filteredRecords.map((r) => {
                    const isCrossover = summary.crossoverAge === r.age;
                    return (
                      <tr
                        key={r.age}
                        className={`transition-colors hover:bg-zinc-50 dark:hover:bg-zinc-900/60 ${
                          isCrossover
                            ? 'bg-[#fff1f2] dark:bg-[#4c0519]/30'
                            : r.isPayCommissionYear
                            ? 'bg-[#f0fdf4] dark:bg-[#052e16]/25'
                            : r.isPvtSwitchYear
                            ? 'bg-[#eff6ff] dark:bg-[#172554]/25'
                            : ''
                        }`}
                      >
                        <td className="py-2.5 px-3 whitespace-nowrap font-bold text-zinc-950 dark:text-white">
                          {r.age}y · {r.year}
                        </td>
                        <td className="py-2.5 px-3 font-sans text-[11px] text-zinc-600 dark:text-zinc-400 whitespace-nowrap">
                          {r.isRetiredGov ? (
                            <span>Post-Retirement SWP</span>
                          ) : (
                            <span>
                              L{r.govPayLevel}
                              {r.isPayCommissionYear ? ' · CPC Fitment' : ''}
                              {r.isGovPromotionYear ? ' · MACP Promo' : ''}
                              {r.isPvtSwitchYear ? ' · Pvt Switch' : ''}
                              {r.isPvtLayoffYear ? ' · Layoff Shock' : ''}
                            </span>
                          )}
                        </td>
                        <td className="py-2.5 px-3 text-right whitespace-nowrap text-zinc-800 dark:text-zinc-200">
                          {r.isRetiredGov ? '—' : formatINR(r.govMonthlyBasic, false)}
                        </td>
                        <td className="py-2.5 px-3 text-right whitespace-nowrap text-zinc-600 dark:text-zinc-400">
                          {r.isRetiredGov ? '—' : `${r.govDaPct}%`}
                        </td>
                        <td className="py-2.5 px-3 text-right whitespace-nowrap text-zinc-800 dark:text-zinc-200">
                          {r.isRetiredGov ? '—' : formatINR(r.govAnnualGross)}
                        </td>
                        <td className="py-2.5 px-3 text-right whitespace-nowrap text-[#be123c] dark:text-[#fda4af]">
                          {r.isRetiredGov ? '—' : formatINR(r.govAnnualTax)}
                        </td>
                        <td className="py-2.5 px-3 text-right whitespace-nowrap font-semibold text-[#15803d] dark:text-[#86efac]">
                          {r.isRetiredGov
                            ? formatINR(r.govPostRetirementAnnualPension)
                            : formatINR(r.govAnnualNetInHand)}
                        </td>
                        <td className="py-2.5 px-3 text-right whitespace-nowrap font-bold text-[#15803d] dark:text-[#86efac]">
                          {formatINR(r.govTotalNetWorth)}
                        </td>
                        <td className="py-2.5 px-3 text-right whitespace-nowrap text-zinc-800 dark:text-zinc-200">
                          {r.isRetiredPvt ? '—' : formatINR(r.pvtAnnualCTC)}
                        </td>
                        <td className="py-2.5 px-3 text-right whitespace-nowrap text-[#be123c] dark:text-[#fda4af]">
                          {r.isRetiredPvt ? '—' : formatINR(r.pvtAnnualTax)}
                        </td>
                        <td className="py-2.5 px-3 text-right whitespace-nowrap font-semibold text-[#1d4ed8] dark:text-[#93c5fd]">
                          {r.isRetiredPvt ? '—' : formatINR(r.pvtAnnualNetInHand)}
                        </td>
                        <td className="py-2.5 px-3 text-right whitespace-nowrap font-bold text-[#1d4ed8] dark:text-[#93c5fd]">
                          {formatINR(r.pvtTotalNetWorth)}
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
};
