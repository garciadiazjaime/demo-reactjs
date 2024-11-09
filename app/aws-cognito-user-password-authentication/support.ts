import {
  CognitoIdentityProviderClient,
  InitiateAuthCommand,
  SignUpCommand,
  ConfirmSignUpCommand,
  AuthFlowType,
  DeleteUserCommand,
} from "@aws-sdk/client-cognito-identity-provider";

const AWS_CLIENT_ID = process.env.NEXT_PUBLIC_AWS_CLIENT_ID;
const AWS_REGION = process.env.NEXT_PUBLIC_AWS_REGION;

export const cognitoClient = new CognitoIdentityProviderClient({
  region: AWS_REGION,
});

export const signIn = async (username: string, password: string) => {
  const params = {
    AuthFlow: AuthFlowType.USER_PASSWORD_AUTH,
    ClientId: AWS_CLIENT_ID,
    AuthParameters: {
      USERNAME: username,
      PASSWORD: password,
    },
  };
  const command = new InitiateAuthCommand(params);

  let AuthenticationResult;
  try {
    const response = await cognitoClient.send(command);
    AuthenticationResult = response.AuthenticationResult;
  } catch (error) {
    console.error(error);
    throw error;
  }

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
    console.log(error);
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
    console.log(error);
    throw error;
  }
};

export const deleteAccount = async () => {
  const params = {
    AccessToken: sessionStorage.getItem("accessToken") || "",
  };

  const command = new DeleteUserCommand(params);
  try {
    await cognitoClient.send(command);
  } catch (error) {
    console.log(error);
    throw error;
  }
};
