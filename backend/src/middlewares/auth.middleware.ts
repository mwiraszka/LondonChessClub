import crypto from 'crypto';
import { NextFunction, Request, Response } from 'express';
import jwt, { JwtPayload } from 'jsonwebtoken';

import { ApiErrorResponse } from '../models/api-response.model';
import { DecodedToken } from '../models/auth.model';
import { isDefined } from '../util/is-defined.util';

const { AWS_COGNITO_REGION, AWS_COGNITO_USER_POOL_ID, AWS_COGNITO_USER_POOL_CLIENT_ID } =
  process.env;
if (
  !AWS_COGNITO_REGION ||
  !AWS_COGNITO_USER_POOL_ID ||
  !AWS_COGNITO_USER_POOL_CLIENT_ID
) {
  throw new Error('Unable to parse AWS Cognito environment variables.');
}

const JWKS_URI = `https://cognito-idp.${AWS_COGNITO_REGION}.amazonaws.com/${AWS_COGNITO_USER_POOL_ID}/.well-known/jwks.json`;
const COGNITO_ISSUER = `https://cognito-idp.${AWS_COGNITO_REGION}.amazonaws.com/${AWS_COGNITO_USER_POOL_ID}`;
const JWKS_CACHE_DURATION_MS = 10 * 60 * 1000; // 10 minutes

interface JwksKey {
  kid: string;
  kty: string;
  use?: string;
  n?: string;
  e?: string;
}

let cachedKeys: JwksKey[] | null = null;
let cacheTimestamp = 0;

async function getSigningKey(kid: string): Promise<string> {
  if (!cachedKeys || Date.now() - cacheTimestamp > JWKS_CACHE_DURATION_MS) {
    const response = await fetch(JWKS_URI);
    const jwks = (await response.json()) as { keys: JwksKey[] };
    cachedKeys = jwks.keys;
    cacheTimestamp = Date.now();
  }

  const jwk = cachedKeys.find(key => key.kid === kid && key.kty === 'RSA');
  if (!jwk) {
    // Key not found — cache may be stale (e.g., after key rotation), so retry once
    const response = await fetch(JWKS_URI);
    const jwks = (await response.json()) as { keys: JwksKey[] };
    cachedKeys = jwks.keys;
    cacheTimestamp = Date.now();

    const retryJwk = cachedKeys.find(key => key.kid === kid && key.kty === 'RSA');
    if (!retryJwk) {
      throw new Error(`Unable to find signing key matching kid '${kid}'`);
    }
    return jwkToPem(retryJwk);
  }

  return jwkToPem(jwk);
}

function jwkToPem(jwk: JwksKey): string {
  const publicKey = crypto.createPublicKey({ key: jwk, format: 'jwk' });
  return publicKey.export({ type: 'spki', format: 'pem' }) as string;
}

export const authenticate = async (
  req: Request,
  res: Response<ApiErrorResponse>,
  next: NextFunction,
) => {
  try {
    const accessToken = req.cookies['accessToken'];

    if (!accessToken) {
      res.status(401).json({ message: 'Unauthorized.' });
      return;
    }

    const resultValidation = await validateToken(accessToken);

    if (!isDefined(resultValidation) || typeof resultValidation === 'string') {
      res.status(401).json({ message: 'Unable to validate JWT token.' });
      return;
    }

    // Currently not used in any controller;
    // in the future can also check which groups the user is a part of by decoding the ID token
    req.user = {
      id: resultValidation['sub'] as string,
      scope: resultValidation['scope'],
    };

    next();
  } catch (error) {
    // Token validation errors (expired, invalid signature, etc.) should also return 401
    res.status(401).json({
      message: `Authentication failed: ${error instanceof Error ? error.message : error}`,
    });
    return;
  }
};

export async function validateToken(
  token: string,
): Promise<JwtPayload | string | undefined> {
  const decodedToken: DecodedToken = jwt.decode(token, {
    complete: true,
  }) as DecodedToken;

  if (!decodedToken?.header?.kid) {
    throw new Error('Invalid token: missing kid');
  }

  const signingKey = await getSigningKey(decodedToken.header.kid);

  return new Promise((resolve, reject) => {
    jwt.verify(
      token,
      signingKey,
      {
        issuer: COGNITO_ISSUER,
        algorithms: ['RS256'],
      },
      (error, decoded) => {
        if (error) {
          reject(error);
        } else {
          resolve(decoded);
        }
      },
    );
  });
}

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace Express {
    interface Request {
      user: { id: string; scope: string };
    }
  }
}
