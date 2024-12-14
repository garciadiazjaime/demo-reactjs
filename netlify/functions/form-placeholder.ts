import type { HandlerEvent } from "@netlify/functions";

const sleep = (ms: number) => {
  return new Promise((resolve) => setTimeout(resolve, ms));
};

const handler = async (event: HandlerEvent) => {
  const { name } = JSON.parse(event.body || "{}");

  await sleep(2_000);

  if (name?.length < 2) {
    return {
      statusCode: 400,
      body: JSON.stringify({ message: "Name must be at least 2 characters." }),
    };
  }

  return {
    statusCode: 200,
  };
};

module.exports = {
  handler,
};
