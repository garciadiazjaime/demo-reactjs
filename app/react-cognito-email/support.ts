import {
  CognitoIdentityProviderClient,
  InitiateAuthCommand,
  SignUpCommand,
  ConfirmSignUpCommand,
} from "@aws-sdk/client-cognito-identity-provider";

const AWS_REGION = "us-east-1";
const AWS_CLIENT_ID = process.env.NEXT_PUBLIC_AWS_CLIENT_ID;

export const cognitoClient = new CognitoIdentityProviderClient({
  region: AWS_REGION,
});

export const signIn = async (username: string, password: string) => {
  const command = new InitiateAuthCommand({
    AuthFlow: "USER_PASSWORD_AUTH",
    ClientId: AWS_CLIENT_ID,
    AuthParameters: {
      USERNAME: username,
      PASSWORD: password,
    },
  });

  let response;
  try {
    response = await cognitoClient.send(command);
  } catch (error) {
    throw error;
  }

  const AuthenticationResult = response.AuthenticationResult;

  if (!AuthenticationResult) {
    return;
  }

  sessionStorage.setItem("idToken", AuthenticationResult.IdToken || "");
  sessionStorage.setItem("accessToken", AuthenticationResult.AccessToken || "");
  sessionStorage.setItem(
    "refreshToken",
    AuthenticationResult.RefreshToken || ""
  );

  return AuthenticationResult;
};

export const signUp = async (email: string, password: string) => {
  const params = {
    ClientId: AWS_CLIENT_ID,
    Username: email,
    Password: password,
    UserAttributes: [
      {
        Name: "email",
        Value: email,
      },
    ],
  };

  const command = new SignUpCommand(params);

  try {
    await cognitoClient.send(command);
  } catch (error) {
    throw error;
  }
};

export const confirmSignUp = async (username: string, code: string) => {
  const params = {
    ClientId: AWS_CLIENT_ID,
    Username: username,
    ConfirmationCode: code,
  };
  const command = new ConfirmSignUpCommand(params);

  try {
    await cognitoClient.send(command);
  } catch (error) {
    throw error;
  }
};
