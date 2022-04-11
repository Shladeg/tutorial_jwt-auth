import nodemailer from "nodemailer";

class MailService {
  constructor() {
    this.transporter = nodemailer.createTransport({
      service: process.env.SMTP_SERVICE,
      host: process.env.SMTP_HOST,
      port: process.env.SMTP_PORT,
      secure: false,
      ignoreTLS: true,
      requireTLS: false,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASSWORD,
      },
    });
  }

  async sendActivationMail(to, link) {
    try {
      await this.transporter.sendMail({
        from: process.env.SMTP_USER,
        to,
        subject: `Активация аккаунта на ${process.env.API_URL}`,
        text: "",
        html: `
          <div>
            <h1>Для активации письма перейдите по ссылке</h1>
  
            <a href="${link}">Активировать</a>
          </div>
          `,
      });
    } catch (e) {
      console.log(e);
    }
  }
}

export default new MailService();
