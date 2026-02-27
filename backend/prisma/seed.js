// Run this from: /Users/shoxrux/Desktop/STARTAP/perkly/backend
// Command: node prisma/seed.js
require('dotenv').config();
const { PrismaClient } = require('@prisma/client');
const { Pool } = require('pg');
const { PrismaPg } = require('@prisma/adapter-pg');

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

const flashDropTime = new Date();
flashDropTime.setHours(flashDropTime.getHours() + 5);

async function main() {
    console.log('Deleting old offers...');
    await prisma.offer.deleteMany();

    console.log('Upserting system user...');
    const systemUser = await prisma.user.upsert({
        where: { email: 'system@perkly.app' },
        update: {},
        create: {
            email: 'system@perkly.app',
            displayName: 'Perkly System',
            role: 'ADMIN',
            tier: 'PLATINUM',
        }
    });
    console.log('System user:', systemUser.id);

    const flashDropTime2 = new Date();
    flashDropTime2.setHours(flashDropTime2.getHours() + 5);

    console.log('Creating offers...');
    await prisma.offer.createMany({
        data: [
            {
                title: 'Промокод на Кофе в Safia',
                description: 'Получите любой кофе (до 400 мл) бесплатно по этому уникальному промокоду. Только сегодня!',
                price: 0.50,
                category: 'RESTAURANTS',
                hiddenData: 'SAFIA-COFFEE-FREE-2026',
                sellerId: systemUser.id,
                isFlashDrop: true,
                expiresAt: flashDropTime2,
            },
            {
                title: 'Yandex Plus на 6 месяцев',
                description: 'Активация подписки Яндекс Плюс Мульти на ваш аккаунт',
                price: 2.00,
                category: 'SUBSCRIPTIONS',
                hiddenData: 'YANDEX-PLUS-PROMO-6M',
                sellerId: systemUser.id,
                isFlashDrop: true,
                expiresAt: flashDropTime2,
            },
            {
                title: 'Netflix Premium на 1 Месяц',
                description: '1 экран 4K Ultra HD. Подходит для ТВ.',
                price: 4.99,
                category: 'SUBSCRIPTIONS',
                hiddenData: 'NETFLIX-ACCOUNT-CREDS-HERE',
                sellerId: systemUser.id,
                isFlashDrop: false,
            },
            {
                title: 'Dodo Pizza: Большая пицца в подарок',
                description: 'Промокод на любую пиццу 35см при заказе от 5$.',
                price: 1.50,
                category: 'RESTAURANTS',
                hiddenData: 'DODO-PIZZA-BIG-PROMO',
                sellerId: systemUser.id,
                isFlashDrop: false,
            },
            {
                title: 'Аккаунт Steam (GTA V + CS:GO Prime)',
                description: 'Готовый аккаунт Steam с куплеными GTA V и CS:GO Prime статусом.',
                price: 15.00,
                category: 'GAMES',
                hiddenData: 'STEAM-LOGIN-PASS-HERE',
                sellerId: systemUser.id,
                isFlashDrop: false,
            },
            {
                title: 'Discord Nitro на 1 Год',
                description: 'Полноценная подписка Discord Nitro на 12 месяцев.',
                price: 45.00,
                category: 'SUBSCRIPTIONS',
                hiddenData: 'DISCORD-NITRO-GIFT-LINK',
                sellerId: systemUser.id,
                isFlashDrop: false,
            },
        ]
    });
    console.log('Seeding complete! Created 6 offers.');
}

main()
    .catch(e => { console.error(e); process.exit(1); })
    .finally(() => prisma.$disconnect());
