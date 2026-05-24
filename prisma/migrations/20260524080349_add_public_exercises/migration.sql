/*
  Warnings:

  - You are about to drop the `comments` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `likes` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `post_files` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `posts` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `sets` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `workout_exercises` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[workoutWeekId,orderIndex]` on the table `WorkoutExerciseWeek` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE "comments" DROP CONSTRAINT "comments_postId_fkey";

-- DropForeignKey
ALTER TABLE "comments" DROP CONSTRAINT "comments_userId_fkey";

-- DropForeignKey
ALTER TABLE "likes" DROP CONSTRAINT "likes_postId_fkey";

-- DropForeignKey
ALTER TABLE "likes" DROP CONSTRAINT "likes_userId_fkey";

-- DropForeignKey
ALTER TABLE "post_files" DROP CONSTRAINT "post_files_postId_fkey";

-- DropForeignKey
ALTER TABLE "posts" DROP CONSTRAINT "posts_userId_fkey";

-- DropForeignKey
ALTER TABLE "sets" DROP CONSTRAINT "sets_workoutExerciseId_fkey";

-- DropForeignKey
ALTER TABLE "workout_exercises" DROP CONSTRAINT "workout_exercises_exerciseId_fkey";

-- DropForeignKey
ALTER TABLE "workout_exercises" DROP CONSTRAINT "workout_exercises_workoutId_fkey";

-- AlterTable
ALTER TABLE "exercises" ADD COLUMN     "isPublic" BOOLEAN NOT NULL DEFAULT false,
ALTER COLUMN "userId" DROP NOT NULL;

-- DropTable
DROP TABLE "comments";

-- DropTable
DROP TABLE "likes";

-- DropTable
DROP TABLE "post_files";

-- DropTable
DROP TABLE "posts";

-- DropTable
DROP TABLE "sets";

-- DropTable
DROP TABLE "workout_exercises";

-- DropEnum
DROP TYPE "FileType";

-- CreateIndex
CREATE UNIQUE INDEX "WorkoutExerciseWeek_workoutWeekId_orderIndex_key" ON "WorkoutExerciseWeek"("workoutWeekId", "orderIndex");
