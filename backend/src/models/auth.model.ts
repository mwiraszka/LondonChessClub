import { JwtHeader } from 'jsonwebtoken';

export interface DecodedToken {
  header: JwtHeader;
  payload: unknown;
  signature: string;
}
