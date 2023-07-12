import nodemailer from 'nodemailer';
import handlebars from 'nodemailer-express-handlebars';
import path from 'path';
import dotenv from 'dotenv';

dotenv.config();

const transporter = nodemailer.createTransport({
  service: 'Gmail',
  host: process.env.MAILER_HOST,
  port: parseInt(process.env.MAILER_PORT),
  secure: true,
  auth: {
    user: process.env.MAILER_USER,
    pass: process.env.MAILER_PASSWORD,
  },
});

transporter.use(
  'compile',
  handlebars({
    viewEngine: {
      extname: 'hbs',
      partialsDir: path.resolve(__dirname, '../templates/'),
      defaultLayout: undefined,
    },
    viewPath: path.resolve(__dirname, '../templates/'),
  }),
);

export default async function sendEmail(
  to: string,
  subject: string,
  template: string,
  context: object,
) {
  const mailOptions = {
    from: `"${process.env.MAILER_USERNAME}" ${process.env.MAILER_USER}`,
    to: to,
    subject: subject,
    template: template,
    context: context,
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error(error);
    } else {
      console.info('Email sent: ' + info.response);
    }
  });
}
