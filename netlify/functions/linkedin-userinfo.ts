import type { HandlerEvent } from "@netlify/functions";

const handler = async (event: HandlerEvent) => {
  console.log({ event });

  const response = await fetch(`https://api.linkedin.com/v2/userinfo`, {
    method: "GET",
    headers: {
      Authorization: event.headers.authorization as string,
    },
  });

  console.log({ response });

  const data = await response.json();

  console.log({ data });

  return {
    statusCode: 200,
    body: JSON.stringify(data),
  };
};

module.exports = {
  handler,
};
