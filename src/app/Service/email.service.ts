import { SendEmailCommand } from "@aws-sdk/client-ses";
import { ses } from "@/app/lib/ses";

type SendEmailParams = {
  to: string;
  subject: string;
  message: string;
};

export class EmailService {
  static async sendEmail({ to, subject, message }: SendEmailParams) {
    const command = new SendEmailCommand({
      Source: process.env.SES_EMAIL_SENDER!,
      Destination: { ToAddresses: [to] },
      Message: {
        Subject: { Data: subject },
        Body: {
          Html: { Data: message },
        },
      },
    });

    return ses.send(command);
  }

  static async sendWelcomeEmail({
    to,
    userName,
    dashboardUrl,
  }: {
    to: string;
    userName: string;
    dashboardUrl: string;
  }) {
    return this.sendEmail({
      to,
      subject: "Welcome to RapidAid 🚑",
      message: `
        <h2>Welcome, ${userName}!</h2>
        <p>Your account has been successfully created.</p>
        <p>
          <a href="${dashboardUrl}">
            Go to Dashboard
          </a>
        </p>
      `,
    });
  }
}
