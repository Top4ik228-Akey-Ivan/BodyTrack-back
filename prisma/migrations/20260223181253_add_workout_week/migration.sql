-- CreateTable
CREATE TABLE "WorkoutWeek" (
    "id" SERIAL NOT NULL,
    "workoutId" INTEGER NOT NULL,
    "weekIndex" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "WorkoutWeek_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "WorkoutExerciseWeek" (
    "id" SERIAL NOT NULL,
    "workoutWeekId" INTEGER NOT NULL,
    "workoutExerciseId" INTEGER NOT NULL,

    CONSTRAINT "WorkoutExerciseWeek_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SetWeek" (
    "id" SERIAL NOT NULL,
    "workoutExerciseWeekId" INTEGER NOT NULL,
    "setId" INTEGER NOT NULL,
    "weight" DOUBLE PRECISION,
    "reps" INTEGER NOT NULL,

    CONSTRAINT "SetWeek_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "WorkoutWeek_workoutId_weekIndex_key" ON "WorkoutWeek"("workoutId", "weekIndex");

-- CreateIndex
CREATE UNIQUE INDEX "WorkoutExerciseWeek_workoutWeekId_workoutExerciseId_key" ON "WorkoutExerciseWeek"("workoutWeekId", "workoutExerciseId");

-- CreateIndex
CREATE UNIQUE INDEX "SetWeek_workoutExerciseWeekId_setId_key" ON "SetWeek"("workoutExerciseWeekId", "setId");

-- AddForeignKey
ALTER TABLE "WorkoutWeek" ADD CONSTRAINT "WorkoutWeek_workoutId_fkey" FOREIGN KEY ("workoutId") REFERENCES "workouts"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WorkoutExerciseWeek" ADD CONSTRAINT "WorkoutExerciseWeek_workoutWeekId_fkey" FOREIGN KEY ("workoutWeekId") REFERENCES "WorkoutWeek"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WorkoutExerciseWeek" ADD CONSTRAINT "WorkoutExerciseWeek_workoutExerciseId_fkey" FOREIGN KEY ("workoutExerciseId") REFERENCES "workout_exercises"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SetWeek" ADD CONSTRAINT "SetWeek_workoutExerciseWeekId_fkey" FOREIGN KEY ("workoutExerciseWeekId") REFERENCES "WorkoutExerciseWeek"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SetWeek" ADD CONSTRAINT "SetWeek_setId_fkey" FOREIGN KEY ("setId") REFERENCES "sets"("id") ON DELETE CASCADE ON UPDATE CASCADE;
