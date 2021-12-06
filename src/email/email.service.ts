import { Injectable } from '@nestjs/common';
import { MailerService } from '@nest-modules/mailer';

@Injectable()
export class EmailService {
  constructor(private readonly mailService: MailerService) {}

  sendEmail() {
    this.mailService.sendMail({
      to: 'aqiusen@163.com',
      from: '812656518@qq.com',
      subject: 'this is a testMail',
      template: './welcome',
      context: {
        // Data to be sent to template engine.
        code: 'cf1a3f828287',
        username: 'walker lee',
      },
    });
  }
}
