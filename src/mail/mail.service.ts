import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';
import { SendResultTestDto } from './interfaces/result-test.interface';

@Injectable()
export class MailService {
    constructor(
        private readonly mailerService: MailerService,
    ) { }

    async sendResultTest(dto: SendResultTestDto) {
        const { name, naration, suggestMajor, email } = dto;
        return await this.mailerService.sendMail({
            to: email,
            subject: 'Hasil Tes Minat Bakat Telkom University',
            template: './result-test',
            context: {
                name,
                naration,
                suggestMajor,
            },
        });
    }
}
