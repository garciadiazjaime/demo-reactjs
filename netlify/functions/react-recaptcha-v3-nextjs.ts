import type { HandlerEvent } from "@netlify/functions";

require("dotenv").config();

const validateRecaptcha = async (token: string) => {
  const url = `https://www.google.com/recaptcha/api/siteverify?secret=${process.env.RE_CAPTCHA_SECRET_KEY}&response=${token}`;
  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
  });

  return response.text();
};

const handler = async (event: HandlerEvent) => {
  const { code } = JSON.parse(event.body || "{}");

  const results = await validateRecaptcha(code);

  return {
    statusCode: 200,
    body: results,
  };
};

module.exports = {
  handler,
};
