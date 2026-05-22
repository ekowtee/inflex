-- AlterTable: Quote signature block fields
ALTER TABLE "Quote" ADD COLUMN     "preparedById" TEXT,
ADD COLUMN     "approvedById" TEXT,
ADD COLUMN     "documentDate" TIMESTAMP(3);

-- AlterTable: editable quote terms boilerplate
ALTER TABLE "CompanySettings" ADD COLUMN     "quoteTerms" TEXT;

-- CreateIndex
CREATE INDEX "Quote_preparedById_idx" ON "Quote"("preparedById");

-- CreateIndex
CREATE INDEX "Quote_approvedById_idx" ON "Quote"("approvedById");

-- AddForeignKey
ALTER TABLE "Quote" ADD CONSTRAINT "Quote_preparedById_fkey" FOREIGN KEY ("preparedById") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Quote" ADD CONSTRAINT "Quote_approvedById_fkey" FOREIGN KEY ("approvedById") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
