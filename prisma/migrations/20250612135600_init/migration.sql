/*
  Warnings:

  - You are about to alter the column `order_by` on the `preorder` table. The data in that column could be lost. The data in that column will be cast from `String` to `Int`.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_preorder" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "order_date" DATETIME NOT NULL,
    "order_by" INTEGER NOT NULL,
    "selected_package" INTEGER NOT NULL,
    "qty" INTEGER NOT NULL,
    "is_paid" BOOLEAN NOT NULL,
    CONSTRAINT "preorder_selected_package_fkey" FOREIGN KEY ("selected_package") REFERENCES "paket" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "preorder_order_by_fkey" FOREIGN KEY ("order_by") REFERENCES "customer" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_preorder" ("id", "is_paid", "order_by", "order_date", "qty", "selected_package") SELECT "id", "is_paid", "order_by", "order_date", "qty", "selected_package" FROM "preorder";
DROP TABLE "preorder";
ALTER TABLE "new_preorder" RENAME TO "preorder";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
