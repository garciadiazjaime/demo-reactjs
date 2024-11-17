import type { HandlerEvent } from "@netlify/functions";

require("dotenv").config();

const LINKEDIN_CLIENT_ID = process.env.NEXT_PUBLIC_LINKEDIN_CLIENT_ID;
const LINKEDIN_CLIENT_SECRET = process.env.LINKEDIN_CLIENT_SECRET;

const handler = async (event: HandlerEvent) => {
  const { code, callback } = JSON.parse(event.body || "{}");

  const response = await fetch(
    `https://www.linkedin.com/oauth/v2/accessToken`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: JSON.stringify({
        code,
        client_id: LINKEDIN_CLIENT_ID,
        client_secret: LINKEDIN_CLIENT_SECRET,
        redirect_uri: callback,
        grant_type: "authorization_code",
      }),
    }
  );

  console.log({ response });

  return {
    statusCode: 200,
    body: response.text(),
  };
};

module.exports = {
  handler,
};
