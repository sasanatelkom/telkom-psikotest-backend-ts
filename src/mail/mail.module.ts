import { Module } from '@nestjs/common';
import { MailerModule } from '@nestjs-modules/mailer';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
import { join } from 'path';
import { MailService } from './mail.service';
import { HelperModule } from '../helpers/helper.module';

@Module({
    imports: [
        HelperModule,
        MailerModule.forRoot({
            transport: {
                host: 'smtp.gmail.com',
                port: 465,
                secure: true,
                auth: {
                    user: process.env.TELKOM_EMAIL,
                    pass: process.env.TELKOM_PASSWORD,
                }
            },
            defaults: {
                from: "Official Telkom University",
            },
            template: {
                dir: join(__dirname, 'templates'),
                adapter: new HandlebarsAdapter(),
                options: {
                    strict: true,
                },
            },
        }),
    ],
    controllers: [],
    providers: [MailService],
    exports: [MailService]
})
export class MailModule { }