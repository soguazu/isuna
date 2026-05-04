import { type FormEvent, useEffect, useState } from 'react';
import { usersApi } from '@/lib/api/users.api';
import type { AuthUser } from '@/lib/types/auth';
import { extractMessage } from '@/lib/utils/error';
import { useAuth } from '@/features/auth/context/AuthContext';
import { Alert } from '@/shared/components/Alert';
import { Button } from '@/shared/components/Button';

export const ProfilePage = () => {
  const { user: sessionUser, storeAuth } = useAuth();
  const [profile, setProfile] = useState<AuthUser | null>(sessionUser);
  const [name, setName] = useState(sessionUser?.name ?? '');
  const [email, setEmail] = useState(sessionUser?.email ?? '');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetch = async () => {
      setLoading(true);
      try {
        const me = await usersApi.me();
        setProfile(me);
        setName(me.name ?? '');
        setEmail(me.email);
      } catch (err) {
        setError(extractMessage(err));
      } finally {
        setLoading(false);
      }
    };
    void fetch();
  }, []);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError(null);
    setSuccess(false);
    const payload: Record<string, string> = {};
    if (name !== profile?.name) payload.name = name;
    if (email !== profile?.email) payload.email = email;
    if (password) payload.password = password;
    if (Object.keys(payload).length === 0) { setSaving(false); return; }
    try {
      const updated = await usersApi.updateMe(payload);
      const token = localStorage.getItem('auth_token') ?? '';
      storeAuth(token, updated);
      setProfile(updated);
      setPassword('');
      setSuccess(true);
    } catch (err) {
      setError(extractMessage(err));
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="page"><div className="page__header"><h1>Profile</h1></div></div>;

  return (
    <div className="page">
      <div className="page__header">
        <div>
          <p className="eyebrow">Account</p>
          <h1>My profile</h1>
        </div>
      </div>

      <div className="card card--narrow">
        {error && <Alert variant="error">{error}</Alert>}
        {success && <Alert variant="success">Profile updated.</Alert>}

        <div className="profile-meta">
          <span className={`role-badge role-badge--${profile?.role}`}>{profile?.role.replace('_', ' ')}</span>
        </div>

        <form className="form" onSubmit={(e) => void handleSubmit(e)}>
          <div className="field">
            <label className="field__label" htmlFor="profile-name">Name</label>
            <input className="field__input" id="profile-name" value={name} onChange={(e) => setName(e.target.value)} />
          </div>
          <div className="field">
            <label className="field__label" htmlFor="profile-email">Email</label>
            <input className="field__input" id="profile-email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
          </div>
          <div className="field">
            <label className="field__label" htmlFor="profile-password">New password <span className="field__hint">(leave blank to keep current)</span></label>
            <input className="field__input" id="profile-password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} minLength={8} placeholder="••••••••" autoComplete="new-password" />
          </div>
          <div className="form__actions">
            <Button type="submit" loading={saving}>{saving ? 'Saving…' : 'Save changes'}</Button>
          </div>
        </form>
      </div>
    </div>
  );
};
