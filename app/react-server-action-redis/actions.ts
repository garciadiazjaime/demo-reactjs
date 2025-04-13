"use server";

import Redis from "ioredis";

const redis = new Redis(process.env.REDIS_CONNECTION_STRING as string);

export async function writeToRedis(name: string): Promise<void> {
  try {
    await redis.set("name", name);
  } catch (error) {
    console.error("Error writing to Redis:", error);
  }
}

export async function readFromRedis(): Promise<string> {
  try {
    const value = await redis.get("name");
    return value as string;
  } catch (error) {
    console.error("Error reading from Redis:", error);
    return "";
  }
}
