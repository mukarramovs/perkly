-- AlterTable
ALTER TABLE "Offer" ADD COLUMN     "expiresAt" TIMESTAMP(3),
ADD COLUMN     "isFlashDrop" BOOLEAN NOT NULL DEFAULT false;
