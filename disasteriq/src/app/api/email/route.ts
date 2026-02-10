import { NextResponse } from "next/server";
import { SendEmailCommand } from "@aws-sdk/client-ses";
import { ses } from "@/app/lib/ses";

export async function POST(req: Request) {
  try {
    const { to, subject, message } = await req.json();

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

    const result = await ses.send(command);

    return NextResponse.json({
      success: true,
      messageId: result.MessageId,
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { success: false },
      { status: 500 }
    );
  }
}
