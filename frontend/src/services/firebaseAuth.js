const FIREBASE_API_KEY = import.meta.env.VITE_FIREBASE_API_KEY || import.meta.env.VITE_API_KEY || '';

const ROLE_MAP = (() => {
  try {
    return JSON.parse(import.meta.env.VITE_FIREBASE_ROLE_MAP || '{}');
  } catch {
    return {};
  }
})();

const EMAIL_ROLE_MAP = (() => {
  try {
    return JSON.parse(import.meta.env.VITE_FIREBASE_EMAIL_ROLE_MAP || '{}');
  } catch {
    return {};
  }
})();

function getRoleFromFirebaseUser(user) {
  if (!user) return null;

  const uidRole = ROLE_MAP[user.localId] || ROLE_MAP[user.uid];
  if (uidRole) return uidRole;

  const emailRole = EMAIL_ROLE_MAP[String(user.email || '').toLowerCase()];
  if (emailRole) return emailRole;

  return null;
}

function normaliseIdentifier(value) {
  return String(value || '').trim();
}

export async function signInWithFirebase(identifier, password) {
  const email = normaliseIdentifier(identifier);

  if (!FIREBASE_API_KEY) {
    return {
      ok: false,
      code: 'MISSING_FIREBASE_CONFIG',
      message: 'Firebase API key is missing. Set VITE_FIREBASE_API_KEY in the environment.',
    };
  }

  if (!email || !password) {
    return {
      ok: false,
      code: 'INVALID_CREDENTIALS',
      message: 'Please enter your email and password.',
    };
  }

  try {
    const response = await fetch(
      `https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${FIREBASE_API_KEY}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          password,
          returnSecureToken: true,
        }),
      },
    );

    const data = await response.json();

    if (!response.ok) {
      return {
        ok: false,
        code: data?.error?.code || 'AUTH_FAILED',
        message: data?.error?.message || 'Authentication failed.',
      };
    }

    const role = getRoleFromFirebaseUser(data);

    if (!role) {
      return {
        ok: false,
        code: 'ROLE_NOT_FOUND',
        message: 'This Firebase account is not assigned to a supported dashboard role.',
      };
    }

    return {
      ok: true,
      access_token: data.idToken,
      user: {
        id: data.localId,
        email: data.email,
        name: data.displayName || data.email,
        role,
      },
    };
  } catch (error) {
    return {
      ok: false,
      code: 'AUTH_FAILED',
      message: error?.message || 'Unable to sign in with Firebase.',
    };
  }
}
