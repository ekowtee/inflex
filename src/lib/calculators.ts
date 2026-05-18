/**
 * Labour + Outstation calculator helpers (spec §8.1, §8.2).
 *
 * Pure functions. Take primitives in, return numbers + markdown strings out.
 * No Prisma, no React.
 */

export interface LabourRoleRef {
  id: string;
  name: string;
  dailyRate: number;
  kind: "DIRECT" | "INDIRECT";
  outstationRate?: {
    feeding: number;
    localTransport: number;
    outstationCharge: number;
    misc: number;
    transportPerTrip: number;
    currency?: string;
  } | null;
}

export interface LabourEntryInput {
  roleId: string;
  days: number;
  indirectDays: number;
  description?: string | null;
  sortOrder?: number;
}

export interface OutstationEntryInput {
  roleId: string;
  staffCount: number;
  days: number;
  trips: number;
  description?: string | null;
  sortOrder?: number;
}

/**
 * Default indirect-day allocation per spec §8.1.
 *   Engineer I / Engineer II  → CEIL(days × 0.25, 0.5)
 *   Specialist                → CEIL(days × 0.25, 0.25)
 *   Term Worker / Technician  → 0
 *   Everyone else             → 0 (rep can override on the row)
 */
export function defaultIndirectDays(roleName: string, days: number): number {
  if (days <= 0) return 0;
  const raw = days * 0.25;
  const name = roleName.toLowerCase();
  if (name.startsWith("engineer")) {
    return ceilTo(raw, 0.5);
  }
  if (name.includes("specialist")) {
    return ceilTo(raw, 0.25);
  }
  return 0;
}

function ceilTo(value: number, step: number): number {
  if (step <= 0) return value;
  return Math.ceil(value / step) * step;
}

// ---------- Labour ----------

export interface LabourLineResult {
  landedCost: number;
  rows: LabourBreakdownRow[];
  specsMarkdown: string;
}

export interface LabourBreakdownRow {
  roleName: string;
  days: number;
  indirectDays: number;
  dailyRate: number;
  directSubtotal: number;
  indirectSubtotal: number;
  rowTotal: number;
}

export function priceLabour(
  entries: LabourEntryInput[],
  roles: LabourRoleRef[]
): LabourLineResult {
  const roleMap = new Map(roles.map((r) => [r.id, r]));
  const rows: LabourBreakdownRow[] = [];
  let landedCost = 0;

  for (const e of entries) {
    const role = roleMap.get(e.roleId);
    if (!role) continue;
    const days = Math.max(0, e.days);
    const indirectDays = Math.max(0, e.indirectDays);
    const directSubtotal = round2(days * role.dailyRate);
    const indirectSubtotal = round2(indirectDays * role.dailyRate);
    const rowTotal = round2(directSubtotal + indirectSubtotal);
    rows.push({
      roleName: role.name,
      days,
      indirectDays,
      dailyRate: role.dailyRate,
      directSubtotal,
      indirectSubtotal,
      rowTotal,
    });
    landedCost += rowTotal;
  }
  landedCost = round2(landedCost);

  return {
    landedCost,
    rows,
    specsMarkdown: renderLabourMarkdown(rows, landedCost),
  };
}

function renderLabourMarkdown(rows: LabourBreakdownRow[], total: number): string {
  if (rows.length === 0) return "No labour entries.";
  const header = "| Role | Days | Indirect | Daily rate | Row total |";
  const sep = "|---|---:|---:|---:|---:|";
  const body = rows
    .map(
      (r) =>
        `| ${r.roleName} | ${fmtDays(r.days)} | ${fmtDays(r.indirectDays)} | ${fmtMoney(
          r.dailyRate
        )} | ${fmtMoney(r.rowTotal)} |`
    )
    .join("\n");
  const totalRow = `| **Total** |  |  |  | **${fmtMoney(total)}** |`;
  return [header, sep, body, totalRow].join("\n");
}

// ---------- Outstation ----------

export interface OutstationLineResult {
  landedCost: number;
  rows: OutstationBreakdownRow[];
  specsMarkdown: string;
}

export interface OutstationBreakdownRow {
  roleName: string;
  staffCount: number;
  days: number;
  trips: number;
  roleDailyTotal: number;
  perDiemSubtotal: number;
  transportSubtotal: number;
  rowTotal: number;
}

export function priceOutstation(
  entries: OutstationEntryInput[],
  roles: LabourRoleRef[]
): OutstationLineResult {
  const roleMap = new Map(roles.map((r) => [r.id, r]));
  const rows: OutstationBreakdownRow[] = [];
  let landedCost = 0;

  for (const e of entries) {
    const role = roleMap.get(e.roleId);
    if (!role) continue;
    const rate = role.outstationRate;
    if (!rate) continue; // role has no outstation per-diems configured
    const staff = Math.max(1, Math.floor(e.staffCount));
    const days = Math.max(0, e.days);
    const trips = Math.max(0, Math.floor(e.trips));
    const roleDailyTotal = round2(
      rate.feeding + rate.localTransport + rate.outstationCharge + rate.misc
    );
    const perDiemSubtotal = round2(staff * days * roleDailyTotal);
    const transportSubtotal = round2(trips * rate.transportPerTrip);
    const rowTotal = round2(perDiemSubtotal + transportSubtotal);
    rows.push({
      roleName: role.name,
      staffCount: staff,
      days,
      trips,
      roleDailyTotal,
      perDiemSubtotal,
      transportSubtotal,
      rowTotal,
    });
    landedCost += rowTotal;
  }
  landedCost = round2(landedCost);

  return {
    landedCost,
    rows,
    specsMarkdown: renderOutstationMarkdown(rows, landedCost),
  };
}

function renderOutstationMarkdown(
  rows: OutstationBreakdownRow[],
  total: number
): string {
  if (rows.length === 0) return "No outstation entries.";
  const header =
    "| Role | Staff | Days | Trips | Per-diem | Transport | Row total |";
  const sep = "|---|---:|---:|---:|---:|---:|---:|";
  const body = rows
    .map(
      (r) =>
        `| ${r.roleName} | ${r.staffCount} | ${fmtDays(r.days)} | ${r.trips} | ${fmtMoney(
          r.perDiemSubtotal
        )} | ${fmtMoney(r.transportSubtotal)} | ${fmtMoney(r.rowTotal)} |`
    )
    .join("\n");
  const totalRow = `| **Total** |  |  |  |  |  | **${fmtMoney(total)}** |`;
  return [header, sep, body, totalRow].join("\n");
}

function round2(n: number) {
  return Math.round(n * 100) / 100;
}
function fmtMoney(n: number): string {
  return n.toFixed(2);
}
function fmtDays(n: number): string {
  return Number.isInteger(n) ? n.toFixed(0) : n.toFixed(2);
}
