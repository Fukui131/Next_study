-- AlterTable
ALTER TABLE "Task" ADD COLUMN "createdAt" timestamp(3) NOT NULL DEFAULT now();
ALTER TABLE "Task" ADD COLUMN "updatedAt" timestamp(3) NOT NULL;
