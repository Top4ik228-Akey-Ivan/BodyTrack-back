import { PrismaClient, MuscleGroup } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    await prisma.exercise.createMany({
        data: [
            {
                title: 'Жим штанги лёжа',
                desc: 'Базовое упражнение на грудные мышцы',
                muscleGroup: MuscleGroup.CHEST,
                isPublic: true,
            },
            {
                title: 'Жим гантелей под углом',
                desc: 'Упражнение на верх груди',
                muscleGroup: MuscleGroup.CHEST,
                isPublic: true,
            },
            {
                title: 'Подтягивания',
                desc: 'Базовое упражнение на спину',
                muscleGroup: MuscleGroup.BACK,
                isPublic: true,
            },
            {
                title: 'Тяга штанги в наклоне',
                desc: 'Упражнение на широчайшие мышцы спины',
                muscleGroup: MuscleGroup.BACK,
                isPublic: true,
            },
            {
                title: 'Приседания со штангой',
                desc: 'Базовое упражнение на ноги',
                muscleGroup: MuscleGroup.LEGS,
                isPublic: true,
            },
            {
                title: 'Жим ногами',
                desc: 'Упражнение на квадрицепсы',
                muscleGroup: MuscleGroup.LEGS,
                isPublic: true,
            },
            {
                title: 'Жим штанги стоя',
                desc: 'Базовое упражнение на плечи',
                muscleGroup: MuscleGroup.SHOULDERS,
                isPublic: true,
            },
            {
                title: 'Разведение гантелей в стороны',
                desc: 'Изолирующее упражнение на среднюю дельту',
                muscleGroup: MuscleGroup.SHOULDERS,
                isPublic: true,
            },
            {
                title: 'Подъём штанги на бицепс',
                desc: 'Упражнение на бицепс',
                muscleGroup: MuscleGroup.ARMS,
                isPublic: true,
            },
            {
                title: 'Планка',
                desc: 'Упражнение на мышцы кора',
                muscleGroup: MuscleGroup.CORE,
                isPublic: true,
            },
        ],

        skipDuplicates: true,
    });
}

main()
    .then(async () => {
        await prisma.$disconnect();
    })
    .catch(async (e) => {
        console.error(e);
        await prisma.$disconnect();
        process.exit(1);
    });
