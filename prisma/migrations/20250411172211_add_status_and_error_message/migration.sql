/*
  Warnings:

  - Added the required column `clientSecret` to the `Transaction` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Transaction" ADD COLUMN     "clientSecret" TEXT NOT NULL,
ADD COLUMN     "errorMessage" TEXT;
