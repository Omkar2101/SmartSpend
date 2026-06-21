/*
  Warnings:

  - A unique constraint covering the columns `[emailMessageId]` on the table `Invoice` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "Invoice" ADD COLUMN     "confidence" DOUBLE PRECISION,
ADD COLUMN     "emailMessageId" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "Invoice_emailMessageId_key" ON "Invoice"("emailMessageId");

-- AddForeignKey
ALTER TABLE "Invoice" ADD CONSTRAINT "Invoice_emailMessageId_fkey" FOREIGN KEY ("emailMessageId") REFERENCES "EmailMessage"("id") ON DELETE SET NULL ON UPDATE CASCADE;
