import { Request, Response } from 'express';

import { ApiResponse } from '../models/api-response.model';
import { LccError, isLccError } from '../models/error.model';
import { ClientUser, User, UserModel } from '../models/user.model';
import { CognitoService } from '../services/cognito.service';

const cognitoService = new CognitoService();

const { NODE_ENVIRONMENT } = process.env;
const SESSION_DURATION_MS = 3 * 3600 * 1000;

export async function login(
  req: Request,
  res: Response<ApiResponse<ClientUser>>,
): Promise<void> {
  try {
    const { email, password } = req.body;

    let user: User;
    let accessToken: string;

    if (NODE_ENVIRONMENT === 'dev-offline') {
      const existingUser = await UserModel.findOne({ email });

      if (existingUser) {
        user = existingUser.toObject();
      } else {
        user = {
          id: 'dev-user-' + email,
          firstName: 'Dev',
          lastName: 'User',
          email: email,
          isAdmin: true,
          refreshToken: 'dev-refresh-token',
        };
        await UserModel.create(user);
      }
      accessToken = 'dev-mock-token-' + Date.now();
    } else {
      const authenticationResult = await cognitoService.initiateAuthWithEmailAndPassword(
        email,
        password,
      );
      if (isLccError(authenticationResult)) {
        throw authenticationResult;
      }

      const userAttributes = await cognitoService.getUser(
        authenticationResult.AccessToken,
      );
      if (isLccError(userAttributes)) {
        throw userAttributes;
      }

      user = {
        id: userAttributes.find(attr => attr.Name === 'sub')!.Value!,
        firstName: userAttributes.find(attr => attr.Name === 'given_name')!.Value!,
        lastName: userAttributes.find(attr => attr.Name === 'family_name')!.Value!,
        email: userAttributes.find(attr => attr.Name === 'email')!.Value!,
        isAdmin: true,
        refreshToken: authenticationResult.RefreshToken!,
      };
      accessToken = authenticationResult.AccessToken!;
      await UserModel.updateOne({ id: user.id }, { $set: user }, { upsert: true });
    }

    const { refreshToken, ...clientUser } = user;

    res
      .cookie('accessToken', accessToken, {
        maxAge: SESSION_DURATION_MS,
        httpOnly: true,
        sameSite: 'strict',
        secure: NODE_ENVIRONMENT === 'prod',
      })
      .status(200)
      .json({ data: clientUser });
  } catch (error) {
    res
      .status((error as LccError).status ?? 500)
      .json({ message: (error as LccError).message });
  }
}

export function logout(_req: Request, res: Response<ApiResponse<'success'>>): void {
  try {
    res.clearCookie('accessToken').status(200).json({ data: 'success' });
  } catch (error) {
    res.status(500).json({ message: `Unknown logout error: ${error}` });
  }
}

export async function refreshSession(
  req: Request,
  res: Response<ApiResponse<'success'>>,
): Promise<void> {
  try {
    const { userId } = req.body;
    const findResult = await UserModel.findOne({ id: userId });

    if (!findResult?.refreshToken) {
      res.status(403).json({ message: 'Session expired.' });
      return;
    }

    let accessToken: string;

    if (NODE_ENVIRONMENT === 'dev-offline') {
      accessToken = 'dev-mock-token-' + Date.now();
    } else {
      const authenticationResult = await cognitoService.initiateAuthWithRefreshToken(
        findResult.refreshToken,
      );
      if (isLccError(authenticationResult)) {
        throw authenticationResult;
      }
      accessToken = authenticationResult.AccessToken!;
    }

    res
      .cookie('accessToken', accessToken, {
        maxAge: SESSION_DURATION_MS,
        httpOnly: true,
        sameSite: 'strict',
        secure: NODE_ENVIRONMENT === 'prod',
      })
      .status(200)
      .json({ data: 'success' });
  } catch (error) {
    res
      .status((error as LccError).status ?? 500)
      .json({ message: (error as LccError).message });
  }
}

export async function sendCodeForPasswordChange(
  req: Request,
  res: Response<ApiResponse<'success'>>,
): Promise<void> {
  try {
    const email = req.body.email;

    if (typeof email !== 'string') {
      res.status(400).json({ message: 'Invalid email.' });
    }

    const response = await cognitoService.adminResetUserPassword(email);
    if (isLccError(response)) {
      throw response;
    }

    res.status(200).json({ data: response });
  } catch (error) {
    res
      .status((error as LccError).status ?? 500)
      .json({ message: (error as LccError).message });
  }
}

export async function changePassword(
  req: Request,
  res: Response<ApiResponse<ClientUser>>,
): Promise<void> {
  try {
    const { email, password, code } = req.body;

    if (typeof email !== 'string') {
      res.status(400).json({ message: 'Invalid email.' });
    } else if (typeof password !== 'string') {
      res.status(400).json({ message: 'Invalid password.' });
    } else if (typeof code !== 'string') {
      res.status(400).json({ message: 'Invalid code.' });
    }

    const response = await cognitoService.confirmForgotPassword(email, password, code);
    if (isLccError(response)) {
      throw response;
    }

    const authenticationResult = await cognitoService.initiateAuthWithEmailAndPassword(
      email,
      password,
    );
    if (isLccError(authenticationResult)) {
      throw authenticationResult;
    }

    const userAttributes = await cognitoService.getUser(authenticationResult.AccessToken);
    if (isLccError(userAttributes)) {
      throw userAttributes;
    }

    const user: User = {
      id: userAttributes.find(attr => attr.Name === 'sub')!.Value!,
      firstName: userAttributes.find(attr => attr.Name === 'given_name')!.Value!,
      lastName: userAttributes.find(attr => attr.Name === 'family_name')!.Value!,
      email: userAttributes.find(attr => attr.Name === 'email')!.Value!,
      isAdmin: true,
      refreshToken: authenticationResult.RefreshToken!,
    };

    await UserModel.updateOne({ id: user.id }, { $set: user }, { upsert: true });

    const { refreshToken, ...clientUser } = user;

    res
      .cookie('accessToken', authenticationResult.AccessToken, {
        maxAge: SESSION_DURATION_MS,
        httpOnly: true,
        sameSite: 'strict',
        secure: NODE_ENVIRONMENT === 'prod',
      })
      .status(200)
      .json({ data: clientUser });
  } catch (error) {
    res
      .status((error as LccError).status ?? 500)
      .json({ message: (error as LccError).message });
  }
}
