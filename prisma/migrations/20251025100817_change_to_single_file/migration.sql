/*
  Warnings:

  - A unique constraint covering the columns `[postId]` on the table `post_files` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "post_files_postId_key" ON "public"."post_files"("postId");
