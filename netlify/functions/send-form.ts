import type { HandlerEvent } from "@netlify/functions";
import sgMail from "@sendgrid/mail";
import "dotenv/config";

import { isDataValid } from "@/app/react-contact-form/components/support";

sgMail.setApiKey(process.env.SEND_GRID_API_KEY!);

const sendEmail = async function (message: string) {
  const msg = {
    text: message,
    html: message,
    subject: "Hi From Contact Form Tutorial",
    from: "info@mintitmedia.com",
    to: "info@mintitmedia.com",
  };

  await sgMail.send(msg);
};

const handler = async (event: HandlerEvent) => {
  const { email, message } = JSON.parse(event.body || "{}");

  if (!isDataValid(email, message)) {
    return {
      statusCode: 400,
    };
  }

  const emailMessage = `
    from: ${email} <br />
    message: ${message}
  `;

  await sendEmail(emailMessage);

  return {
    statusCode: 200,
  };
};

module.exports = {
  handler,
};
