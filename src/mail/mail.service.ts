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
        const formatedNaration = naration.replaceAll("\n", "<br/>");
        return await this.mailerService.sendMail({
            to: email,
            subject: 'Hasil Tes Minat Bakat Telkom University',
            template: './result-test',
            from: `Minat Bakat Telkom University <minatbakat@smbbtelkom.ac.id>`,
            context: {
                name,
                naration: formatedNaration,
                suggestMajor,
            },
        });
    }
}
