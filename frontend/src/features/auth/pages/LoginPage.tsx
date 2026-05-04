import { type FormEvent, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { authApi } from '@/lib/api/auth.api';
import { extractMessage } from '@/lib/utils/error';
import { useAuth } from '@/features/auth/context/AuthContext';
import { Alert } from '@/shared/components/Alert';
import { Button } from '@/shared/components/Button';
import { AuthLayout } from '@/shared/layouts/AuthLayout';

export const LoginPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { storeAuth } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const from = (location.state as { from?: string } | null)?.from ?? '/products';

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const result = await authApi.login(email, password);
      storeAuth(result.token, result.user);
      void navigate(from, { replace: true });
    } catch (err: unknown) {
      setError(extractMessage(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout>
      <h1 className="login-card__title">Welcome back</h1>
      <p className="login-card__subtitle">Sign in to your Inventra account</p>

      {error && <Alert variant="error">{error}</Alert>}

      <form className="login-card__form" onSubmit={(e) => void handleSubmit(e)} noValidate>
        <div className="field">
          <label className="field__label" htmlFor="email">
            Email <span className="field__required">*</span>
          </label>
          <input
            className="field__input"
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@company.com"
            required
            autoComplete="email"
          />
        </div>

        <div className="field">
          <label className="field__label" htmlFor="password">
            Password <span className="field__required">*</span>
          </label>
          <div className="field__password-wrap">
            <input
              className="field__input"
              id="password"
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
              autoComplete="current-password"
            />
            <button
              type="button"
              className="field__password-toggle"
              onClick={() => setShowPassword((v) => !v)}
              aria-label={showPassword ? 'Hide password' : 'Show password'}
            >
              {showPassword ? '●' : '○'}
            </button>
          </div>
        </div>

        <Button type="submit" loading={loading} full>
          {loading ? 'Signing in…' : 'Sign in'}
        </Button>
      </form>

      <p className="login-card__footer">© {new Date().getFullYear()} Inventra. All rights reserved.</p>
    </AuthLayout>
  );
};
