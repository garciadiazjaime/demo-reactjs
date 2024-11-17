export const login = async ({
  username,
  password,
  captcha,
}: {
  username: string;
  password: string;
  captcha: string | null;
}) => {
  const response = await fetch("/salesforce-headless-api-login/api", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ username, password, captcha }),
  });
  const results = await response.json();

  return results;
};
