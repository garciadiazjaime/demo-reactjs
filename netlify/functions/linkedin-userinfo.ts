import type { HandlerEvent } from "@netlify/functions";

const handler = async (event: HandlerEvent) => {
  const response = await fetch(`https://api.linkedin.com/v2/userinfo`, {
    method: "GET",
    headers: {
      Authorization: event.headers.authorization as string,
    },
  });

  const data = await response.json();

  return {
    statusCode: 200,
    body: JSON.stringify(data),
  };
};

module.exports = {
  handler,
};
