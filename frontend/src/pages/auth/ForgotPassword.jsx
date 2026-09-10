import { useState } from 'react';
import { Link } from 'react-router-dom';
import { requestPasswordReset } from '../../services/authService';
import './Login.css';

function ForgotPassword() {
  const [identifier, setIdentifier] = useState('');
  const [error, setError] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');
    setSubmitted(false);

    if (!identifier.trim()) {
      setError('Please enter your email.');
      return;
    }

    setSubmitting(true);
    try {
      await requestPasswordReset(identifier.trim());
      setSubmitted(true);
    } catch {
      setError('Unable to submit this request right now.');
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
          <h2>Account recovery</h2>
          <p className="auth-statement">
            Password reset is administered through the registered department once backend services are connected.
          </p>
        </div>
      </section>

      <section className="auth-panel">
        <div className="auth-card">
          <p className="auth-card-kicker">Account assistance</p>
          <h2>Forgot password</h2>
          <p className="auth-lead">Enter your registered email or ID. No email will be sent from this demonstration page.</p>

          {error ? <div className="auth-alert" role="alert">{error}</div> : null}
          {submitted ? (
            <div className="auth-alert" role="status" style={{ background: '#edf7f2', borderColor: '#c5e0d4', color: '#1f6b57' }}>
              Request recorded on this device. Connect FastAPI later to complete departmental password reset. No email has been sent.
            </div>
          ) : null}

          <form onSubmit={handleSubmit} noValidate>
            <div className="auth-field">
              <label htmlFor="reset-identifier">Email / Registered ID</label>
              <input
                id="reset-identifier"
                value={identifier}
                onChange={(event) => setIdentifier(event.target.value)}
                placeholder="you@example.com or registered ID"
                autoComplete="username"
              />
            </div>
            <button className="auth-submit" type="submit" disabled={submitting}>
              {submitting ? 'Submitting…' : 'Submit request'}
            </button>
          </form>

          <p className="auth-note">
            <Link className="auth-forgot" to="/login">Return to sign in</Link>
          </p>
        </div>
      </section>
    </div>
  );
}

export default ForgotPassword;
