import { bypassAuthenticate } from './auth-bypass.middleware';
import { authenticate } from './auth.middleware';

const { NODE_ENVIRONMENT } = process.env;

/**
 * Exports the appropriate authentication middleware based on environment
 */
export const auth =
  NODE_ENVIRONMENT === 'dev-offline' ? bypassAuthenticate : authenticate;

if (NODE_ENVIRONMENT === 'dev-offline') {
  console.log('⚠️  OFFLINE MODE ENABLED - Authentication will be bypassed!');
}
