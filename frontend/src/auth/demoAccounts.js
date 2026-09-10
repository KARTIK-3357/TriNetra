export function authenticateDemoAccount() {
  return {
    ok: false,
    code: 'DEMO_DISABLED',
    message: 'Demo accounts have been removed. Use Firebase member authentication only.',
  };
}
