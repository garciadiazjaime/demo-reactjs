import type { HandlerEvent } from "@netlify/functions";

const { GoogleGenerativeAI } = require("@google/generative-ai");

require("dotenv").config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

const handler = async (event: HandlerEvent) => {
  const popularity = parseInt(
    event.queryStringParameters?.popularity || "50",
    10
  );

  const prompt = `Write a funny quote, under 100 characters, about popularity on a scale from 0 to 100, where 0 is the least popular and 100 is the most. The quote should describe someone at ${popularity}, omit the popularity value.`;

  const result = await model.generateContent(prompt);

  return {
    statusCode: 200,
    body: result.response.text(),
  };
};

module.exports = {
  handler,
};
