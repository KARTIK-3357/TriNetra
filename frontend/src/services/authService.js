import { signInWithFirebase } from './firebaseAuth';

export async function login(identifier, password) {
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
