/*
  Warnings:

  - A unique constraint covering the columns `[shopId,userId]` on the table `ShopUser` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "ShopUser_shopId_key";

-- DropIndex
DROP INDEX "ShopUser_userId_key";

-- CreateIndex
CREATE UNIQUE INDEX "ShopUser_shopId_userId_key" ON "ShopUser"("shopId", "userId");
