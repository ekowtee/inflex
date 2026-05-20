-- CreateEnum
CREATE TYPE "UserKind" AS ENUM ('INTERNAL', 'EXTERNAL');

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "kind" "UserKind" NOT NULL DEFAULT 'INTERNAL';

-- CreateIndex
CREATE INDEX "User_kind_idx" ON "User"("kind");
