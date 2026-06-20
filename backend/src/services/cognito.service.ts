import {
  AdminResetUserPasswordCommand,
  AttributeType,
  AuthenticationResultType,
  CognitoIdentityProviderClient,
  ConfirmForgotPasswordCommand,
  GetUserCommand,
  InitiateAuthCommand,
} from '@aws-sdk/client-cognito-identity-provider';

import { LccError, isCognitoError } from '../models/error.model';

const { AWS_COGNITO_REGION, AWS_COGNITO_USER_POOL_ID, AWS_COGNITO_USER_POOL_CLIENT_ID } =
  process.env;
if (
  !AWS_COGNITO_REGION ||
  !AWS_COGNITO_USER_POOL_ID ||
  !AWS_COGNITO_USER_POOL_CLIENT_ID
) {
  throw new Error('Unable to parse AWS Cognito environment variables.');
}

export class CognitoService {
  private cognitoIdentityProviderClient: CognitoIdentityProviderClient;

  constructor() {
    this.cognitoIdentityProviderClient = new CognitoIdentityProviderClient({
      region: AWS_COGNITO_REGION,
    });
  }

  public async initiateAuthWithEmailAndPassword(
    email: string,
    password: string,
  ): Promise<AuthenticationResultType | LccError> {
    try {
      const initiateAuthCommandOutput = await this.cognitoIdentityProviderClient.send(
        new InitiateAuthCommand({
          AuthFlow: 'USER_PASSWORD_AUTH',
          ClientId: AWS_COGNITO_USER_POOL_CLIENT_ID,
          AuthParameters: {
            USERNAME: email,
            PASSWORD: password,
          },
        }),
      );

      if (
        !initiateAuthCommandOutput.AuthenticationResult?.AccessToken ||
        !initiateAuthCommandOutput.AuthenticationResult?.RefreshToken
      ) {
        throw new Error();
      }

      return initiateAuthCommandOutput.AuthenticationResult;
    } catch (error) {
      let status: number | undefined;
      let message: string;

      if (isCognitoError(error)) {
        status = error.$metadata.httpStatusCode;
        message =
          error.name === 'NotAuthorizedException'
            ? 'Incorrect username or password.'
            : error.message;
      } else {
        message = 'Unknown error occurred while authenticating (1).';
      }

      return { name: 'LCCError', message, status };
    }
  }

  public async initiateAuthWithRefreshToken(
    refreshToken: string,
  ): Promise<AuthenticationResultType | LccError> {
    try {
      const initiateAuthCommandOutput = await this.cognitoIdentityProviderClient.send(
        new InitiateAuthCommand({
          AuthFlow: 'REFRESH_TOKEN_AUTH',
          ClientId: AWS_COGNITO_USER_POOL_CLIENT_ID,
          AuthParameters: {
            REFRESH_TOKEN: refreshToken,
          },
        }),
      );

      if (!initiateAuthCommandOutput.AuthenticationResult?.AccessToken) {
        throw new Error();
      }

      return initiateAuthCommandOutput.AuthenticationResult;
    } catch (error) {
      let status: number | undefined;
      let message: string;

      if (isCognitoError(error)) {
        status = error.$metadata.httpStatusCode;
        message =
          error.name === 'NotAuthorizedException'
            ? 'Incorrect username or password.'
            : error.message;
      } else {
        message = 'Unknown error occurred while authenticating (2).';
      }

      return { name: 'LCCError', message, status };
    }
  }

  public async getUser(accessToken?: string | null): Promise<AttributeType[] | LccError> {
    try {
      if (!accessToken) {
        throw new Error();
      }

      const getUserCommandOutput = await this.cognitoIdentityProviderClient.send(
        new GetUserCommand({
          AccessToken: accessToken,
        }),
      );

      if (
        !getUserCommandOutput.UserAttributes ||
        getUserCommandOutput.UserAttributes.length < 5
      ) {
        throw new Error();
      }

      return getUserCommandOutput.UserAttributes;
    } catch (error) {
      let status: number | undefined;
      let message: string;

      if (isCognitoError(error)) {
        status = error.$metadata.httpStatusCode;
        message = error.message;
      } else {
        message = 'Unknown error while retrieving user details.';
      }

      return { name: 'LCCError', message, status };
    }
  }

  public async adminResetUserPassword(email: string): Promise<'success' | LccError> {
    try {
      const adminResetUserPasswordCommand = await this.cognitoIdentityProviderClient.send(
        new AdminResetUserPasswordCommand({
          UserPoolId: AWS_COGNITO_USER_POOL_ID,
          Username: email,
        }),
      );

      if (adminResetUserPasswordCommand.$metadata.httpStatusCode === 200) {
        return 'success';
      }

      throw new Error();
    } catch (error) {
      let status: number | undefined;
      let message: string;

      if (isCognitoError(error)) {
        status = error.$metadata.httpStatusCode;
        message = error.message;
      } else {
        message = 'Unknown error while sending verification code.';
      }

      return { name: 'LCCError', message, status };
    }
  }

  public async confirmForgotPassword(
    email: string,
    password: string,
    code: string,
  ): Promise<'success' | LccError> {
    try {
      const confirmForgotPasswordCommand = await this.cognitoIdentityProviderClient.send(
        new ConfirmForgotPasswordCommand({
          ClientId: AWS_COGNITO_USER_POOL_CLIENT_ID,
          Username: email,
          Password: password,
          ConfirmationCode: code,
        }),
      );

      if (confirmForgotPasswordCommand.$metadata.httpStatusCode === 200) {
        return 'success';
      }

      throw new Error();
    } catch (error) {
      let status: number | undefined;
      let message: string;

      if (isCognitoError(error)) {
        status = error.$metadata.httpStatusCode;
        message = error.message;
      } else {
        message = 'Unknown error while changing password.';
      }

      return { name: 'LCCError', message, status };
    }
  }
}
