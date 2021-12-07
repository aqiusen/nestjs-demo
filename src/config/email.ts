import { join } from 'path';
import { PugAdapter } from '@nestjs-modules/mailer/dist/adapters/pug.adapter';
/**
 *var transporter = nodemailer.createTransport('smtps://<发送邮箱>:<授权码>@smtp.qq.com');
 * 授权码是要在qq邮箱中开启的
 * */
export default {
  transport: 'smtps://812656518@qq.com:bhyzqjnlhxfibdcf@smtp.qq.com',
  defaults: {
    from: '"nest-modules" <modules@nestjs.com>',
  },
  template: {
    dir: join(__dirname, '../templates/email/'),
    adapter: new PugAdapter(),
    options: {
      strict: true,
    },
  },
};
