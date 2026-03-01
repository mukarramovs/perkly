import { Injectable, Logger } from '@nestjs/common';
import { Start, Update, Ctx, InjectBot } from 'nestjs-telegraf';
import { Context, Markup, Telegraf } from 'telegraf';
import { PrismaService } from '../prisma/prisma.service';

@Update()
@Injectable()
export class BotService {
    private readonly logger = new Logger(BotService.name);

    constructor(
        private prisma: PrismaService,
        @InjectBot() private bot: Telegraf<Context>
    ) { }

    async sendTelegramNotification(telegramId: string, message: string) {
        try {
            await this.bot.telegram.sendMessage(telegramId, message, { parse_mode: 'Markdown' });
            this.logger.log(`Sent notification to ${telegramId}`);
        } catch (error) {
            this.logger.error(`Failed to send notification to ${telegramId}: ${error.message}`);
        }
    }

    @Start()
    async start(@Ctx() ctx: Context) {
        const from = ctx.from;
        if (!from) return;

        this.logger.log(`Received /start from ${from.id} (${from.username || from.first_name})`);

        // Connect user quietly if they exist or create a new user via TG
        const email = from.username ? `${from.username}@telegram.local` : `${from.id}@telegram.local`;
        await this.prisma.user.upsert({
            where: { email },
            update: {
                telegramId: from.id.toString(), // Track their telegram id
            },
            create: {
                email,
                telegramId: from.id.toString(),
                displayName: from.first_name || from.username || 'Telegram User',
                avatarUrl: null, // Hard to grab without getting file paths, sticking to null
            },
        });


        // Reply with Web App Button
        const webAppUrl = process.env.FRONTEND_URL || 'https://perkly.app'; // Replace with ngrok or deployed frontend url later

        await ctx.reply(
            `Привет, ${from.first_name}! 👋\n\nДобро пожаловать в **Perkly** – твой маркетплейс скидок и подписок.\n\nНажми на кнопку ниже, чтобы открыть приложение 🚀`,
            Markup.inlineKeyboard([
                Markup.button.webApp("🔥 Открыть Perkly", webAppUrl)
            ])
        );
    }
}
