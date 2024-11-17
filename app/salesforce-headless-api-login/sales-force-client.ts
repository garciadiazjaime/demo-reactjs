const clientId = process.env.SALES_FORCE_CLIENT_ID as string;
const redirectURI = process.env.SALES_FORCE_REDIRECT_URI as string;
const expDomain = process.env.SALES_FORCE_BASE_URL as string;

export async function login({
  username,
  password,
  captcha,
}: {
  username: string;
  password: string;
  captcha: string;
}) {
  const Authorization = btoa(username + ":" + password);

  const config = {
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      "Auth-Request-Type": "Named-User",
      Authorization: "Basic " + Authorization,
    },
    method: "POST",
    body: new URLSearchParams({
      response_type: "code_credentials",
      client_id: clientId,
      redirect_uri: redirectURI,
      recaptcha: captcha,
    }),
  };
  const response = await fetch(
    `${expDomain}/services/oauth2/authorize`,
    config
  );

  const result = await response.json();

  return result;
}

export async function getAccessToken(payload: { code: string }) {
  const { code } = payload;

  const config = {
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    method: "POST",
    body: new URLSearchParams({
      code,
      grant_type: "authorization_code",
      client_id: clientId,
      redirect_uri: redirectURI,
    }),
  };

  const response = await fetch(`${expDomain}/services/oauth2/token`, config);

  const result = await response.json();

  return result;
}

export async function getUserInfo(payload: { access_token: string }) {
  const { access_token } = payload;

  const config = {
    headers: {
      Authorization: `Bearer ${access_token}`,
      "Content-Type": "application/json",
    },
    method: "GET",
  };

  const response = await fetch(`${expDomain}/services/oauth2/userinfo`, config);

  const result = await response.json();

  return result;
}
