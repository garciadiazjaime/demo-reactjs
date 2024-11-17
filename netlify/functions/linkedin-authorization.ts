import type { HandlerEvent } from "@netlify/functions";

require("dotenv").config();

const LINKEDIN_CLIENT_ID = process.env.NEXT_PUBLIC_LINKEDIN_CLIENT_ID;
const LINKEDIN_CLIENT_SECRET = process.env.LINKEDIN_CLIENT_SECRET;
const LINKEDIN_REDIRECT = process.env.LINKEDIN_REDIRECT;

const handler = async (event: HandlerEvent) => {
  const { code } = JSON.parse(event.body || "{}");

  const config = {
    grant_type: "authorization_code",
    code,
    client_id: LINKEDIN_CLIENT_ID as string,
    client_secret: LINKEDIN_CLIENT_SECRET as string,
    redirect_uri: LINKEDIN_REDIRECT as string,
  };

  console.log({ config });

  const response = await fetch(
    `https://www.linkedin.com/oauth/v2/accessToken`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams(config),
    }
  );

  console.log({ response });

  const data = await response.text();

  console.log({ data });

  return {
    statusCode: 200,
    body: data,
  };
};

module.exports = {
  handler,
};
