/**
 * Seed: Markup tiers, labour roles + outstation rates, WHT categories.
 * Idempotent — safe to re-run; upserts by stable unique keys.
 *
 * Run: npm run db:seed
 */
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("→ Seeding markup tiers…");
  await seedMarkupTiers();

  console.log("→ Seeding labour roles + outstation rates…");
  await seedLabourRoles();

  console.log("→ Seeding WHT categories…");
  await seedWhtCategories();

  console.log("→ Ensuring CompanySettings singleton exists…");
  await prisma.companySettings.upsert({
    where: { id: "singleton" },
    create: {},
    update: {},
  });

  console.log("✓ Seed complete.");
}

async function seedMarkupTiers() {
  const tiers = [
    { name: "Standard", pct: 5, isDefault: true, carriesFinanceCharge: true, sortOrder: 10 },
    { name: "Systimax", pct: 30, carriesFinanceCharge: true, sortOrder: 20 },
    { name: "Networking", pct: 10, carriesFinanceCharge: true, sortOrder: 30 },
    { name: "Security", pct: 15, carriesFinanceCharge: true, sortOrder: 40 },
    { name: "Labour", pct: 100, carriesFinanceCharge: false, sortOrder: 50 },
    { name: "Outstation", pct: 25, carriesFinanceCharge: false, sortOrder: 60 },
    { name: "Pass-through", pct: 0, carriesFinanceCharge: false, sortOrder: 70 },
  ];
  for (const t of tiers) {
    await prisma.markupTier.upsert({
      where: { name: t.name },
      create: t,
      update: {
        pct: t.pct,
        isDefault: t.isDefault ?? false,
        carriesFinanceCharge: t.carriesFinanceCharge,
        sortOrder: t.sortOrder,
      },
    });
  }
}

async function seedLabourRoles() {
  // Daily rates and outstation per-diems based on the reference workbook.
  // Edit from /admin/settings/labour-roles once that page ships.
  const roles = [
    { name: "Term Worker",    dailyRate: 250,  kind: "DIRECT",   sortOrder: 10, out: { feeding: 80,  localTransport: 30, outstationCharge: 100, misc: 0,  transportPerTrip: 150 } },
    { name: "Technician",     dailyRate: 400,  kind: "DIRECT",   sortOrder: 20, out: { feeding: 100, localTransport: 50, outstationCharge: 150, misc: 0,  transportPerTrip: 200 } },
    { name: "Sr Technician",  dailyRate: 600,  kind: "DIRECT",   sortOrder: 30, out: { feeding: 120, localTransport: 60, outstationCharge: 200, misc: 0,  transportPerTrip: 200 } },
    { name: "Engineer I",     dailyRate: 900,  kind: "DIRECT",   sortOrder: 40, out: { feeding: 150, localTransport: 80, outstationCharge: 300, misc: 50, transportPerTrip: 300 } },
    { name: "Engineer II",    dailyRate: 1300, kind: "DIRECT",   sortOrder: 50, out: { feeding: 180, localTransport: 100, outstationCharge: 400, misc: 50, transportPerTrip: 300 } },
    { name: "Specialist",     dailyRate: 1800, kind: "DIRECT",   sortOrder: 60, out: { feeding: 220, localTransport: 120, outstationCharge: 500, misc: 80, transportPerTrip: 400 } },
    { name: "Consultant",     dailyRate: 2500, kind: "DIRECT",   sortOrder: 70, out: { feeding: 280, localTransport: 150, outstationCharge: 700, misc: 100, transportPerTrip: 500 } },
    { name: "Project Manager",dailyRate: 1500, kind: "INDIRECT", sortOrder: 80, out: { feeding: 200, localTransport: 100, outstationCharge: 400, misc: 50, transportPerTrip: 350 } },
  ] as const;

  for (const r of roles) {
    const role = await prisma.labourRole.upsert({
      where: { name: r.name },
      create: {
        name: r.name,
        dailyRate: r.dailyRate,
        kind: r.kind,
        sortOrder: r.sortOrder,
      },
      update: {
        dailyRate: r.dailyRate,
        kind: r.kind,
        sortOrder: r.sortOrder,
      },
    });
    await prisma.outstationRate.upsert({
      where: { roleId: role.id },
      create: { roleId: role.id, ...r.out },
      update: r.out,
    });
  }
}

async function seedWhtCategories() {
  const categories = [
    { code: "NONE",                       label: "No withholding",                   rate: 0,    sortOrder: 10, description: "Customer has a valid WHT exemption certificate." },
    { code: "GOODS_3",                    label: "Goods (3%)",                       rate: 3,    sortOrder: 20, description: "Supply of goods (hardware-only quotes)." },
    { code: "WORKS_5",                    label: "Works / contracts (5%)",           rate: 5,    sortOrder: 30, description: "Works or construction-style contracts." },
    { code: "SERVICES_RESIDENT_7_5",      label: "Services — resident (7.5%)",       rate: 7.5,  sortOrder: 40, description: "Services to a resident person. Inflexions' default.", isDefault: true },
    { code: "MGMT_TECH_NONRESIDENT_25",   label: "Mgmt/Technical — non-resident (25%)", rate: 25, sortOrder: 50, description: "Management or technical fees paid to a non-resident person. Up from 20% pre-2026." },
    { code: "VAT_AGENT_7",                label: "VAT agent withholding (7%)",       rate: 7,    sortOrder: 60, description: "Customer is a GRA-appointed VAT-registered withholding agent." },
    { code: "CUSTOM",                     label: "Custom rate",                      rate: 0,    sortOrder: 70, description: "Treaty-relieved rates or special arrangements. Requires reason note." },
  ];
  for (const c of categories) {
    await prisma.whtCategory.upsert({
      where: { code: c.code },
      create: c,
      update: {
        label: c.label,
        rate: c.rate,
        sortOrder: c.sortOrder,
        description: c.description,
        // Don't override isDefault on existing rows so manual edits stick.
      },
    });
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
