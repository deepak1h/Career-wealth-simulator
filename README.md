# Gov vs. Corp: The Ultimate Indian Career Wealth Simulator

**Live Application:** [https://indian-career-wealth-simulator.ai.studio](https://indian-career-wealth-simulator.ai.studio)

An interactive financial modeling and career wealth projection platform designed for Indian professionals, aspirants, and financial analysts. **Gov vs. Corp** compares the year-on-year salary trajectory, post-tax in-hand cashflows, retirement corpus, pension streams, and net worth compounding of an **Indian Central/State Government Career (7th CPC & Beyond)** against a **Private Sector Corporate Career** from entry age through age 80.

---

## Key Highlights

- **Authentic 7th Central Pay Commission (CPC) Engine**: Embedded Pay Matrix covering **Levels 1 to 18** (40 vertical seniority cells per level with ~3% annual progression), automatic HRA step-ups linked to Dearness Allowance (DA) thresholds, Transport Allowance (TA) with DA indexing, MACP/Cadre promotions, and 10-year Pay Commission fitment revisions.
- **NPS vs. UPS Retirement Architecture**:
  - **Unified Pension Scheme (UPS)**: Models 10% employee + 18.5% government contribution, guaranteed **50% inflation-indexed monthly pension** (with post-retirement Dearness Relief), and superannuation lump-sum payout.
  - **National Pension System (NPS)**: Models 10% employee + 14% government contribution with PFRDA **Auto-Choice Lifecycle (`LC75` / `LC50`)** automatic equity tapering from Age 36 to 55, 60% tax-free lump-sum withdrawal, and 40% annuity conversion at Age 60.
- **Private Sector Career & Stress-Test Engine**: Models Gross CTC to In-Hand breakdown, EPF compounding (12% Employee + 12% Employer), annual appraisals, periodic job-switch hikes up to a configurable **Career Plateau Age**, and an interactive **Layoff / Career Break Stress Simulator**.
- **Dynamic Indian New Tax Regime Calculator**: Applies FY 2025-26 / 2026-27 New Tax Regime slabs with ₹75,000 Standard Deduction, Section 87A rebate up to ₹12L taxable income, 4% Health & Education Cess, and periodic inflation indexation of tax brackets.
- **Nominal vs. Real Purchasing Power**: Instant toggle between **Future Nominal Value (₹)** and **Today's Purchasing Power (Inflation-Adjusted Real ₹)**.
- **Executive PDF & Excel (`.xlsx`) Export Suite**: One-click generation of a multi-page **Executive PDF Report** and a multi-sheet **Excel Workbook** containing the full year-by-year financial ledger.

---

## Core Financial Mechanics

### 1. Government Job Mechanics (7th CPC & Future Pay Commissions)

| Component | Financial Rule Implemented |
| :--- | :--- |
| **Pay Matrix (Levels 1–18)** | Complete 7th CPC matrix from Level 1 (₹18,000 Basic) to Level 10 Group-A Entry (₹56,100 Basic) up to Level 18 Cabinet Secretary (₹2,50,000 Basic), with manual Basic Pay override. |
| **Annual Increment** | Vertical cell progression (~3% per year rounded to nearest ₹100). |
| **Dearness Allowance (DA)** | Calculated as a percentage of Basic Pay; increases twice a year (January & July). |
| **House Rent Allowance (HRA)** | Based on City Class (`X = 24%`, `Y = 16%`, `Z = 8%` base). Automatically steps up to **27% / 18% / 9%** when DA crosses **25%**, and **30% / 20% / 10%** when DA crosses **50%**. |
| **Transport Allowance (TA)** | Level-linked base (`₹1,350`, `₹3,600`, or `₹7,200` by Pay Level & City Tier) + `DA% on TA`. |
| **10-Year Pay Commissions** | Every 10th year (2027/8th CPC, 2036/9th CPC, 2046/10th CPC, 2056/11th CPC), accumulated DA merges into Basic Pay and resets to `0%`, multiplied by a configurable **Real Fitment Hike %**. |
| **Promotions (MACP / Cadre)** | Upgrades Pay Level at user-defined intervals (e.g., every 8 or 10 years) with fixation increment. |
| **Gratuity** | Tax-free retirement payout calculated as `(15 / 26) × Last Drawn (Basic + DA) × Years of Service`, subject to statutory ceiling revisions. |

### 2. Private Sector Job Mechanics

| Component | Financial Rule Implemented |
| :--- | :--- |
| **CTC Breakdown** | Splits Annual CTC into Basic Pay (% of CTC), Employer/Employee EPF (12% + 12% of Basic), Fixed Allowances, and Variable Bonus (with realistic payout realization). |
| **EPF Compounding** | 12% Employee + 12% Employer contribution compounded annually at a configurable EPF interest rate (default `8.15%`). |
| **Appraisals & Job Switches** | Combines regular annual appraisal increments with periodic job-switch jumps (e.g., `+30%` every 3 years) up to a configurable **Career Plateau Age** (default Age 45), after which switch spikes cease and increments normalize. |
| **Layoff Stress Simulator** | Simulates 1 or 2 six-month career breaks/layoffs—halving active income for that year, forfeiting variable bonus, pausing EPF/SIP contributions, and drawing emergency living expenses from liquid mutual fund reserves. |

### 3. Post-Retirement Cashflow Survival (Age 60 to 80+)

- **Government Path**: Models monthly pension inflows (**UPS** inflation-indexed pension with Dearness Relief or **NPS** 40% annuity payout) offsetting inflation-adjusted post-retirement living expenses, while the Personal Mutual Fund SIP corpus + lump-sum superannuation benefits continue compounding.
- **Private Path**: Models a **Systematic Withdrawal Plan (SWP)** from the combined EPF + Mutual Fund + Gratuity corpus to fund inflation-indexed living expenses from retirement until life expectancy.

---

## Interactive Visualizations & Modules

1. **KPI Executive Summary Strip**:
   - **Government Career Card**: Corpus at Age 60, Lifetime Post-Tax Earnings, Year-1 In-Hand, and Monthly Pension at Age 60.
   - **Private Career Card**: Corpus at Age 60, Lifetime Post-Tax Earnings, Year-1 In-Hand, and Peak Monthly In-Hand.
   - **Crossover Age & Risk Card**: Identifies the exact age at which one career path overtakes the other in total net worth, plus Age 80 residual estate balances.
   - **Dynamic Winner Verdict**: Instant financial verdict at Age 60 and Age 80.
2. **01. Master Post-Tax In-Hand Salary Trajectory**: Dual-line chart with Monthly/Annual cadence toggle, interactive age-range zoom brush, and vertical markers highlighting 10-year Pay Commission spikes and Private job switches.
3. **02. Total Wealth & Investment Compounding Graph**: Area chart comparing total net worth with a toggle to inspect individual wealth buckets (*NPS/UPS Pool vs. EPF vs. Personal MF SIP*).
4. **03. Post-Retirement Cashflow Survival (Age 60 to 80+)**: Tracks corpus resilience and SWP drawdowns during retirement years.
5. **04. NPS Auto-Choice Lifecycle Glidepath (`LC75` / `LC50`)**: Stacked area chart illustrating the automatic PFRDA equity tapering from Age 36 to 55 into Corporate Bonds and Government Securities.
6. **05. Intangible Benefits & Non-Salary Perks Matrix**: Side-by-side scoring and imputed annual monetary valuation of **CGHS Lifetime Free Healthcare**, **Central Pool Quarters**, **Article 311 Job Security**, **LTC & Children Education Allowance (CEA)**, and **HBA** against **Corporate Health Insurance**, **ESOPs/RSUs**, **Global Mobility**, and **Hybrid Work Flexibility**.
7. **06. Year-by-Year Financial Ledger & Export Suite**: Searchable, filterable annual audit table with one-click exports to `.xlsx` and `.pdf`.

---

## Benchmark Career Presets Included

- **UPSC Group-A (IAS / IRS / IES — Level 10, ₹56,100 Basic)** vs. **Tier-1 Product SDE (₹24 LPA)**
- **SSC CGL Inspector / ASO (Level 7, ₹44,900 Basic)** vs. **Mid-Tier IT / Analyst (₹12 LPA)**
- **Section / Audit Officer (AAO — Level 8, ₹47,600 Basic)** vs. **Corporate Finance / MBA (₹18 LPA)**
- **CPWD / Railway Junior Engineer (Level 6, ₹35,400 Basic)** vs. **Core Sector Engineer (₹7.5 LPA)**

---

## Tech Stack

- **Frontend Framework**: React 19 + TypeScript + Vite
- **Styling**: Tailwind CSS v4 (`Plus Jakarta Sans`, `Public Sans`, and `JetBrains Mono` tabular numerals)
- **Data Visualization**: Recharts (Responsive interactive line & stacked area charts with custom tooltips, reference markers, and brush zoom)
- **Report Generation**: `jspdf` + `html2canvas` (Multi-page Executive PDF Report) & `xlsx` (Multi-sheet Excel Workbook export)
- **Icons**: `lucide-react`

---

## Project Structure

```text
├── index.html                              # App entry point & typography setup
├── metadata.json                           # Application metadata
├── package.json                            # Dependencies & build scripts
├── src/
│   ├── App.tsx                             # Main workspace layout, KPI strip & state orchestration
│   ├── index.css                           # Tailwind v4 theme & tabular numeral utilities
│   ├── main.tsx                            # React DOM root
│   ├── components/
│   │   ├── ControlSidebar.tsx              # 3-tab parameter sidebar with dropdowns & numeric inputs
│   │   ├── DashboardCharts.tsx             # 4 interactive Recharts visualizations
│   │   ├── OnboardingWizardModal.tsx       # 3-step guided configuration modal
│   │   └── PerksComparatorAndLedger.tsx    # Intangible perks matrix & searchable year-on-year ledger
│   ├── data/
│   │   └── cpcMatrix.ts                    # 7th CPC Levels 1–18 matrix, career presets & perks data
│   └── utils/
│       ├── exportSuite.ts                  # Excel (.xlsx) & multi-page PDF report generators
│       └── financialEngine.ts              # Core 7th CPC, NPS/UPS, EPF, SWP & New Tax Regime engine
└── vite.config.ts                          # Vite configuration
```

---

## Local Development Setup

### Prerequisites
- **Node.js** (v18+ recommended)
- **npm** (v9+ recommended)

### Installation & Running Locally

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Start the development server**:
   ```bash
   npm run dev
   ```
   Open `http://localhost:3000` in your browser.

3. **Build for production**:
   ```bash
   npm run build
   ```

4. **Type-check the codebase**:
   ```bash
   npm run lint
   ```

---

## Live Demo

Explore the live simulator at: **[https://indian-career-wealth-simulator.ai.studio](https://indian-career-wealth-simulator.ai.studio)**
