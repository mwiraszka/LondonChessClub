import { isDefined } from '../util/is-defined.util';

export interface LccError extends Error {
  name: 'LCCError';
  message: string;
  status?: number;
}

export function isLccError(value: unknown): value is LccError {
  return (
    isDefined(value) &&
    typeof value === 'object' &&
    ['name', 'message', 'status'].every(property => property in value) &&
    (value as LccError).name === 'LCCError'
  );
}

export interface CognitoError extends Error {
  message: string;
  $metadata: {
    httpStatusCode: number | undefined;
  };
}

export function isCognitoError(value: unknown): value is CognitoError {
  return (
    isDefined(value) &&
    typeof value === 'object' &&
    ['name', 'message', '$metadata'].every(property => property in value) &&
    (value as LccError).name !== 'LCCError'
  );
}
