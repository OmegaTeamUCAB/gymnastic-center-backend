import { Injectable } from '@nestjs/common';
import { EmailHandler } from '@app/core';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class VerificationCodeEmailService
  implements EmailHandler<{ code: string }>
{
  constructor(private readonly configService: ConfigService) {}

  async sendEmail(email: string, data: { code: string }): Promise<void> {
    const form = new FormData();
    form.append('from', this.configService.get('MAILGUN_FROM'));
    form.append('to', email);
    form.append(
      'template',
      this.configService.get('VERIFICATION_EMAIL_TEMPLATE'),
    );
    form.append('t:variables', JSON.stringify(data));
    fetch(
      `https://api.mailgun.net/v3/${this.configService.get('MAILGUN_DOMAIN')}/messages`,
      {
        method: 'POST',
        headers: {
          Authorization:
            'Basic ' +
            Buffer.from(
              `api:${this.configService.get('MAILGUN_API_KEY')}`,
            ).toString('base64'),
        },
        body: form,
      },
    );
  }
}
