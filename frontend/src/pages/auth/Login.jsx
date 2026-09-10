import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { getDashboardPath } from '../../constants/dashboardRoutes';
import './Login.css';

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function validateIdentifier(value) {
  const trimmed = value.trim();
  if (!trimmed) return 'Please enter your email.';
  if (trimmed.includes('@') && !EMAIL_PATTERN.test(trimmed)) {
    return 'Please enter a valid email address.';
  }
  return '';
}

function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [remember, setRemember] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [fieldError, setFieldError] = useState({ identifier: '', password: '' });
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');

    const identifierMessage = validateIdentifier(identifier);
    const passwordMessage = password ? '' : 'Please enter your password.';
    setFieldError({ identifier: identifierMessage, password: passwordMessage });

    if (identifierMessage || passwordMessage) return;

    setSubmitting(true);

    try {
      const result = await login(identifier, password, remember);

      if (!result.ok) {
        if (result.code === 'UNKNOWN_ACCOUNT') {
          setError('Account not found. Please check your credentials.');
        } else {
          setError('Incorrect email or password. Please try again.');
        }
        return;
      }

      navigate(getDashboardPath(result.user.role), { replace: true });
    } catch {
      setError('Unable to sign in right now. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="trinetra-auth">
      <section className="auth-brand" aria-label="TRINETRA">
        <div className="auth-brand-inner">
          <div className="auth-logo-row">
            <div className="auth-logo-plate">
              <img src="/trinetra-logo.jpg" alt="TRINETRA logo" />
            </div>
            <div>
              <p className="auth-kicker">Secure Government Access</p>
              <h1>TRINETRA</h1>
            </div>
          </div>

          <h2>
            Government Project Monitoring
            <br />
            &amp; Transparency Platform
          </h2>

          <p className="auth-statement">
            Enabling transparent, accountable and data-driven monitoring of public infrastructure.
          </p>

          <ul className="auth-pillars">
            <li>Roads, bridges and civic works</li>
            <li>Field progress and expenditure tracking</li>
            <li>Role-based secure access</li>
          </ul>
        </div>

        <svg className="auth-infra" viewBox="0 0 640 280" aria-hidden="true">
          <path d="M0 220 L90 168 L140 188 L230 120 L310 168 L390 96 L480 150 L560 118 L640 160 V280 H0 Z" fill="rgba(255,255,255,0.05)" />
          <path d="M0 236 H640" stroke="rgba(166,202,186,0.35)" strokeWidth="2" />
          <path d="M40 236 V188 H70 V236" fill="none" stroke="rgba(255,255,255,0.18)" strokeWidth="3" />
          <path d="M180 236 C220 150, 280 150, 320 236" fill="none" stroke="rgba(166,202,186,0.45)" strokeWidth="3" />
          <path d="M430 236 V150 H455 V236" fill="none" stroke="rgba(255,255,255,0.2)" strokeWidth="3" />
          <circle cx="540" cy="96" r="18" fill="none" stroke="rgba(166,202,186,0.28)" strokeWidth="2" />
        </svg>
      </section>

      <section className="auth-panel">
        <div className="auth-card">
          <p className="auth-card-kicker">Secure sign-in</p>
          <h2>Welcome to Trinetra</h2>
          <p className="auth-lead">Members-only sign in to access your dashboard</p>

          {error ? (
            <div className="auth-alert" role="alert">
              {error}
            </div>
          ) : null}

          <form onSubmit={handleSubmit} noValidate>
            <div className="auth-field">
              <label htmlFor="identifier">Email / Registered ID</label>
              <input
                id="identifier"
                name="identifier"
                type="text"
                autoComplete="username"
                placeholder="you@example.com or registered ID"
                value={identifier}
                onChange={(event) => {
                  setIdentifier(event.target.value);
                  setFieldError((current) => ({ ...current, identifier: '' }));
                }}
                aria-invalid={Boolean(fieldError.identifier)}
                aria-describedby={fieldError.identifier ? 'identifier-error' : undefined}
                disabled={submitting}
              />
              {fieldError.identifier ? (
                <p id="identifier-error" className="auth-field-error">
                  {fieldError.identifier}
                </p>
              ) : null}
            </div>

            <div className="auth-field">
              <label htmlFor="password">Password</label>
              <div className="auth-input-wrap">
                <input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="current-password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(event) => {
                    setPassword(event.target.value);
                    setFieldError((current) => ({ ...current, password: '' }));
                  }}
                  aria-invalid={Boolean(fieldError.password)}
                  aria-describedby={fieldError.password ? 'password-error' : undefined}
                  disabled={submitting}
                />
                <button
                  type="button"
                  className="auth-visibility"
                  onClick={() => setShowPassword((value) => !value)}
                  aria-pressed={showPassword}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? 'Hide' : 'Show'}
                </button>
              </div>
              {fieldError.password ? (
                <p id="password-error" className="auth-field-error">
                  {fieldError.password}
                </p>
              ) : null}
            </div>

            <div className="auth-row">
              <label className="auth-remember">
                <input
                  type="checkbox"
                  checked={remember}
                  onChange={(event) => setRemember(event.target.checked)}
                />
                Remember me
              </label>
              <Link className="auth-forgot" to="/forgot-password">
                Forgot password?
              </Link>
            </div>

            <button className="auth-submit" type="submit" disabled={submitting}>
              {submitting ? (
                <>
                  <span className="auth-spinner" aria-hidden="true" />
                  Signing in...
                </>
              ) : (
                'Sign In'
              )}
            </button>
          </form>

          <p className="auth-note">
            Access is assigned to your registered account. You will be directed to the dashboard linked to that account.
          </p>
        </div>

        <p className="auth-foot">
          © 2026 TRINETRA — Smart India Hackathon by Team Foresight Perceivers
        </p>
      </section>
    </div>
  );
}

export default Login;
