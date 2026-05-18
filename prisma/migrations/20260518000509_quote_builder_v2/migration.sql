-- CreateEnum
CREATE TYPE "LineKind" AS ENUM ('PRODUCT', 'LABOUR', 'OUTSTATION', 'FINANCE_CHARGE', 'OTHER');

-- CreateEnum
CREATE TYPE "LabourKind" AS ENUM ('DIRECT', 'INDIRECT');

-- AlterEnum
ALTER TYPE "QuoteStatus" ADD VALUE 'PENDING_APPROVAL';

-- AlterEnum
ALTER TYPE "UserRole" ADD VALUE 'SALES';

-- AlterTable
ALTER TABLE "CompanySettings" ADD COLUMN     "covidLevyPct" DECIMAL(5,2) NOT NULL DEFAULT 0.00,
ADD COLUMN     "defaultAdvancePaymentPct" DECIMAL(5,2) NOT NULL DEFAULT 0.00,
ADD COLUMN     "defaultAnnualInterestRatePct" DECIMAL(5,2) NOT NULL DEFAULT 22.00,
ADD COLUMN     "defaultFxRateSource" TEXT NOT NULL DEFAULT 'cedirates.com',
ADD COLUMN     "defaultFxUsdGhsRate" DECIMAL(12,6),
ADD COLUMN     "defaultProjectCycleWeeks" INTEGER NOT NULL DEFAULT 8,
ADD COLUMN     "getfundPct" DECIMAL(5,2) NOT NULL DEFAULT 2.50,
ADD COLUMN     "nhilPct" DECIMAL(5,2) NOT NULL DEFAULT 2.50,
ADD COLUMN     "nonVatTaxApplied" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "nonVatTaxLabel" TEXT NOT NULL DEFAULT 'Sales Tax',
ADD COLUMN     "nonVatTaxOnGoodsPct" DECIMAL(5,2) NOT NULL DEFAULT 3.00,
ADD COLUMN     "nonVatTaxOnServicesPct" DECIMAL(5,2) NOT NULL DEFAULT 0.00,
ADD COLUMN     "roundingIncrementAbove" DECIMAL(12,4) NOT NULL DEFAULT 1.00,
ADD COLUMN     "roundingIncrementBelow" DECIMAL(12,4) NOT NULL DEFAULT 0.01,
ADD COLUMN     "roundingThreshold" DECIMAL(12,2) NOT NULL DEFAULT 70.00,
ADD COLUMN     "vatRegistered" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "vatRegisteredSince" TIMESTAMP(3),
ADD COLUMN     "vatStandardPct" DECIMAL(5,2) NOT NULL DEFAULT 15.00;

-- AlterTable
ALTER TABLE "LineItem" ADD COLUMN     "costLineTotal" DECIMAL(12,2) NOT NULL DEFAULT 0,
ADD COLUMN     "discountPct" DECIMAL(5,2) NOT NULL DEFAULT 0,
ADD COLUMN     "finalLineTotalExclTax" DECIMAL(12,2) NOT NULL DEFAULT 0,
ADD COLUMN     "finalUnitPriceExclTax" DECIMAL(12,2) NOT NULL DEFAULT 0,
ADD COLUMN     "financeChargePct" DECIMAL(8,4) NOT NULL DEFAULT 0,
ADD COLUMN     "kind" "LineKind" NOT NULL DEFAULT 'PRODUCT',
ADD COLUMN     "landedCost" DECIMAL(12,2) NOT NULL DEFAULT 0,
ADD COLUMN     "landedCostCurrency" TEXT NOT NULL DEFAULT 'GHS',
ADD COLUMN     "lineGpAmount" DECIMAL(12,2) NOT NULL DEFAULT 0,
ADD COLUMN     "lineGpMarginPct" DECIMAL(6,3) NOT NULL DEFAULT 0,
ADD COLUMN     "markupPct" DECIMAL(5,2) NOT NULL DEFAULT 0,
ADD COLUMN     "markupTierId" TEXT,
ADD COLUMN     "partNumber" TEXT,
ADD COLUMN     "specs" TEXT,
ADD COLUMN     "surchargePct" DECIMAL(5,2) NOT NULL DEFAULT 0,
ADD COLUMN     "whtGrossUpAmount" DECIMAL(12,2) NOT NULL DEFAULT 0;

-- AlterTable
ALTER TABLE "Quote" ADD COLUMN     "advancePaymentPct" DECIMAL(5,2) NOT NULL DEFAULT 0,
ADD COLUMN     "annualInterestRatePct" DECIMAL(5,2) NOT NULL DEFAULT 0,
ADD COLUMN     "attentionTo" TEXT,
ADD COLUMN     "fxRate" DECIMAL(12,6),
ADD COLUMN     "fxRateDate" TIMESTAMP(3),
ADD COLUMN     "fxRateSource" TEXT DEFAULT 'cedirates.com',
ADD COLUMN     "lockedAt" TIMESTAMP(3),
ADD COLUMN     "nonVatTaxAmount" DECIMAL(12,2),
ADD COLUMN     "nonVatTaxApplied" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "nonVatTaxPct" DECIMAL(5,2),
ADD COLUMN     "projectCycleWeeks" INTEGER NOT NULL DEFAULT 8,
ADD COLUMN     "projectTitle" TEXT,
ADD COLUMN     "revision" INTEGER NOT NULL DEFAULT 1,
ADD COLUMN     "solutionArchitectId" TEXT,
ADD COLUMN     "totalGp" DECIMAL(12,2) NOT NULL DEFAULT 0,
ADD COLUMN     "totalGpMarginPct" DECIMAL(6,3) NOT NULL DEFAULT 0,
ADD COLUMN     "vatApplied" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "vatBreakdown" JSONB,
ADD COLUMN     "whtCategoryId" TEXT,
ADD COLUMN     "whtCustomPct" DECIMAL(5,2);

-- CreateTable
CREATE TABLE "MarkupTier" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "pct" DECIMAL(5,2) NOT NULL,
    "isDefault" BOOLEAN NOT NULL DEFAULT false,
    "carriesFinanceCharge" BOOLEAN NOT NULL DEFAULT true,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "MarkupTier_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "LabourRole" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "dailyRate" DECIMAL(12,2) NOT NULL,
    "currency" TEXT NOT NULL DEFAULT 'GHS',
    "kind" "LabourKind" NOT NULL DEFAULT 'DIRECT',
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "LabourRole_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "OutstationRate" (
    "id" TEXT NOT NULL,
    "roleId" TEXT NOT NULL,
    "feeding" DECIMAL(12,2) NOT NULL DEFAULT 0,
    "localTransport" DECIMAL(12,2) NOT NULL DEFAULT 0,
    "outstationCharge" DECIMAL(12,2) NOT NULL DEFAULT 0,
    "misc" DECIMAL(12,2) NOT NULL DEFAULT 0,
    "transportPerTrip" DECIMAL(12,2) NOT NULL DEFAULT 0,
    "currency" TEXT NOT NULL DEFAULT 'GHS',
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "OutstationRate_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "LabourEntry" (
    "id" TEXT NOT NULL,
    "lineItemId" TEXT NOT NULL,
    "roleId" TEXT NOT NULL,
    "days" DECIMAL(8,2) NOT NULL,
    "indirectDays" DECIMAL(8,2) NOT NULL DEFAULT 0,
    "description" TEXT,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "LabourEntry_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "OutstationEntry" (
    "id" TEXT NOT NULL,
    "lineItemId" TEXT NOT NULL,
    "roleId" TEXT NOT NULL,
    "staffCount" INTEGER NOT NULL DEFAULT 1,
    "days" DECIMAL(8,2) NOT NULL,
    "trips" INTEGER NOT NULL DEFAULT 1,
    "description" TEXT,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "OutstationEntry_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "QuoteRevision" (
    "id" TEXT NOT NULL,
    "quoteId" TEXT NOT NULL,
    "revision" INTEGER NOT NULL,
    "editorId" TEXT NOT NULL,
    "changedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "reason" TEXT,
    "snapshot" JSONB NOT NULL,

    CONSTRAINT "QuoteRevision_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "WhtCategory" (
    "id" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "label" TEXT NOT NULL,
    "rate" DECIMAL(5,2) NOT NULL,
    "description" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "isDefault" BOOLEAN NOT NULL DEFAULT false,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "WhtCategory_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "MarkupTier_name_key" ON "MarkupTier"("name");

-- CreateIndex
CREATE UNIQUE INDEX "LabourRole_name_key" ON "LabourRole"("name");

-- CreateIndex
CREATE UNIQUE INDEX "OutstationRate_roleId_key" ON "OutstationRate"("roleId");

-- CreateIndex
CREATE INDEX "LabourEntry_lineItemId_idx" ON "LabourEntry"("lineItemId");

-- CreateIndex
CREATE INDEX "OutstationEntry_lineItemId_idx" ON "OutstationEntry"("lineItemId");

-- CreateIndex
CREATE INDEX "QuoteRevision_quoteId_idx" ON "QuoteRevision"("quoteId");

-- CreateIndex
CREATE INDEX "QuoteRevision_changedAt_idx" ON "QuoteRevision"("changedAt");

-- CreateIndex
CREATE UNIQUE INDEX "WhtCategory_code_key" ON "WhtCategory"("code");

-- CreateIndex
CREATE INDEX "LineItem_kind_idx" ON "LineItem"("kind");

-- CreateIndex
CREATE INDEX "Quote_solutionArchitectId_idx" ON "Quote"("solutionArchitectId");

-- AddForeignKey
ALTER TABLE "Quote" ADD CONSTRAINT "Quote_solutionArchitectId_fkey" FOREIGN KEY ("solutionArchitectId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Quote" ADD CONSTRAINT "Quote_whtCategoryId_fkey" FOREIGN KEY ("whtCategoryId") REFERENCES "WhtCategory"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LineItem" ADD CONSTRAINT "LineItem_markupTierId_fkey" FOREIGN KEY ("markupTierId") REFERENCES "MarkupTier"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OutstationRate" ADD CONSTRAINT "OutstationRate_roleId_fkey" FOREIGN KEY ("roleId") REFERENCES "LabourRole"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LabourEntry" ADD CONSTRAINT "LabourEntry_lineItemId_fkey" FOREIGN KEY ("lineItemId") REFERENCES "LineItem"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LabourEntry" ADD CONSTRAINT "LabourEntry_roleId_fkey" FOREIGN KEY ("roleId") REFERENCES "LabourRole"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OutstationEntry" ADD CONSTRAINT "OutstationEntry_lineItemId_fkey" FOREIGN KEY ("lineItemId") REFERENCES "LineItem"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OutstationEntry" ADD CONSTRAINT "OutstationEntry_roleId_fkey" FOREIGN KEY ("roleId") REFERENCES "LabourRole"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "QuoteRevision" ADD CONSTRAINT "QuoteRevision_quoteId_fkey" FOREIGN KEY ("quoteId") REFERENCES "Quote"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "QuoteRevision" ADD CONSTRAINT "QuoteRevision_editorId_fkey" FOREIGN KEY ("editorId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
