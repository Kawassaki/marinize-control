-- AlterTable
ALTER TABLE `users` ADD COLUMN `is_admin` BOOLEAN NULL;

-- CreateTable
CREATE TABLE `suppliers` (
    `id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NULL,
    `legalName` VARCHAR(191) NULL,
    `supplierType` VARCHAR(191) NULL,
    `cnpj` VARCHAR(191) NULL,
    `cpf` VARCHAR(191) NULL,
    `address` VARCHAR(191) NULL,

    UNIQUE INDEX `suppliers_cnpj_key`(`cnpj`),
    UNIQUE INDEX `suppliers_cpf_key`(`cpf`),
    INDEX `suppliers_id_idx`(`id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `products` (
    `id` VARCHAR(191) NOT NULL,
    `referenceCode` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NULL,
    `barcode` VARCHAR(191) NULL,
    `season` VARCHAR(191) NULL,
    `size` VARCHAR(191) NULL,
    `stock_amount` VARCHAR(191) NULL,
    `stock_minimum` VARCHAR(191) NULL,
    `date_collection` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `price_without_profit` VARCHAR(191) NULL,
    `profit_percentage` VARCHAR(191) NULL,
    `final_price` VARCHAR(191) NULL,
    `supplier_id` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `products_referenceCode_key`(`referenceCode`),
    UNIQUE INDEX `products_supplier_id_key`(`supplier_id`),
    INDEX `products_id_idx`(`id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
