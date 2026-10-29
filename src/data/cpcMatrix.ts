export interface PayLevelData {
  level: number;
  label: string;
  gradePayEquivalent: string;
  typicalRoles: string;
  baseTA: number; // Base Transport Allowance in X-class cities (7th CPC)
  cells: number[]; // Vertical progression (~3% annual increment rounded to nearest 100 as per 7th CPC table)
}

function generateCPCCells(entryBasic: number, count: number): number[] {
  const cells: number[] = [entryBasic];
  for (let i = 1; i < count; i++) {
    const prev = cells[i - 1];
    // Official 7th CPC rule: 3% increment rounded off to nearest ₹100
    const next = Math.round((prev * 1.03) / 100) * 100;
    cells.push(next);
  }
  return cells;
}

export const CPC_PAY_MATRIX: PayLevelData[] = [
  {
    level: 1,
    label: 'Level 1 (GP ₹1,800)',
    gradePayEquivalent: '₹1,800',
    typicalRoles: 'MTS, Railway Track Maintainer, Group C Entry',
    baseTA: 1350,
    cells: generateCPCCells(18000, 40),
  },
  {
    level: 2,
    label: 'Level 2 (GP ₹1,900)',
    gradePayEquivalent: '₹1,900',
    typicalRoles: 'Lower Division Clerk (LDC), Junior Secretariat Assistant',
    baseTA: 1350,
    cells: generateCPCCells(19900, 40),
  },
  {
    level: 3,
    label: 'Level 3 (GP ₹2,000)',
    gradePayEquivalent: '₹2,000',
    typicalRoles: 'Constable (CAPF/Police), Skilled Artisan, Postal Assistant',
    baseTA: 3600,
    cells: generateCPCCells(21700, 40),
  },
  {
    level: 4,
    label: 'Level 4 (GP ₹2,400)',
    gradePayEquivalent: '₹2,400',
    typicalRoles: 'Upper Division Clerk (UDC), Tax Assistant (CBDT/CBIC), Stenographer Gr. D',
    baseTA: 3600,
    cells: generateCPCCells(25500, 40),
  },
  {
    level: 5,
    label: 'Level 5 (GP ₹2,800)',
    gradePayEquivalent: '₹2,800',
    typicalRoles: 'Auditor (CAG/CGDA), Senior Tax Assistant, Head Constable',
    baseTA: 3600,
    cells: generateCPCCells(29200, 40),
  },
  {
    level: 6,
    label: 'Level 6 (GP ₹4,200)',
    gradePayEquivalent: '₹4,200',
    typicalRoles: 'Junior Engineer (CPWD/Railways), Sub-Inspector (CPO), Divisional Accountant',
    baseTA: 3600,
    cells: generateCPCCells(35400, 40),
  },
  {
    level: 7,
    label: 'Level 7 (GP ₹4,600)',
    gradePayEquivalent: '₹4,600',
    typicalRoles: 'ASO (CSS/MEA), Income Tax / GST Inspector (SSC CGL), Nursing Officer',
    baseTA: 3600,
    cells: generateCPCCells(44900, 40),
  },
  {
    level: 8,
    label: 'Level 8 (GP ₹4,800)',
    gradePayEquivalent: '₹4,800',
    typicalRoles: 'Assistant Audit Officer (AAO - CAG), Section Officer, PGT Teacher',
    baseTA: 3600,
    cells: generateCPCCells(47600, 40),
  },
  {
    level: 9,
    label: 'Level 9 (GP ₹5,400 Non-Func)',
    gradePayEquivalent: '₹5,400 (Group B)',
    typicalRoles: 'Senior Section Officer (4-Yr NFU), Accounts Officer',
    baseTA: 7200,
    cells: generateCPCCells(53100, 40),
  },
  {
    level: 10,
    label: 'Level 10 (GP ₹5,400 Group A)',
    gradePayEquivalent: '₹5,400 (Group A Entry)',
    typicalRoles: 'IAS / IPS / IFS / IRS / IES Entry (UPSC CSE), Scientist B (ISRO/DRDO), Assistant Professor',
    baseTA: 7200,
    cells: generateCPCCells(56100, 40),
  },
  {
    level: 11,
    label: 'Level 11 (GP ₹6,600)',
    gradePayEquivalent: '₹6,600',
    typicalRoles: 'Under Secretary, Deputy Commissioner, Scientist C, Executive Engineer',
    baseTA: 7200,
    cells: generateCPCCells(67700, 39),
  },
  {
    level: 12,
    label: 'Level 12 (GP ₹7,600)',
    gradePayEquivalent: '₹7,600',
    typicalRoles: 'Deputy Secretary, Joint Commissioner, Scientist D, Selection Grade Officer',
    baseTA: 7200,
    cells: generateCPCCells(78800, 34),
  },
  {
    level: 13,
    label: 'Level 13 (GP ₹8,700)',
    gradePayEquivalent: '₹8,700',
    typicalRoles: 'Director, Additional Commissioner, Scientist F, Superintending Engineer',
    baseTA: 7200,
    cells: generateCPCCells(123100, 20),
  },
  {
    level: 14,
    label: 'Level 14 (GP ₹10,000)',
    gradePayEquivalent: '₹10,000 (HAG)',
    typicalRoles: 'Joint Secretary to Govt. of India, Major General, Scientist G, Chief Engineer',
    baseTA: 7200,
    cells: generateCPCCells(144200, 15),
  },
  {
    level: 15,
    label: 'Level 15 (HAG+)',
    gradePayEquivalent: 'HAG+ Scale',
    typicalRoles: 'Additional Secretary to Govt. of India, Principal Chief Commissioner, Lt. General',
    baseTA: 7200,
    cells: generateCPCCells(182200, 8),
  },
  {
    level: 16,
    label: 'Level 16 (Apex Scale - I)',
    gradePayEquivalent: 'HAG++ Scale',
    typicalRoles: 'DG of Police, Post Master General, Senior Additional Secretary',
    baseTA: 7200,
    cells: generateCPCCells(205400, 4),
  },
  {
    level: 17,
    label: 'Level 17 (Apex Fixed)',
    gradePayEquivalent: 'Apex Scale',
    typicalRoles: 'Secretary to Govt. of India, Chief Secretary of State',
    baseTA: 7200,
    cells: [225000],
  },
  {
    level: 18,
    label: 'Level 18 (Cabinet Sec.)',
    gradePayEquivalent: 'Cabinet Secretary',
    typicalRoles: 'Cabinet Secretary of India, Chief of Defence Staff (CDS)',
    baseTA: 7200,
    cells: [250000],
  },
];

export interface CareerPreset {
  id: string;
  name: string;
  subtitle: string;
  govLevel: number;
  govCellIndex: number;
  govPromotionInterval: number;
  pvtStartingCTC: number; // Annual in INR
  pvtBasicPercent: number;
  pvtVariablePercent: number;
  pvtAnnualAppraisal: number;
  pvtSwitchHike: number;
}

export const CAREER_PRESETS: CareerPreset[] = [
  {
    id: 'upsc-vs-tier1-sde',
    name: 'UPSC Group-A (IAS/IRS/IES) vs. Tier-1 Product SDE',
    subtitle: 'Level 10 Entry (₹56,100 Basic) vs. ₹24 LPA Tech Package',
    govLevel: 10,
    govCellIndex: 0,
    govPromotionInterval: 8,
    pvtStartingCTC: 2400000,
    pvtBasicPercent: 45,
    pvtVariablePercent: 12,
    pvtAnnualAppraisal: 9,
    pvtSwitchHike: 32,
  },
  {
    id: 'ssc-cgl-vs-mid-it',
    name: 'SSC CGL Inspector / ASO vs. Mid-Tier IT / Analyst',
    subtitle: 'Level 7 Entry (₹44,900 Basic) vs. ₹12 LPA Corporate Role',
    govLevel: 7,
    govCellIndex: 0,
    govPromotionInterval: 10,
    pvtStartingCTC: 1200000,
    pvtBasicPercent: 45,
    pvtVariablePercent: 10,
    pvtAnnualAppraisal: 8,
    pvtSwitchHike: 30,
  },
  {
    id: 'cag-aao-vs-mba',
    name: 'Section / Audit Officer (AAO) vs. Corporate Finance / MBA',
    subtitle: 'Level 8 Entry (₹47,600 Basic) vs. ₹18 LPA Consulting Role',
    govLevel: 8,
    govCellIndex: 0,
    govPromotionInterval: 9,
    pvtStartingCTC: 1800000,
    pvtBasicPercent: 42,
    pvtVariablePercent: 15,
    pvtAnnualAppraisal: 8.5,
    pvtSwitchHike: 28,
  },
  {
    id: 'je-vs-core-eng',
    name: 'CPWD / Railway Junior Engineer vs. Core Sector Engineer',
    subtitle: 'Level 6 Entry (₹35,400 Basic) vs. ₹7.5 LPA Core Engineering',
    govLevel: 6,
    govCellIndex: 0,
    govPromotionInterval: 10,
    pvtStartingCTC: 750000,
    pvtBasicPercent: 50,
    pvtVariablePercent: 8,
    pvtAnnualAppraisal: 7.5,
    pvtSwitchHike: 25,
  },
];

export interface IntangiblePerkItem {
  category: string;
  govTitle: string;
  govScore: number; // out of 10
  govMonetaryEquivalentAnnual: number;
  govDetails: string;
  pvtTitle: string;
  pvtScore: number; // out of 10
  pvtMonetaryEquivalentAnnual: number;
  pvtDetails: string;
}

export const INTANGIBLE_PERKS: IntangiblePerkItem[] = [
  {
    category: 'Healthcare & Medical Security',
    govTitle: 'CGHS Lifetime Cashless Healthcare',
    govScore: 10,
    govMonetaryEquivalentAnnual: 120000,
    govDetails: 'Covers employee, spouse, dependent parents & children for life—including post-retirement critical surgeries without sum-insured caps.',
    pvtTitle: 'Corporate Group Health Cover',
    pvtScore: 7,
    pvtMonetaryEquivalentAnnual: 45000,
    pvtDetails: '₹5L–₹15L floater policy active only while employed; post-retirement senior citizen premiums must be self-funded at high market rates.',
  },
  {
    category: 'Housing & Real Estate Utility',
    govTitle: 'Type III–VI Central Pool Quarters',
    govScore: 9,
    govMonetaryEquivalentAnnual: 480000,
    govDetails: 'Prime central city accommodations (Lutyens / Civil Lines / Cantonments) worth ₹40k–₹1.5L/mo in private rent, traded against nominal HRA foregone.',
    pvtTitle: 'HRA Tax Exemption / Lease Policy',
    pvtScore: 5,
    pvtMonetaryEquivalentAnnual: 60000,
    pvtDetails: 'Market rent paid out-of-pocket in expensive tech corridors (Bengaluru/Gurgaon/Mumbai); minimal tax shield under New Tax Regime.',
  },
  {
    category: 'Tenure & Macro-Economic Immunity',
    govTitle: 'Article 311 Sovereign Job Security',
    govScore: 10,
    govMonetaryEquivalentAnnual: 250000,
    govDetails: 'Zero layoff risk during AI disruption, recessions, or industry downturns; enables lower emergency cash buffers and higher peace of mind.',
    pvtTitle: 'At-Will Employment & Market Beta',
    pvtScore: 4,
    pvtMonetaryEquivalentAnnual: 0,
    pvtDetails: 'High exposure to restructuring, tech cycles, and post-age-45 pyramid compression; requires maintaining a 12-month liquid contingency fund.',
  },
  {
    category: 'Travel, Education & Family Allowances',
    govTitle: 'LTC + Children Education Allowance (CEA)',
    govScore: 9,
    govMonetaryEquivalentAnnual: 110000,
    govDetails: '₹2,812.50/mo per child CEA (up to 2 kids, auto-hiked 25% when DA hits 50%) + All-India Leave Travel Concession airfare every 4-year block.',
    pvtTitle: 'LTA & Corporate Wellness Allowances',
    pvtScore: 6,
    pvtMonetaryEquivalentAnnual: 50000,
    pvtDetails: 'Mostly folded into taxable Gross CTC; select Tier-1 firms offer daycare reimbursement and wellness stipends.',
  },
  {
    category: 'Equity Upside & Global Mobility',
    govTitle: 'Deputation & Foreign Postings (Limited)',
    govScore: 5,
    govMonetaryEquivalentAnnual: 40000,
    govDetails: 'Foreign postings mostly restricted to MEA, Defence attachés, or UN/World Bank deputations for top cadres; zero equity participation.',
    pvtTitle: 'ESOPs / RSUs & Global On-Site Mobility',
    pvtScore: 10,
    pvtMonetaryEquivalentAnnual: 450000,
    pvtDetails: 'Uncapped asymmetric upside via public tech RSUs, startup liquidity events, dollar-denominated remote roles, and international relocation.',
  },
  {
    category: 'Credit Access, Advances & Workspace',
    govTitle: 'HBA (House Building Advance) & CSD Canteen',
    govScore: 8,
    govMonetaryEquivalentAnnual: 85000,
    govDetails: 'Concessional simple-interest House Building Advance up to ₹25L, computer advances, and subsidized canteen/welfare ecosystem.',
    pvtTitle: 'Modern Campus, Remote Flexibility & Perks',
    pvtScore: 9,
    pvtMonetaryEquivalentAnnual: 120000,
    pvtDetails: 'Hybrid work-from-home savings, ergonomic home-office budgets, free campus meals, cab transport, and meritocratic fast-track promotions.',
  },
];
