/*
  Warnings:

  - You are about to drop the column `setId` on the `SetWeek` table. All the data in the column will be lost.
  - You are about to drop the column `workoutExerciseId` on the `WorkoutExerciseWeek` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[workoutExerciseWeekId,orderIndex]` on the table `SetWeek` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[workoutWeekId,exerciseId]` on the table `WorkoutExerciseWeek` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `orderIndex` to the `SetWeek` table without a default value. This is not possible if the table is not empty.
  - Added the required column `exerciseId` to the `WorkoutExerciseWeek` table without a default value. This is not possible if the table is not empty.
  - Added the required column `orderIndex` to the `WorkoutExerciseWeek` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "SetWeek" DROP CONSTRAINT "SetWeek_setId_fkey";

-- DropForeignKey
ALTER TABLE "WorkoutExerciseWeek" DROP CONSTRAINT "WorkoutExerciseWeek_workoutExerciseId_fkey";

-- DropIndex
DROP INDEX "SetWeek_workoutExerciseWeekId_setId_key";

-- DropIndex
DROP INDEX "WorkoutExerciseWeek_workoutWeekId_workoutExerciseId_key";

-- AlterTable
ALTER TABLE "SetWeek" DROP COLUMN "setId",
ADD COLUMN     "orderIndex" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "WorkoutExerciseWeek" DROP COLUMN "workoutExerciseId",
ADD COLUMN     "exerciseId" INTEGER NOT NULL,
ADD COLUMN     "orderIndex" INTEGER NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "SetWeek_workoutExerciseWeekId_orderIndex_key" ON "SetWeek"("workoutExerciseWeekId", "orderIndex");

-- CreateIndex
CREATE UNIQUE INDEX "WorkoutExerciseWeek_workoutWeekId_exerciseId_key" ON "WorkoutExerciseWeek"("workoutWeekId", "exerciseId");

-- AddForeignKey
ALTER TABLE "WorkoutExerciseWeek" ADD CONSTRAINT "WorkoutExerciseWeek_exerciseId_fkey" FOREIGN KEY ("exerciseId") REFERENCES "exercises"("id") ON DELETE CASCADE ON UPDATE CASCADE;
