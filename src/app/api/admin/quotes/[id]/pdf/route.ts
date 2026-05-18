import { NextRequest, NextResponse } from "next/server";
import { renderToBuffer } from "@react-pdf/renderer";
import { prisma } from "@/lib/prisma";
import { requireAdmin, currentSession } from "@/lib/guard";
import { BillingDocument } from "@/lib/pdf/BillingDocument";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const denied = await requireAdmin();
  if (denied) return denied;
  const { id } = await params;

  const requestedMode = new URL(req.url).searchParams.get("view");
  let mode: "customer" | "internal" =
    requestedMode === "internal" ? "internal" : "customer";

  // Internal view is DIRECTOR/FINANCE only — downgrade if a SALES user tries.
  if (mode === "internal") {
    const session = await currentSession();
    if (session?.user?.role !== "DIRECTOR" && session?.user?.role !== "FINANCE") {
      mode = "customer";
    }
  }

  const [quote, settings] = await Promise.all([
    prisma.quote.findUnique({
      where: { id },
      include: {
        customer: true,
        solutionArchitect: { select: { name: true } },
        whtCategory: true,
        items: { orderBy: { sortOrder: "asc" } },
      },
    }),
    prisma.companySettings.upsert({
      where: { id: "singleton" },
      create: {},
      update: {},
    }),
  ]);

  if (!quote) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const vatBreakdown = quote.vatBreakdown as
    | {
        nhilAmount: number;
        getfundAmount: number;
        vatStandardAmount: number;
        vatAmount: number;
        effectivePct: number;
        rates?: { standardPct: number; nhilPct: number; getfundPct: number };
      }
    | null;

  const whtPct =
    quote.whtCustomPct != null
      ? Number(quote.whtCustomPct)
      : quote.whtCategory
      ? Number(quote.whtCategory.rate)
      : 0;

  const buffer = await renderToBuffer(
    BillingDocument({
      mode,
      kind: "QUOTE",
      number: quote.number,
      status: quote.status,
      revision: quote.revision,
      issueDate: quote.createdAt,
      validUntil: quote.validUntil,
      currency: quote.currency,
      subtotal: quote.subtotal.toNumber(),
      vatBreakdown: quote.vatApplied && vatBreakdown ? vatBreakdown : null,
      vatAmount: quote.taxAmount.toNumber(),
      nonVatTaxApplied: quote.nonVatTaxApplied,
      nonVatTaxLabel: settings.nonVatTaxLabel,
      nonVatTaxPct:
        quote.nonVatTaxPct != null ? Number(quote.nonVatTaxPct) : undefined,
      nonVatTaxAmount:
        quote.nonVatTaxAmount != null ? Number(quote.nonVatTaxAmount) : undefined,
      total: quote.total.toNumber(),
      totalGp: quote.totalGp.toNumber(),
      totalGpMarginPct: Number(quote.totalGpMarginPct),
      fxRate: quote.fxRate != null ? Number(quote.fxRate) : null,
      fxRateSource: quote.fxRateSource,
      fxRateDate: quote.fxRateDate,
      whtPct: whtPct > 0 ? whtPct : undefined,
      whtCategoryLabel: quote.whtCategory?.label,
      projectTitle: quote.projectTitle,
      attentionTo: quote.attentionTo,
      solutionArchitectName: quote.solutionArchitect?.name,
      scopeOfWork: quote.scopeOfWork,
      notes: quote.notes,
      customer: {
        name: quote.customer.name,
        company: quote.customer.company,
        email: quote.customer.email,
        phone: quote.customer.phone,
      },
      company: { ...settings, vatRegistered: settings.vatRegistered },
      items: quote.items.map((i) => ({
        description: i.description,
        partNumber: i.partNumber,
        specs: i.specs,
        kind: i.kind,
        quantity: i.quantity.toNumber(),
        unitPrice: i.finalUnitPriceExclTax.toNumber(),
        landedCost: i.landedCost.toNumber(),
        financeChargePct: Number(i.financeChargePct),
        markupPct: Number(i.markupPct),
        surchargePct: Number(i.surchargePct),
        discountPct: Number(i.discountPct),
        whtGrossUpAmount: i.whtGrossUpAmount.toNumber(),
        costLineTotal: i.costLineTotal.toNumber(),
        lineGpAmount: i.lineGpAmount.toNumber(),
        lineGpMarginPct: Number(i.lineGpMarginPct),
      })),
    })
  );

  const filename = `${quote.number}${mode === "internal" ? "-internal" : ""}.pdf`;
  return new NextResponse(new Uint8Array(buffer), {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `inline; filename="${filename}"`,
    },
  });
}
