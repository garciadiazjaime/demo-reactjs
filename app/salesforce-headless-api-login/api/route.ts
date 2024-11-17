import { login, getAccessToken, getUserInfo } from "../sales-force-client";

export async function POST(request: Request) {
  const { username, password, captcha } = await request.json();

  const loginResponse = await login({ username, password, captcha });
  console.log({ loginResponse });
  const accessTokenResponse = await getAccessToken(loginResponse);
  console.log({ accessTokenResponse });
  const userInfoResponse = await getUserInfo(accessTokenResponse);
  console.log({ userInfoResponse });
  return Response.json(userInfoResponse);
}
