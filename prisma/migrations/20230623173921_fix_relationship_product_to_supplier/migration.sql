-- DropIndex
DROP INDEX `products_id_idx` ON `products`;

-- DropIndex
DROP INDEX `suppliers_id_idx` ON `suppliers`;

-- CreateIndex
CREATE INDEX `products_supplier_id_idx` ON `products`(`supplier_id`);
