/*
  Warnings:

  - You are about to drop the column `email_verified_at` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `token_send_at` on the `User` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "User" DROP COLUMN "email_verified_at",
DROP COLUMN "token_send_at",
ADD COLUMN     "email_verify_token_expiry" TIMESTAMP(3),
ADD COLUMN     "is_verified" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "password_token_expiry" TIMESTAMP(3);
