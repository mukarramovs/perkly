import 'dotenv/config';
import { PrismaClient, OfferCategory, Role, Tier } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
    console.log('Clearing existing offers...');
    await prisma.offer.deleteMany();

    console.log('Ensuring System User exists...');
    const systemUser = await prisma.user.upsert({
        where: { email: 'system@perkly.app' },
        update: {},
        create: {
            email: 'system@perkly.app',
            displayName: 'Perkly System',
            role: Role.ADMIN,
            tier: Tier.PLATINUM,
        }
    });

    console.log('Seeding Offers...');
    const flashDropTime = new Date();
    flashDropTime.setHours(flashDropTime.getHours() + 5); // 5 hours from now

    await prisma.offer.createMany({
        data: [
            {
                title: 'Промокод на Кофе в Safia',
                description: 'Получите любой кофе (до 400 мл) бесплатно по этому уникальному промокоду. Только сегодня!',
                price: 0.50,
                category: OfferCategory.RESTAURANTS,
                hiddenData: 'SAFIA-COFFEE-FREE-2026',
                sellerId: systemUser.id,
                isFlashDrop: true,
                expiresAt: flashDropTime
            },
            {
                title: 'Yandex Plus на 6 месяцев',
                description: 'Активация подписки Яндекс Плюс Мульти на ваш аккаунт',
                price: 2.00,
                category: OfferCategory.SUBSCRIPTIONS,
                hiddenData: 'YANDEX-PLUS-PROMO-6M',
                sellerId: systemUser.id,
                isFlashDrop: true,
                expiresAt: flashDropTime
            },
            {
                title: 'Netflix Premium на 1 Месяц',
                description: '1 экран 4K Ultra HD. Подходит для ТВ.',
                price: 4.99,
                category: OfferCategory.SUBSCRIPTIONS,
                hiddenData: 'NETFLIX-ACCOUNT-CREDS-HERE',
                sellerId: systemUser.id,
                isFlashDrop: false
            },
            {
                title: 'Dodo Pizza: Большая пицца в подарок',
                description: 'Промокод на любую пиццу 35см при заказе от 5$.',
                price: 1.50,
                category: OfferCategory.RESTAURANTS,
                hiddenData: 'DODO-PIZZA-BIG-PROMO',
                sellerId: systemUser.id,
                isFlashDrop: false
            },
        ]
    });
    console.log('Seeding complete!');
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
