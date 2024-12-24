// todo: uncomment the line below when deploying to a server
// "use server";

const sleep = (ms: number) => {
  return new Promise((resolve) => setTimeout(resolve, ms));
};

export async function updateName(name: string): Promise<string> {
  await sleep(2_000);

  if (name?.length < 2) {
    return "Name must be at least 2 characters.";
  }

  return "";
}
