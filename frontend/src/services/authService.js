import { signInWithFirebase } from './firebaseAuth';
import { authenticateDemoAccount } from '../auth/demoAccounts';

export async function login(identifier, password) {
  const demoResult = authenticateDemoAccount(identifier, password);
  if (demoResult) return demoResult;

  return signInWithFirebase(identifier, password);
}

export async function requestPasswordReset(identifier) {
  const email = String(identifier || '').trim();

  if (!email) {
    return { ok: false, queued: false };
  }

  return { ok: true, queued: false };
}

export const authService = {
  login,
  requestPasswordReset,
};
