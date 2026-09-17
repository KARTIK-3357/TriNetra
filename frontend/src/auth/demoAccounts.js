export const DEMO_GOVERNMENT_EMAIL = 'gov.admin@trinetra.gov.in';
export const DEMO_GOVERNMENT_PASSWORD = 'Trinetra@2026';
export const DEMO_CITIZEN_EMAIL = 'citizen@trinetra.gov.in';
export const DEMO_CITIZEN_PASSWORD = 'Citizen@2026';

export function authenticateDemoAccount(identifier, password) {
  const email = String(identifier || '').trim().toLowerCase();

  if (email === DEMO_GOVERNMENT_EMAIL && password === DEMO_GOVERNMENT_PASSWORD) {
    return {
      ok: true,
      access_token: 'trinetra-government-demo-token',
      user: {
        id: 'demo-government-admin',
        email: DEMO_GOVERNMENT_EMAIL,
        name: 'Government Demo Administrator',
        role: 'government',
      },
    };
  }

  if (email !== DEMO_CITIZEN_EMAIL || password !== DEMO_CITIZEN_PASSWORD) {
    return null;
  }

  return {
    ok: true,
    access_token: 'trinetra-citizen-demo-token',
    user: {
      id: 'demo-citizen-user',
      email: DEMO_CITIZEN_EMAIL,
      name: 'Citizen Demo User',
      role: 'citizen',
    },
  };
}
