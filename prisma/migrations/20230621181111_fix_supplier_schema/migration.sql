/*
  Warnings:

  - You are about to drop the column `legalName` on the `suppliers` table. All the data in the column will be lost.
  - You are about to drop the column `supplierType` on the `suppliers` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `suppliers` DROP COLUMN `legalName`,
    DROP COLUMN `supplierType`,
    ADD COLUMN `legal_name` VARCHAR(191) NULL,
    ADD COLUMN `supplier_type` VARCHAR(191) NULL;
