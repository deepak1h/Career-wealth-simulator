import * as XLSX from 'xlsx';
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';
import {
  SimulationInputs,
  SimulationSummary,
  formatINR,
} from './financialEngine';

export function exportToExcelWorkbook(
  inputs: SimulationInputs,
  summary: SimulationSummary
): void {
  const wb = XLSX.utils.book_new();

  // Sheet 1: Year-by-Year Breakdown
  const ledgerRows = summary.records.map((r) => ({
    Age: r.age,
    Year: r.year,
    'Career Phase': r.isRetiredGov ? 'Post-Retirement' : 'Active Service',
    'CPC Revision Year': r.isPayCommissionYear ? 'YES (CPC Fitment)' : 'No',
    'Govt Pay Level': r.isRetiredGov ? 'Retired' : `Level ${r.govPayLevel}`,
    'Govt Monthly Basic (INR)': r.govMonthlyBasic,
    'DA (%)': r.govDaPct,
    'HRA (%)': r.govHraPct,
    'Govt Annual Gross (INR)': r.govAnnualGross,
    'Govt Income Tax (INR)': r.govAnnualTax,
    'Govt Employee NPS/UPS (INR)': r.govEmployeePensionContrib,
    'Govt Annual Net In-Hand (INR)': r.govAnnualNetInHand,
    'Govt Monthly In-Hand (INR)': r.govMonthlyNetInHand,
    'Govt Annual MF SIP (INR)': r.govAnnualSipContribution,
    'Govt NPS/Pension Pool (INR)': r.govNpsCorpus,
    'Govt Personal MF Corpus (INR)': r.govMfCorpus,
    'Govt Accrued Gratuity (INR)': r.govGratuityAccrued,
    'Govt Total Net Worth (INR)': r.govTotalNetWorth,
    'NPS Equity Weight (%)': r.npsEquityWeight,
    'Pvt Job Switch Year': r.isPvtSwitchYear ? 'YES (Switch Hike)' : 'No',
    'Pvt Layoff Shock': r.isPvtLayoffYear ? 'YES (6-Mo Layoff)' : 'No',
    'Pvt Annual CTC (INR)': r.pvtAnnualCTC,
    'Pvt Annual Gross (INR)': r.pvtAnnualGross,
    'Pvt Income Tax (INR)': r.pvtAnnualTax,
    'Pvt Employee EPF (INR)': r.pvtEmployeeEpfContrib,
    'Pvt Annual Net In-Hand (INR)': r.pvtAnnualNetInHand,
    'Pvt Monthly In-Hand (INR)': r.pvtMonthlyNetInHand,
    'Pvt Annual MF SIP (INR)': r.pvtAnnualSipContribution,
    'Pvt EPF Corpus (INR)': r.pvtEpfCorpus,
    'Pvt Personal MF Corpus (INR)': r.pvtMfCorpus,
    'Pvt Accrued Gratuity (INR)': r.pvtGratuityAccrued,
    'Pvt Total Net Worth (INR)': r.pvtTotalNetWorth,
    'Net Worth Advantage (Govt - Pvt)': r.govTotalNetWorth - r.pvtTotalNetWorth,
  }));

  const wsLedger = XLSX.utils.json_to_sheet(ledgerRows);
  XLSX.utils.book_append_sheet(wb, wsLedger, 'Year-on-Year Projection');

  // Sheet 2: Executive Summary & Input Assumptions
  const summaryRows = [
    { Parameter: 'Valuation Mode', Value: inputs.valueMode === 'real' ? 'Inflation-Adjusted Real INR' : 'Future Nominal INR' },
    { Parameter: 'Entry Age', Value: `${inputs.currentAge} Years` },
    { Parameter: 'Life Expectancy Horizon', Value: `${inputs.lifeExpectancy} Years` },
    { Parameter: 'Annual Inflation Rate', Value: `${inputs.inflationRate}%` },
    { Parameter: '--- GOVERNMENT PROFILE ---', Value: '' },
    { Parameter: 'Starting 7th CPC Level', Value: `Level ${inputs.govPayLevel}` },
    { Parameter: 'Current DA %', Value: `${inputs.govCurrentDA}%` },
    { Parameter: 'City Class (HRA/TA)', Value: `Tier ${inputs.govCityTier}` },
    { Parameter: '10-Yr Pay Commission Real Hike', Value: `${inputs.govPayCommissionRealHikePct}%` },
    { Parameter: 'Retirement Scheme', Value: inputs.govRetirementScheme },
    { Parameter: 'NPS Lifecycle Mode', Value: inputs.npsAllocationMode },
    { Parameter: 'Govt Personal SIP % of In-Hand', Value: `${inputs.govSipPct}% @ ${inputs.govSipCagr}% CAGR` },
    { Parameter: '--- PRIVATE PROFILE ---', Value: '' },
    { Parameter: 'Starting Annual CTC', Value: formatINR(inputs.pvtCurrentCTC, false) },
    { Parameter: 'Basic Pay % of CTC', Value: `${inputs.pvtBasicPct}%` },
    { Parameter: 'Annual Appraisal %', Value: `${inputs.pvtAnnualAppraisalPct}%` },
    { Parameter: 'Planned Job Switches', Value: `${inputs.pvtTotalSwitches} switches (every ${inputs.pvtSwitchIntervalYears} yrs @ +${inputs.pvtSwitchHikePct}%)` },
    { Parameter: 'Career Plateau Age', Value: `${inputs.pvtPlateauAge} Years` },
    { Parameter: 'Private Target Retirement Age', Value: `${inputs.pvtRetirementAge} Years` },
    { Parameter: 'Private Personal SIP % of In-Hand', Value: `${inputs.pvtSipPct}% @ ${inputs.pvtSipCagr}% CAGR` },
    { Parameter: '--- KEY OUTCOMES ---', Value: '' },
    { Parameter: 'Govt Lifetime Post-Tax Earnings', Value: formatINR(summary.govLifetimeEarningsPostTax) },
    { Parameter: 'Pvt Lifetime Post-Tax Earnings', Value: formatINR(summary.pvtLifetimeEarningsPostTax) },
    { Parameter: 'Govt Total Corpus at Age 60', Value: formatINR(summary.govCorpusAt60) },
    { Parameter: 'Pvt Total Corpus at Age 60', Value: formatINR(summary.pvtCorpusAt60) },
    { Parameter: 'Govt Corpus at Age 80', Value: formatINR(summary.govCorpusAt80) },
    { Parameter: 'Pvt Corpus at Age 80', Value: formatINR(summary.pvtCorpusAt80) },
    { Parameter: 'Financial Winner at Age 60', Value: summary.winnerAt60 },
    { Parameter: 'Crossover Age', Value: summary.crossoverAge ? `Age ${summary.crossoverAge}` : 'No Crossover' },
  ];

  const wsSummary = XLSX.utils.json_to_sheet(summaryRows);
  XLSX.utils.book_append_sheet(wb, wsSummary, 'Executive Summary');

  XLSX.writeFile(
    wb,
    `Gov_vs_Corp_Wealth_Ledger_${inputs.valueMode.toUpperCase()}_2026.xlsx`
  );
}

export async function generateExecutivePdfReport(
  inputs: SimulationInputs,
  summary: SimulationSummary,
  dashboardElement: HTMLElement | null
): Promise<void> {
  const pdf = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  const pageWidth = pdf.internal.pageSize.getWidth();
  const margin = 14;

  // Header Banner
  pdf.setFillColor(15, 23, 42); // Slate-900
  pdf.rect(0, 0, pageWidth, 34, 'F');

  pdf.setTextColor(255, 255, 255);
  pdf.setFont('helvetica', 'bold');
  pdf.setFontSize(16);
  pdf.text('Gov vs. Corp: Indian Career Wealth Simulator', margin, 15);

  pdf.setFont('helvetica', 'normal');
  pdf.setFontSize(9.5);
  pdf.setTextColor(148, 163, 184);
  pdf.text(
    `Executive Financial Projection (Age ${inputs.currentAge} to ${inputs.lifeExpectancy})  |  Mode: ${
      inputs.valueMode === 'real'
        ? "Today's Purchasing Power (Real INR)"
        : 'Nominal Future Value (INR)'
    }`,
    margin,
    24
  );

  // Section 1: KPI Verdict Summary
  let y = 44;
  pdf.setTextColor(15, 23, 42);
  pdf.setFont('helvetica', 'bold');
  pdf.setFontSize(12);
  pdf.text('1. Executive Wealth Verdict & KPI Summary', margin, y);
  y += 6;

  // Draw 2 comparison boxes
  pdf.setDrawColor(226, 232, 240);
  pdf.setFillColor(240, 253, 244); // Soft Emerald tint
  pdf.roundedRect(margin, y, (pageWidth - margin * 2 - 6) / 2, 38, 2, 2, 'FD');

  pdf.setFillColor(238, 242, 255); // Soft Indigo tint
  pdf.roundedRect(
    margin + (pageWidth - margin * 2 - 6) / 2 + 6,
    y,
    (pageWidth - margin * 2 - 6) / 2,
    38,
    2,
    2,
    'FD'
  );

  // Left Box: Govt
  pdf.setFont('helvetica', 'bold');
  pdf.setFontSize(10);
  pdf.setTextColor(5, 150, 105);
  pdf.text(`GOVERNMENT PATH (Level ${inputs.govPayLevel} - ${inputs.govRetirementScheme})`, margin + 4, y + 8);
  pdf.setTextColor(30, 41, 59);
  pdf.setFont('helvetica', 'normal');
  pdf.setFontSize(9);
  pdf.text(`Lifetime Post-Tax Earnings: ${formatINR(summary.govLifetimeEarningsPostTax)}`, margin + 4, y + 16);
  pdf.text(`Retirement Corpus (Age 60): ${formatINR(summary.govCorpusAt60)}`, margin + 4, y + 23);
  pdf.text(`Monthly Pension at 60: ${formatINR(summary.govMonthlyPensionAt60)}/mo`, margin + 4, y + 30);
  pdf.text(`Residual Wealth (Age 80): ${formatINR(summary.govCorpusAt80)}`, margin + 4, y + 36);

  // Right Box: Private
  const rightX = margin + (pageWidth - margin * 2 - 6) / 2 + 10;
  pdf.setFont('helvetica', 'bold');
  pdf.setFontSize(10);
  pdf.setTextColor(79, 70, 229);
  pdf.text(`PRIVATE SECTOR PATH (CTC ${formatINR(inputs.pvtCurrentCTC)})`, rightX, y + 8);
  pdf.setTextColor(30, 41, 59);
  pdf.setFont('helvetica', 'normal');
  pdf.setFontSize(9);
  pdf.text(`Lifetime Post-Tax Earnings: ${formatINR(summary.pvtLifetimeEarningsPostTax)}`, rightX, y + 16);
  pdf.text(`Retirement Corpus (Age 60): ${formatINR(summary.pvtCorpusAt60)}`, rightX, y + 23);
  pdf.text(`Final In-Hand before Ret.: ${formatINR(summary.pvtFinalMonthlyInHand)}/mo`, rightX, y + 30);
  pdf.text(`Residual Wealth (Age 80): ${formatINR(summary.pvtCorpusAt80)}`, rightX, y + 36);

  y += 46;

  // Winner Banner
  pdf.setFillColor(248, 250, 252);
  pdf.roundedRect(margin, y, pageWidth - margin * 2, 16, 2, 2, 'FD');
  pdf.setFont('helvetica', 'bold');
  pdf.setFontSize(9.5);
  pdf.setTextColor(15, 23, 42);
  const verdictLine = `Net Worth Winner at Age 60: ${summary.winnerAt60.toUpperCase()} by ${formatINR(
    summary.wealthDeltaAt60
  )}   |   Crossover Age: ${
    summary.crossoverAge ? `Age ${summary.crossoverAge}` : 'Single Leader Throughout Career'
  }`;
  pdf.text(verdictLine, margin + 4, y + 10);

  y += 24;

  // Section 2: Parameter Configuration
  pdf.setFont('helvetica', 'bold');
  pdf.setFontSize(12);
  pdf.text('2. Model Parameters & Assumptions', margin, y);
  y += 6;

  pdf.setFont('helvetica', 'normal');
  pdf.setFontSize(8.5);
  pdf.setTextColor(51, 65, 85);

  const paramLines = [
    `• Macro: Entry Age ${inputs.currentAge}, Life Expectancy ${inputs.lifeExpectancy}, Inflation ${inputs.inflationRate}% p.a.`,
    `• Govt (7th CPC): Level ${inputs.govPayLevel}, Starting DA ${inputs.govCurrentDA}%, City Tier ${inputs.govCityTier}, Bi-Annual DA Hike +${inputs.govBiAnnualDaHike}%/6mo, Promotion every ${inputs.govPromotionInterval} yrs.`,
    `• Govt Revisions & Pension: 10-Yr Pay Commission Real Fitment Jump +${inputs.govPayCommissionRealHikePct}%, Scheme: ${inputs.govRetirementScheme} (${inputs.npsAllocationMode}), Personal SIP: ${inputs.govSipPct}% @ ${inputs.govSipCagr}% CAGR.`,
    `• Private Career: Starting CTC ${formatINR(inputs.pvtCurrentCTC)}, Basic ${inputs.pvtBasicPct}%, Variable ${inputs.pvtVariablePct}%, Appraisal +${inputs.pvtAnnualAppraisalPct}%/yr, ${inputs.pvtTotalSwitches} Switches (+${inputs.pvtSwitchHikePct}% every ${inputs.pvtSwitchIntervalYears} yrs until Age ${inputs.pvtPlateauAge}).`,
    `• Private Retirement & SIP: Target Retirement Age ${inputs.pvtRetirementAge}, EPF @ ${inputs.pvtEpfRate}%, Personal SIP: ${inputs.pvtSipPct}% @ ${inputs.pvtSipCagr}% CAGR, Layoff Shock: ${inputs.layoffScenario.toUpperCase()}.`,
  ];

  for (const line of paramLines) {
    pdf.text(line, margin, y);
    y += 5.5;
  }

  y += 4;

  // Section 3: Decade-by-Decade Milestone Table
  pdf.setFont('helvetica', 'bold');
  pdf.setFontSize(12);
  pdf.setTextColor(15, 23, 42);
  pdf.text('3. Milestone Trajectory Snapshot (Age 25 to 80)', margin, y);
  y += 5;

  // Table Header
  const colWidths = [14, 16, 28, 28, 28, 28, 38];
  const headers = [
    'Age',
    'Year',
    'Gov In-Hand/m',
    'Pvt In-Hand/m',
    'Gov Corpus',
    'Pvt Corpus',
    'Leading Path',
  ];

  pdf.setFillColor(30, 41, 59);
  pdf.rect(margin, y, pageWidth - margin * 2, 7, 'F');
  pdf.setTextColor(255, 255, 255);
  pdf.setFontSize(8);
  let curX = margin + 2;
  headers.forEach((h, idx) => {
    pdf.text(h, curX, y + 4.8);
    curX += colWidths[idx];
  });
  y += 7;

  const milestoneAges = new Set([
    inputs.currentAge,
    28,
    30,
    35,
    40,
    45,
    50,
    55,
    60,
    65,
    70,
    75,
    80,
  ]);
  const milestoneRows = summary.records.filter((r) => milestoneAges.has(r.age));

  pdf.setFont('helvetica', 'normal');
  milestoneRows.forEach((r, idx) => {
    if (idx % 2 === 0) {
      pdf.setFillColor(248, 250, 252);
      pdf.rect(margin, y, pageWidth - margin * 2, 6.5, 'F');
    }
    pdf.setTextColor(30, 41, 59);
    let cellX = margin + 2;
    const rowLeader =
      r.govTotalNetWorth >= r.pvtTotalNetWorth
        ? `Gov (+${formatINR(r.govTotalNetWorth - r.pvtTotalNetWorth)})`
        : `Pvt (+${formatINR(r.pvtTotalNetWorth - r.govTotalNetWorth)})`;

    const cells = [
      `${r.age}`,
      `${r.year}`,
      r.isRetiredGov ? 'Retired' : formatINR(r.govMonthlyNetInHand),
      r.isRetiredPvt ? 'Retired' : formatINR(r.pvtMonthlyNetInHand),
      formatINR(r.govTotalNetWorth),
      formatINR(r.pvtTotalNetWorth),
      rowLeader,
    ];
    cells.forEach((val, cIdx) => {
      pdf.text(val, cellX, y + 4.5);
      cellX += colWidths[cIdx];
    });
    y += 6.5;
  });

  // Optional Page 2: Visual Snapshot of Charts if dashboardElement is provided
  if (dashboardElement) {
    try {
      const canvas = await html2canvas(dashboardElement, {
        scale: 1.5,
        useCORS: true,
        logging: false,
        backgroundColor: '#0f172a',
      });
      const imgData = canvas.toDataURL('image/png');
      pdf.addPage();
      pdf.setFillColor(15, 23, 42);
      pdf.rect(0, 0, pageWidth, 20, 'F');
      pdf.setTextColor(255, 255, 255);
      pdf.setFont('helvetica', 'bold');
      pdf.setFontSize(12);
      pdf.text('Visual Dashboard Snapshot', margin, 13);

      const usableWidth = pageWidth - margin * 2;
      const imgHeight = (canvas.height * usableWidth) / canvas.width;
      pdf.addImage(
        imgData,
        'PNG',
        margin,
        26,
        usableWidth,
        Math.min(imgHeight, 255)
      );
    } catch {
      // Fallback gracefully if canvas capture is skipped
    }
  }

  pdf.save(`Gov_vs_Corp_Wealth_Report_${inputs.valueMode.toUpperCase()}.pdf`);
}
