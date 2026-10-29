import { CPC_PAY_MATRIX } from '../data/cpcMatrix';

export type CityTier = 'X' | 'Y' | 'Z';
export type RetirementScheme = 'NPS' | 'UPS';
export type NPSAllocationMode = 'LC75' | 'LC50' | 'Active';
export type LayoffScenario = 'none' | 'one' | 'two';
export type ValueDisplayMode = 'nominal' | 'real';

export interface SimulationInputs {
  // Step 1: Common & Macro Parameters
  currentAge: number;
  lifeExpectancy: number;
  inflationRate: number; // % e.g., 6
  valueMode: ValueDisplayMode;

  // Step 2: Government Job Profile
  govPayLevel: number; // 1 to 18
  govCellIndex: number; // 0-indexed cell in CPC_PAY_MATRIX
  govBasicOverride: number | null; // Optional custom starting monthly basic
  govCurrentDA: number; // % e.g., 53
  govCityTier: CityTier; // X = 30%, Y = 20%, Z = 10% (when DA >= 50%)
  govSpecialAllowancePct: number; // % of basic
  govBiAnnualDaHike: number; // % every 6 months (default 3% -> 6% annual)
  govAnnualIncrementPct: number; // % (default 3%)
  govPromotionInterval: number; // years (default 10 for MACP)
  govPayCommissionRealHikePct: number; // % real hike on (Basic + DA) at each 10-yr CPC (default 20%)
  govRetirementScheme: RetirementScheme; // 'NPS' | 'UPS'
  npsAllocationMode: NPSAllocationMode; // 'LC75' | 'LC50' | 'Active'
  npsActiveEquityPct: number; // % if Active mode (max 75%)
  npsActiveCorpBondPct: number; // % if Active mode
  npsActiveGovBondPct: number; // % if Active mode
  npsEquityReturn: number; // % default 12
  npsCorpBondReturn: number; // % default 8.5
  npsGovBondReturn: number; // % default 7.5
  npsAnnuityRate: number; // % default 6.5
  govSipPct: number; // % of post-tax in-hand invested in Equity/MF
  govSipCagr: number; // % expected CAGR (default 12)

  // Step 3: Private Job Profile
  pvtCurrentCTC: number; // Annual CTC in ₹ (e.g., 15,00,000)
  pvtBasicPct: number; // % of CTC (default 45)
  pvtVariablePct: number; // % of CTC (default 10)
  pvtAnnualAppraisalPct: number; // % (default 8)
  pvtTotalSwitches: number; // count (default 3)
  pvtSwitchIntervalYears: number; // every X years (default 3)
  pvtSwitchHikePct: number; // % hike on switch (default 30)
  pvtPlateauAge: number; // age after which switches stop & hikes slow (default 45)
  pvtRetirementAge: number; // default 60 (can be 50, 55, 58, 60)
  pvtEpfRate: number; // % default 8.15
  pvtSipPct: number; // % of post-tax in-hand invested in Equity/MF
  pvtSipCagr: number; // % expected CAGR (default 12)
  layoffScenario: LayoffScenario; // 'none' | 'one' | 'two'
}

export interface YearlyRecord {
  age: number;
  year: number;
  isRetiredGov: boolean;
  isRetiredPvt: boolean;
  isPayCommissionYear: boolean;
  isGovPromotionYear: boolean;
  isPvtSwitchYear: boolean;
  isPvtLayoffYear: boolean;
  inflationDiscountFactor: number;

  // Government Metrics (Nominal & Display-Adjusted)
  govPayLevel: number;
  govMonthlyBasic: number;
  govDaPct: number;
  govHraPct: number;
  govMonthlyDA: number;
  govMonthlyHRA: number;
  govMonthlyTA: number;
  govAnnualGross: number;
  govAnnualTax: number;
  govEmployeePensionContrib: number; // 10% of Basic+DA
  govEmployerPensionContrib: number; // 14% (NPS) or 18.5% (UPS)
  govAnnualNetInHand: number;
  govMonthlyNetInHand: number;
  govAnnualSipContribution: number;
  govNpsCorpus: number; // Accumulated NPS or notional UPS value
  govMfCorpus: number; // Personal MF SIP corpus
  govGratuityAccrued: number;
  govTotalNetWorth: number;
  govPostRetirementAnnualPension: number;

  // NPS Asset Allocation Snapshot
  npsEquityWeight: number;
  npsCorpBondWeight: number;
  npsGovBondWeight: number;
  npsBlendedReturn: number;

  // Private Metrics
  pvtAnnualCTC: number;
  pvtMonthlyBasic: number;
  pvtAnnualGross: number;
  pvtAnnualTax: number;
  pvtEmployeeEpfContrib: number; // 12% of Basic
  pvtEmployerEpfContrib: number; // 12% of Basic
  pvtAnnualNetInHand: number;
  pvtMonthlyNetInHand: number;
  pvtAnnualSipContribution: number;
  pvtEpfCorpus: number;
  pvtMfCorpus: number;
  pvtGratuityAccrued: number;
  pvtTotalNetWorth: number;

  // Post-Retirement Cashflow Survival (Age 60 to 80)
  annualLivingExpenseTarget: number;
  govLiquidRetirementBalance: number;
  pvtLiquidRetirementBalance: number;
}

export interface SimulationSummary {
  records: YearlyRecord[];
  govLifetimeEarningsPostTax: number;
  pvtLifetimeEarningsPostTax: number;
  govCorpusAt60: number;
  pvtCorpusAt60: number;
  govCorpusAt80: number;
  pvtCorpusAt80: number;
  govMonthlyPensionAt60: number;
  govRetirementLumpSumAt60: number;
  pvtFinalMonthlyInHand: number;
  govFinalMonthlyInHand: number;
  crossoverAge: number | null;
  crossoverDirection: 'PvtOvertakesGov' | 'GovOvertakesPvt' | 'None';
  winnerAt60: 'Government' | 'Private';
  winnerAt80: 'Government' | 'Private';
  wealthDeltaAt60: number;
  wealthDeltaAt80: number;
  layoffWealthImpact: number; // How much wealth was lost due to layoffs
}

export const DEFAULT_SIMULATION_INPUTS: SimulationInputs = {
  currentAge: 25,
  lifeExpectancy: 80,
  inflationRate: 6.0,
  valueMode: 'nominal',

  govPayLevel: 10,
  govCellIndex: 0,
  govBasicOverride: null,
  govCurrentDA: 53,
  govCityTier: 'X',
  govSpecialAllowancePct: 0,
  govBiAnnualDaHike: 3, // +6% DA per year
  govAnnualIncrementPct: 3,
  govPromotionInterval: 8,
  govPayCommissionRealHikePct: 20, // 20% real boost on (Basic + DA) at each 10-yr CPC
  govRetirementScheme: 'UPS',
  npsAllocationMode: 'LC75',
  npsActiveEquityPct: 75,
  npsActiveCorpBondPct: 10,
  npsActiveGovBondPct: 15,
  npsEquityReturn: 12.0,
  npsCorpBondReturn: 8.5,
  npsGovBondReturn: 7.5,
  npsAnnuityRate: 6.5,
  govSipPct: 25,
  govSipCagr: 12.0,

  pvtCurrentCTC: 1800000, // ₹18 LPA
  pvtBasicPct: 45,
  pvtVariablePct: 10,
  pvtAnnualAppraisalPct: 8.5,
  pvtTotalSwitches: 3,
  pvtSwitchIntervalYears: 3,
  pvtSwitchHikePct: 30,
  pvtPlateauAge: 45,
  pvtRetirementAge: 60,
  pvtEpfRate: 8.15,
  pvtSipPct: 25,
  pvtSipCagr: 12.0,
  layoffScenario: 'none',
};

/**
 * Calculates Indian New Tax Regime Income Tax dynamically with inflation-indexed slabs.
 * Incorporates ₹75,000 Standard Deduction and 4% Health & Education Cess.
 */
export function calculateIndianNewRegimeTax(
  grossTaxableIncome: number,
  slabIndexationMultiplier: number
): number {
  const stdDeduction = 75000 * slabIndexationMultiplier;
  const taxable = Math.max(0, grossTaxableIncome - stdDeduction);

  // FY 2025-26 New Tax Regime Slabs scaled by slabIndexationMultiplier
  const rebateThreshold = 1200000 * slabIndexationMultiplier;
  if (taxable <= rebateThreshold) {
    return 0;
  }

  const s1 = 400000 * slabIndexationMultiplier;
  const s2 = 800000 * slabIndexationMultiplier;
  const s3 = 1200000 * slabIndexationMultiplier;
  const s4 = 1600000 * slabIndexationMultiplier;
  const s5 = 2000000 * slabIndexationMultiplier;
  const s6 = 2400000 * slabIndexationMultiplier;

  let tax = 0;
  if (taxable > s1) tax += Math.min(taxable - s1, s2 - s1) * 0.05;
  if (taxable > s2) tax += Math.min(taxable - s2, s3 - s2) * 0.10;
  if (taxable > s3) tax += Math.min(taxable - s3, s4 - s3) * 0.15;
  if (taxable > s4) tax += Math.min(taxable - s4, s5 - s4) * 0.20;
  if (taxable > s5) tax += Math.min(taxable - s5, s6 - s5) * 0.25;
  if (taxable > s6) tax += (taxable - s6) * 0.30;

  // Marginal relief near ₹12L threshold
  const excessOverRebate = taxable - rebateThreshold;
  if (tax > excessOverRebate) {
    tax = excessOverRebate;
  }

  // 4% Health & Education Cess
  return Math.round(tax * 1.04);
}

/**
 * Computes NPS Equity, Corporate Bond, and Government Bond weights for a given age.
 * Implements official PFRDA Auto-Choice Lifecycle rules (LC75 and LC50):
 * - Until age 35: LC75 = 75% E, 10% C, 15% G | LC50 = 50% E, 30% C, 20% G
 * - Age 36 to 55:
 *   - LC75 tapers Equity from 75% down to 15% at age 55 (shifting into G & C bonds)
 *   - LC50 tapers Equity by 2% per year from 50% down to 10% at age 55
 */
export function getNpsAllocationForAge(
  age: number,
  mode: NPSAllocationMode,
  activeE: number,
  activeC: number,
  activeG: number
): { equity: number; corpBonds: number; govBonds: number } {
  if (mode === 'Active') {
    const total = activeE + activeC + activeG || 100;
    return {
      equity: (activeE / total) * 100,
      corpBonds: (activeC / total) * 100,
      govBonds: (activeG / total) * 100,
    };
  }

  const clampedAge = Math.min(Math.max(age, 18), 60);

  if (mode === 'LC75') {
    if (clampedAge <= 35) {
      return { equity: 75, corpBonds: 10, govBonds: 15 };
    }
    if (clampedAge >= 55) {
      return { equity: 15, corpBonds: 10, govBonds: 75 };
    }
    const yearsPast35 = clampedAge - 35;
    // Tapering from 75% at age 35 to 15% at age 55 (3% per year across 20 years)
    const equity = Math.max(15, 75 - yearsPast35 * 3.0);
    const corpBonds = 10;
    const govBonds = 100 - equity - corpBonds;
    return { equity, corpBonds, govBonds };
  }

  // LC50
  if (clampedAge <= 35) {
    return { equity: 50, corpBonds: 30, govBonds: 20 };
  }
  if (clampedAge >= 55) {
    return { equity: 10, corpBonds: 10, govBonds: 80 };
  }
  const yearsPast35 = clampedAge - 35;
  // Decreases by 2% per year for Equity and 1% per year for Corp Bonds
  const equity = Math.max(10, 50 - yearsPast35 * 2.0);
  const corpBonds = Math.max(10, 30 - yearsPast35 * 1.0);
  const govBonds = 100 - equity - corpBonds;
  return { equity, corpBonds, govBonds };
}

/**
 * Computes 7th CPC HRA % based on City Tier and current DA %.
 * Official Rule:
 * - Base HRA (DA < 25%): X = 24%, Y = 16%, Z = 8%
 * - When DA crosses 25% (25% <= DA < 50%): X = 27%, Y = 18%, Z = 9%
 * - When DA crosses 50% (DA >= 50%): X = 30%, Y = 20%, Z = 10%
 */
export function getHraPercentage(cityTier: CityTier, daPct: number): number {
  if (daPct >= 50) {
    return cityTier === 'X' ? 30 : cityTier === 'Y' ? 20 : 10;
  }
  if (daPct >= 25) {
    return cityTier === 'X' ? 27 : cityTier === 'Y' ? 18 : 9;
  }
  return cityTier === 'X' ? 24 : cityTier === 'Y' ? 16 : 8;
}

/**
 * Computes 7th CPC base Transport Allowance (before DA on TA)
 */
export function getBaseTransportAllowance(
  level: number,
  cityTier: CityTier,
  cpcScaleMultiplier: number
): number {
  let base = 3600;
  if (level <= 2) {
    base = cityTier === 'X' ? 1350 : 900;
  } else if (level <= 8) {
    base = cityTier === 'X' ? 3600 : 1800;
  } else {
    base = cityTier === 'X' ? 7200 : 3600;
  }
  return Math.round(base * cpcScaleMultiplier);
}

function runCoreSimulation(inputs: SimulationInputs): Omit<SimulationSummary, 'layoffWealthImpact'> {
  const startYear = 2026;
  const govRetirementAge = 60;
  const pvtRetirementAge = inputs.pvtRetirementAge;
  const maxAge = Math.max(inputs.lifeExpectancy, 80);

  // Initialize Government State
  const initialLevelObj =
    CPC_PAY_MATRIX.find((l) => l.level === inputs.govPayLevel) || CPC_PAY_MATRIX[9];
  const initialCellBasic =
    initialLevelObj.cells[Math.min(inputs.govCellIndex, initialLevelObj.cells.length - 1)] ||
    56100;

  let currentGovLevel = inputs.govPayLevel;
  let currentGovMonthlyBasic =
    inputs.govBasicOverride && inputs.govBasicOverride > 0
      ? inputs.govBasicOverride
      : initialCellBasic;
  let currentGovDaPct = inputs.govCurrentDA;
  let cpcScaleMultiplier = 1.0;
  let statutoryGratuityCap = 2500000; // ₹25 Lakhs under 7th CPC (after DA >= 50%)

  let govNpsCorpus = 0;
  let govMfCorpus = 0;
  let govGratuityAccrued = 0;
  let govLifetimeEarningsPostTax = 0;
  let govCorpusAt60 = 0;
  let govMonthlyPensionAt60 = 0;
  let govRetirementLumpSumAt60 = 0;
  let govFinalMonthlyInHand = 0;
  let govBasePensionAt60 = 0; // For UPS inflation indexation

  // Initialize Private State
  let currentPvtAnnualCTC = inputs.pvtCurrentCTC;
  let switchesCompleted = 0;
  let pvtEpfCorpus = 0;
  let pvtMfCorpus = 0;
  let pvtGratuityAccrued = 0;
  let pvtLifetimeEarningsPostTax = 0;
  let pvtCorpusAt60 = 0;
  let pvtFinalMonthlyInHand = 0;

  // Post-retirement liquid pools (for age 60 to 80 survival tracking)
  let govLiquidRetirementPool = 0;
  let pvtLiquidRetirementPool = 0;
  let baseAnnualLivingExpenseAt60 = 0;

  const records: YearlyRecord[] = [];

  for (let age = inputs.currentAge; age <= maxAge; age++) {
    const yearIndex = age - inputs.currentAge;
    const calendarYear = startYear + yearIndex;
    const yearsOfService = yearIndex + 1;

    const isRetiredGov = age > govRetirementAge;
    const isRetiredPvt = age > pvtRetirementAge;

    // Inflation discount factor to convert Future Nominal ₹ into Today's Real ₹
    const inflationDiscountFactor = Math.pow(1 + inputs.inflationRate / 100, yearIndex);
    const displayDivisor = inputs.valueMode === 'real' ? inflationDiscountFactor : 1;

    // Tax slabs adjust upward every 4 years with inflation to avoid unrealistic bracket creep
    const slabIndexationCycles = Math.floor(yearIndex / 4);
    const slabIndexationMultiplier = Math.pow(
      1 + (inputs.inflationRate * 0.75) / 100,
      slabIndexationCycles * 4
    );

    // Determine events for this year (after starting yearIndex > 0)
    // Pay Commission happens every 10th calendar year (2036, 2046, 2056) and 2027 (8th CPC rollout after initial 2026 baseline)
    const isPayCommissionYear =
      !isRetiredGov &&
      yearIndex > 0 &&
      (calendarYear === 2027 || (calendarYear > 2030 && calendarYear % 10 === 6));

    const isGovPromotionYear =
      !isRetiredGov &&
      yearIndex > 0 &&
      inputs.govPromotionInterval > 0 &&
      yearIndex % inputs.govPromotionInterval === 0 &&
      currentGovLevel < 18;

    const isPvtSwitchYear =
      !isRetiredPvt &&
      yearIndex > 0 &&
      age <= inputs.pvtPlateauAge &&
      switchesCompleted < inputs.pvtTotalSwitches &&
      inputs.pvtSwitchIntervalYears > 0 &&
      yearIndex % inputs.pvtSwitchIntervalYears === 0;

    // Layoff stress test simulation at specific career mid-points
    const firstLayoffAge = Math.min(inputs.currentAge + 7, pvtRetirementAge - 5);
    const secondLayoffAge = Math.min(inputs.currentAge + 15, pvtRetirementAge - 2);
    const isPvtLayoffYear =
      !isRetiredPvt &&
      yearIndex > 0 &&
      ((inputs.layoffScenario === 'one' && age === firstLayoffAge) ||
        (inputs.layoffScenario === 'two' && (age === firstLayoffAge || age === secondLayoffAge)));

    // --- 1. UPDATE GOVERNMENT CAREER TRAJECTORY ---
    if (!isRetiredGov && yearIndex > 0) {
      // Standard annual increment in Pay Matrix (~3%)
      currentGovMonthlyBasic =
        Math.round((currentGovMonthlyBasic * (1 + inputs.govAnnualIncrementPct / 100)) / 100) * 100;

      // Bi-annual DA hikes (Jan & July -> 2x biAnnualDaHike per year)
      currentGovDaPct += inputs.govBiAnnualDaHike * 2;

      // Promotion (MACP / Regular)
      if (isGovPromotionYear) {
        currentGovLevel = Math.min(18, currentGovLevel + 1);
        // Promotion grants 1 extra matrix cell increment + level jump (~5% boost)
        currentGovMonthlyBasic = Math.round((currentGovMonthlyBasic * 1.05) / 100) * 100;
      }

      // 10-Year Pay Commission Revision
      if (isPayCommissionYear) {
        // Merge existing DA into Basic and apply the Fitment Real Hike %
        const mergedBasicAndDA = currentGovMonthlyBasic * (1 + currentGovDaPct / 100);
        currentGovMonthlyBasic =
          Math.round(
            (mergedBasicAndDA * (1 + inputs.govPayCommissionRealHikePct / 100)) / 100
          ) * 100;
        currentGovDaPct = 0; // Reset DA to 0%
        cpcScaleMultiplier *= 1 + inputs.govPayCommissionRealHikePct / 100 + 0.35;
        statutoryGratuityCap *= 1.25; // Statutory gratuity cap rises with CPC
      }
    }

    // Calculate Government Salary Breakdown for the year
    let govMonthlyBasic = 0;
    let govDaPct = 0;
    let govHraPct = 0;
    let govMonthlyDA = 0;
    let govMonthlyHRA = 0;
    let govMonthlyTA = 0;
    let govAnnualGross = 0;
    let govEmployeePensionContrib = 0;
    let govEmployerPensionContrib = 0;
    let govAnnualTax = 0;
    let govAnnualNetInHand = 0;
    let govAnnualSipContribution = 0;
    let govPostRetirementAnnualPension = 0;

    // NPS Allocation for current age
    const npsWeights = getNpsAllocationForAge(
      age,
      inputs.npsAllocationMode,
      inputs.npsActiveEquityPct,
      inputs.npsActiveCorpBondPct,
      inputs.npsActiveGovBondPct
    );
    const npsBlendedReturn =
      (npsWeights.equity * inputs.npsEquityReturn +
        npsWeights.corpBonds * inputs.npsCorpBondReturn +
        npsWeights.govBonds * inputs.npsGovBondReturn) /
      100;

    if (!isRetiredGov) {
      govMonthlyBasic = currentGovMonthlyBasic;
      govDaPct = currentGovDaPct;
      govHraPct = getHraPercentage(inputs.govCityTier, govDaPct);

      govMonthlyDA = Math.round(govMonthlyBasic * (govDaPct / 100));
      govMonthlyHRA = Math.round(govMonthlyBasic * (govHraPct / 100));
      const baseTA = getBaseTransportAllowance(
        currentGovLevel,
        inputs.govCityTier,
        cpcScaleMultiplier
      );
      govMonthlyTA = Math.round(baseTA * (1 + govDaPct / 100));
      const govMonthlySpecial = Math.round(
        govMonthlyBasic * (inputs.govSpecialAllowancePct / 100)
      );

      const monthlyGross =
        govMonthlyBasic + govMonthlyDA + govMonthlyHRA + govMonthlyTA + govMonthlySpecial;
      govAnnualGross = monthlyGross * 12;

      const annualBasicPlusDA = (govMonthlyBasic + govMonthlyDA) * 12;
      govEmployeePensionContrib = Math.round(annualBasicPlusDA * 0.10);
      govEmployerPensionContrib = Math.round(
        annualBasicPlusDA * (inputs.govRetirementScheme === 'NPS' ? 0.14 : 0.185)
      );

      // Income tax calculated on Gross Salary
      govAnnualTax = calculateIndianNewRegimeTax(govAnnualGross, slabIndexationMultiplier);
      govAnnualNetInHand = Math.max(
        0,
        govAnnualGross - govAnnualTax - govEmployeePensionContrib
      );
      govLifetimeEarningsPostTax += govAnnualNetInHand / displayDivisor;

      govAnnualSipContribution = Math.round(govAnnualNetInHand * (inputs.govSipPct / 100));

      // Compounding NPS / Notional UPS Pool
      const totalAnnualPensionContrib = govEmployeePensionContrib + govEmployerPensionContrib;
      govNpsCorpus =
        (govNpsCorpus + totalAnnualPensionContrib) * (1 + npsBlendedReturn / 100);

      // Compounding Personal MF SIP
      govMfCorpus =
        (govMfCorpus + govAnnualSipContribution) * (1 + inputs.govSipCagr / 100);

      // Accrued Gratuity: (15/26) * Monthly (Basic + DA) * Years of Service
      if (yearsOfService >= 5) {
        govGratuityAccrued = Math.min(
          statutoryGratuityCap,
          Math.round(((15 / 26) * (govMonthlyBasic + govMonthlyDA) * yearsOfService))
        );
      }

      if (age === govRetirementAge) {
        govFinalMonthlyInHand = govAnnualNetInHand / 12;

        if (inputs.govRetirementScheme === 'NPS') {
          // 60% lump sum tax-free, 40% annuity
          const npsLumpSum = govNpsCorpus * 0.60;
          const npsAnnuityCorpus = govNpsCorpus * 0.40;
          govRetirementLumpSumAt60 = npsLumpSum + govGratuityAccrued;
          govBasePensionAt60 = (npsAnnuityCorpus * (inputs.npsAnnuityRate / 100)) / 12;
          govMonthlyPensionAt60 = govBasePensionAt60;
          // At age 60, liquid retirement pool for post-retirement SWP = Personal MF + 60% NPS Lump Sum + Gratuity
          govLiquidRetirementPool = govMfCorpus + govRetirementLumpSumAt60;
        } else {
          // UPS: Guaranteed 50% of last Basic + DR (pro-rated if service < 25 yrs)
          const serviceProportion = Math.min(1, yearsOfService / 25);
          govBasePensionAt60 =
            (govMonthlyBasic + govMonthlyDA) * 0.50 * serviceProportion;
          govMonthlyPensionAt60 = govBasePensionAt60;
          // UPS Superannuation Lump Sum = (1/10) of Monthly (Basic + DA) for every completed 6-month period of service
          const sixMonthBlocks = yearsOfService * 2;
          const upsLumpSum = (govMonthlyBasic + govMonthlyDA) * 0.10 * sixMonthBlocks;
          govRetirementLumpSumAt60 = upsLumpSum + govGratuityAccrued;
          // In UPS, the monthly pension is sovereign-guaranteed; liquid pool = Personal MF + UPS Lump Sum + Gratuity
          govLiquidRetirementPool = govMfCorpus + govRetirementLumpSumAt60;
        }
      }
    }

    // --- 2. UPDATE PRIVATE CAREER TRAJECTORY ---
    if (!isRetiredPvt && yearIndex > 0) {
      if (isPvtLayoffYear) {
        // During a layoff year, no appraisal hike; next year resumes from current base
      } else if (isPvtSwitchYear) {
        currentPvtAnnualCTC = Math.round(
          currentPvtAnnualCTC * (1 + inputs.pvtSwitchHikePct / 100)
        );
        switchesCompleted += 1;
      } else {
        // After plateau age, annual increments slow down by 40%
        const effectiveAppraisal =
          age > inputs.pvtPlateauAge
            ? inputs.pvtAnnualAppraisalPct * 0.6
            : inputs.pvtAnnualAppraisalPct;
        currentPvtAnnualCTC = Math.round(currentPvtAnnualCTC * (1 + effectiveAppraisal / 100));
      }
    }

    let pvtAnnualCTC = 0;
    let pvtMonthlyBasic = 0;
    let pvtAnnualGross = 0;
    let pvtEmployeeEpfContrib = 0;
    let pvtEmployerEpfContrib = 0;
    let pvtAnnualTax = 0;
    let pvtAnnualNetInHand = 0;
    let pvtAnnualSipContribution = 0;

    if (!isRetiredPvt) {
      // If layoff year (6 months out of work), effective earnings & contributions are halved
      const activeYearFraction = isPvtLayoffYear ? 0.5 : 1.0;
      pvtAnnualCTC = currentPvtAnnualCTC * activeYearFraction;

      const annualBasic = pvtAnnualCTC * (inputs.pvtBasicPct / 100);
      pvtMonthlyBasic = Math.round(annualBasic / 12);

      pvtEmployeeEpfContrib = Math.round(annualBasic * 0.12);
      pvtEmployerEpfContrib = Math.round(annualBasic * 0.12);

      // In a layoff year, variable bonus is 0%
      const variablePayout = isPvtLayoffYear
        ? 0
        : pvtAnnualCTC * (inputs.pvtVariablePct / 100) * 0.85; // 85% average realization of variable pay
      const fixedAllowances =
        pvtAnnualCTC -
        annualBasic -
        pvtEmployerEpfContrib -
        pvtAnnualCTC * (inputs.pvtVariablePct / 100);

      pvtAnnualGross = Math.max(0, annualBasic + fixedAllowances + variablePayout);
      pvtAnnualTax = calculateIndianNewRegimeTax(pvtAnnualGross, slabIndexationMultiplier);

      pvtAnnualNetInHand = Math.max(0, pvtAnnualGross - pvtAnnualTax - pvtEmployeeEpfContrib);
      pvtLifetimeEarningsPostTax += pvtAnnualNetInHand / displayDivisor;

      // In a layoff year, no fresh SIP and 3 months of living costs are withdrawn from MF corpus
      if (isPvtLayoffYear) {
        pvtAnnualSipContribution = 0;
        const emergencyDrawdown = (currentPvtAnnualCTC * 0.35) * 0.5;
        pvtMfCorpus = Math.max(0, pvtMfCorpus - emergencyDrawdown);
      } else {
        pvtAnnualSipContribution = Math.round(pvtAnnualNetInHand * (inputs.pvtSipPct / 100));
      }

      // Compounding EPF
      pvtEpfCorpus =
        (pvtEpfCorpus + pvtEmployeeEpfContrib + pvtEmployerEpfContrib) *
        (1 + inputs.pvtEpfRate / 100);

      // Compounding Personal MF SIP
      pvtMfCorpus =
        (pvtMfCorpus + pvtAnnualSipContribution) * (1 + inputs.pvtSipCagr / 100);

      // Accrued Private Gratuity: (15/26) * Monthly Basic * Years of Service
      if (yearsOfService >= 5) {
        pvtGratuityAccrued = Math.min(
          statutoryGratuityCap,
          Math.round((15 / 26) * ( (currentPvtAnnualCTC * (inputs.pvtBasicPct / 100)) / 12 ) * yearsOfService)
        );
      }

      if (age === pvtRetirementAge) {
        pvtFinalMonthlyInHand = pvtAnnualNetInHand / 12;
        pvtLiquidRetirementPool = pvtEpfCorpus + pvtMfCorpus + pvtGratuityAccrued;
      }
    } else if (age <= govRetirementAge) {
      // If Private retired early (e.g., at 55) before age 60:
      // Private corpus compounds minus living expenses between pvtRetirementAge and 60
      const pre60LivingExpense =
        (pvtFinalMonthlyInHand * 12 * 0.55) *
        Math.pow(1 + inputs.inflationRate / 100, age - pvtRetirementAge);
      const postRetireReturn = (inputs.pvtSipCagr * 0.65 + inputs.pvtEpfRate * 0.35) / 100;
      pvtLiquidRetirementPool = Math.max(
        0,
        (pvtLiquidRetirementPool - pre60LivingExpense) * (1 + postRetireReturn)
      );
      pvtMfCorpus = pvtLiquidRetirementPool;
      pvtEpfCorpus = 0;
      pvtGratuityAccrued = 0;
    }

    // --- 3. TOTAL WEALTH AT CURRENT AGE (UP TO AGE 60) ---
    let govTotalNominalWealth = 0;
    let pvtTotalNominalWealth = 0;

    if (age <= 60) {
      if (inputs.govRetirementScheme === 'NPS') {
        govTotalNominalWealth = govNpsCorpus + govMfCorpus + govGratuityAccrued;
      } else {
        // Under UPS, employee's accumulated liquid wealth before 60 includes MF + accrued Gratuity + accrued UPS lump sum & actuarial value
        const sixMonthBlocks = yearsOfService * 2;
        const accruedUpsLumpSum = (govMonthlyBasic + govMonthlyDA) * 0.10 * sixMonthBlocks;
        govTotalNominalWealth =
          govMfCorpus + govGratuityAccrued + accruedUpsLumpSum + govNpsCorpus * 0.65;
      }

      pvtTotalNominalWealth =
        age <= pvtRetirementAge
          ? pvtEpfCorpus + pvtMfCorpus + pvtGratuityAccrued
          : pvtLiquidRetirementPool;

      if (age === 60) {
        // Baseline post-retirement annual living expense (60% of Govt final in-hand or reasonable upper-middle-class lifestyle)
        baseAnnualLivingExpenseAt60 = Math.max(
          govFinalMonthlyInHand * 12 * 0.65,
          600000 * inflationDiscountFactor
        );
        govCorpusAt60 = govTotalNominalWealth / displayDivisor;
        pvtCorpusAt60 = pvtTotalNominalWealth / displayDivisor;
      }
    }

    // --- 4. POST-RETIREMENT SURVIVAL ENGINE (AGE 61 TO 80) ---
    let annualLivingExpenseTarget = 0;
    if (age > 60) {
      const yearsIntoRetirement = age - 60;
      annualLivingExpenseTarget =
        baseAnnualLivingExpenseAt60 *
        Math.pow(1 + inputs.inflationRate / 100, yearsIntoRetirement);

      // Post-retirement balanced portfolio return (60% debt / 40% equity ~ 9.2% nominal)
      const postRetirePortfolioReturn =
        (inputs.govSipCagr * 0.45 + inputs.npsGovBondReturn * 0.55) / 100;

      if (inputs.govRetirementScheme === 'UPS') {
        // UPS Pension is strictly indexed to inflation via Dearness Relief (DR)
        govPostRetirementAnnualPension =
          govBasePensionAt60 *
          12 *
          Math.pow(1 + inputs.inflationRate / 100, yearsIntoRetirement);
      } else {
        // NPS 40% Annuity is fixed nominal payout
        govPostRetirementAnnualPension = govBasePensionAt60 * 12;
      }

      // Government post-retirement net withdrawal or surplus reinvestment
      const govNetCashflow = govPostRetirementAnnualPension - annualLivingExpenseTarget;
      govLiquidRetirementPool = Math.max(
        0,
        (govLiquidRetirementPool + govNetCashflow) * (1 + postRetirePortfolioReturn)
      );
      govTotalNominalWealth = govLiquidRetirementPool;

      // Private post-retirement SWP (100% funded from accumulated corpus)
      pvtLiquidRetirementPool = Math.max(
        0,
        (pvtLiquidRetirementPool - annualLivingExpenseTarget) * (1 + postRetirePortfolioReturn)
      );
      pvtTotalNominalWealth = pvtLiquidRetirementPool;
    } else if (age === 60) {
      annualLivingExpenseTarget = baseAnnualLivingExpenseAt60;
      govPostRetirementAnnualPension = govMonthlyPensionAt60 * 12;
    }

    records.push({
      age,
      year: calendarYear,
      isRetiredGov,
      isRetiredPvt,
      isPayCommissionYear,
      isGovPromotionYear,
      isPvtSwitchYear,
      isPvtLayoffYear,
      inflationDiscountFactor,

      govPayLevel: currentGovLevel,
      govMonthlyBasic: Math.round(govMonthlyBasic / displayDivisor),
      govDaPct: Math.round(govDaPct * 10) / 10,
      govHraPct,
      govMonthlyDA: Math.round(govMonthlyDA / displayDivisor),
      govMonthlyHRA: Math.round(govMonthlyHRA / displayDivisor),
      govMonthlyTA: Math.round(govMonthlyTA / displayDivisor),
      govAnnualGross: Math.round(govAnnualGross / displayDivisor),
      govAnnualTax: Math.round(govAnnualTax / displayDivisor),
      govEmployeePensionContrib: Math.round(govEmployeePensionContrib / displayDivisor),
      govEmployerPensionContrib: Math.round(govEmployerPensionContrib / displayDivisor),
      govAnnualNetInHand: Math.round(govAnnualNetInHand / displayDivisor),
      govMonthlyNetInHand: Math.round(govAnnualNetInHand / 12 / displayDivisor),
      govAnnualSipContribution: Math.round(govAnnualSipContribution / displayDivisor),
      govNpsCorpus: Math.round((age <= 60 ? govNpsCorpus : 0) / displayDivisor),
      govMfCorpus: Math.round((age <= 60 ? govMfCorpus : govLiquidRetirementPool) / displayDivisor),
      govGratuityAccrued: Math.round((age <= 60 ? govGratuityAccrued : 0) / displayDivisor),
      govTotalNetWorth: Math.round(govTotalNominalWealth / displayDivisor),
      govPostRetirementAnnualPension: Math.round(
        govPostRetirementAnnualPension / displayDivisor
      ),

      npsEquityWeight: Math.round(npsWeights.equity * 10) / 10,
      npsCorpBondWeight: Math.round(npsWeights.corpBonds * 10) / 10,
      npsGovBondWeight: Math.round(npsWeights.govBonds * 10) / 10,
      npsBlendedReturn: Math.round(npsBlendedReturn * 100) / 100,

      pvtAnnualCTC: Math.round(pvtAnnualCTC / displayDivisor),
      pvtMonthlyBasic: Math.round(pvtMonthlyBasic / displayDivisor),
      pvtAnnualGross: Math.round(pvtAnnualGross / displayDivisor),
      pvtAnnualTax: Math.round(pvtAnnualTax / displayDivisor),
      pvtEmployeeEpfContrib: Math.round(pvtEmployeeEpfContrib / displayDivisor),
      pvtEmployerEpfContrib: Math.round(pvtEmployerEpfContrib / displayDivisor),
      pvtAnnualNetInHand: Math.round(pvtAnnualNetInHand / displayDivisor),
      pvtMonthlyNetInHand: Math.round(pvtAnnualNetInHand / 12 / displayDivisor),
      pvtAnnualSipContribution: Math.round(pvtAnnualSipContribution / displayDivisor),
      pvtEpfCorpus: Math.round((age <= pvtRetirementAge ? pvtEpfCorpus : 0) / displayDivisor),
      pvtMfCorpus: Math.round(
        (age <= pvtRetirementAge ? pvtMfCorpus : pvtLiquidRetirementPool) / displayDivisor
      ),
      pvtGratuityAccrued: Math.round(
        (age <= pvtRetirementAge ? pvtGratuityAccrued : 0) / displayDivisor
      ),
      pvtTotalNetWorth: Math.round(pvtTotalNominalWealth / displayDivisor),

      annualLivingExpenseTarget: Math.round(annualLivingExpenseTarget / displayDivisor),
      govLiquidRetirementBalance: Math.round(
        (age >= 60 ? govLiquidRetirementPool : govTotalNominalWealth) / displayDivisor
      ),
      pvtLiquidRetirementBalance: Math.round(
        (age >= 60 ? pvtLiquidRetirementPool : pvtTotalNominalWealth) / displayDivisor
      ),
    });
  }

  // Detect Crossover Age (the exact age where one path overtakes the other in Total Net Worth)
  let crossoverAge: number | null = null;
  let crossoverDirection: 'PvtOvertakesGov' | 'GovOvertakesPvt' | 'None' = 'None';

  for (let i = 1; i < records.length; i++) {
    const prevDiff = records[i - 1].govTotalNetWorth - records[i - 1].pvtTotalNetWorth;
    const currDiff = records[i].govTotalNetWorth - records[i].pvtTotalNetWorth;

    if (prevDiff < 0 && currDiff >= 0) {
      crossoverAge = records[i].age;
      crossoverDirection = 'GovOvertakesPvt';
      break;
    } else if (prevDiff > 0 && currDiff <= 0) {
      crossoverAge = records[i].age;
      crossoverDirection = 'PvtOvertakesGov';
      break;
    }
  }

  const recordAt60 = records.find((r) => r.age === 60) || records[records.length - 1];
  const recordAt80 = records[records.length - 1];

  const discountAt60 = recordAt60.inflationDiscountFactor;
  const displayDivisorAt60 = inputs.valueMode === 'real' ? discountAt60 : 1;

  return {
    records,
    govLifetimeEarningsPostTax: Math.round(govLifetimeEarningsPostTax),
    pvtLifetimeEarningsPostTax: Math.round(pvtLifetimeEarningsPostTax),
    govCorpusAt60: recordAt60.govTotalNetWorth,
    pvtCorpusAt60: recordAt60.pvtTotalNetWorth,
    govCorpusAt80: recordAt80.govTotalNetWorth,
    pvtCorpusAt80: recordAt80.pvtTotalNetWorth,
    govMonthlyPensionAt60: Math.round(govMonthlyPensionAt60 / displayDivisorAt60),
    govRetirementLumpSumAt60: Math.round(govRetirementLumpSumAt60 / displayDivisorAt60),
    pvtFinalMonthlyInHand: Math.round(pvtFinalMonthlyInHand / displayDivisorAt60),
    govFinalMonthlyInHand: Math.round(govFinalMonthlyInHand / displayDivisorAt60),
    crossoverAge,
    crossoverDirection,
    winnerAt60:
      recordAt60.govTotalNetWorth >= recordAt60.pvtTotalNetWorth ? 'Government' : 'Private',
    winnerAt80:
      recordAt80.govTotalNetWorth >= recordAt80.pvtTotalNetWorth ? 'Government' : 'Private',
    wealthDeltaAt60: Math.abs(recordAt60.govTotalNetWorth - recordAt60.pvtTotalNetWorth),
    wealthDeltaAt80: Math.abs(recordAt80.govTotalNetWorth - recordAt80.pvtTotalNetWorth),
  };
}

export function runWealthSimulation(inputs: SimulationInputs): SimulationSummary {
  const mainResult = runCoreSimulation(inputs);

  let layoffWealthImpact = 0;
  if (inputs.layoffScenario !== 'none') {
    const baselineNoLayoff = runCoreSimulation({
      ...inputs,
      layoffScenario: 'none',
    });
    layoffWealthImpact = Math.max(0, baselineNoLayoff.pvtCorpusAt60 - mainResult.pvtCorpusAt60);
  }

  return {
    ...mainResult,
    layoffWealthImpact,
  };
}

/**
 * Formats INR amounts in Indian numbering system (Lakhs / Crores)
 */
export function formatINR(amount: number, compact = true): string {
  if (!Number.isFinite(amount)) return '₹0';
  const isNegative = amount < 0;
  const abs = Math.abs(amount);

  if (compact) {
    if (abs >= 10000000) {
      return `${isNegative ? '-' : ''}₹${(abs / 10000000).toFixed(2)} Cr`;
    }
    if (abs >= 100000) {
      return `${isNegative ? '-' : ''}₹${(abs / 100000).toFixed(2)} L`;
    }
    if (abs >= 1000) {
      return `${isNegative ? '-' : ''}₹${(abs / 1000).toFixed(1)} K`;
    }
  }

  return (
    (isNegative ? '-' : '') +
    '₹' +
    Math.round(abs).toLocaleString('en-IN')
  );
}
