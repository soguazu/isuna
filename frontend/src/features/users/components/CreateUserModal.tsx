import { type FormEvent, useState } from 'react';
import { usersApi } from '@/lib/api/users.api';
import type { UserRole } from '@/lib/types/auth';
import { extractMessage } from '@/lib/utils/error';
import { Alert } from '@/shared/components/Alert';
import { Button } from '@/shared/components/Button';

const roles: UserRole[] = ['admin', 'manager', 'viewer'];

type Props = {
  onClose: () => void;
  onCreated: () => void;
};

export const CreateUserModal = ({ onClose, onCreated }: Props) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<UserRole>('viewer');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError(null);
    try {
      await usersApi.create({ name, email, password, role });
      onCreated();
      onClose();
    } catch (err) {
      setError(extractMessage(err));
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal" role="dialog" aria-modal="true" aria-labelledby="modal-title" onClick={(e) => e.stopPropagation()}>
        <div className="modal__header">
          <h2 className="modal__title" id="modal-title">Create user</h2>
          <button type="button" className="modal__close" onClick={onClose} aria-label="Close">✕</button>
        </div>

        {error && <Alert variant="error">{error}</Alert>}

        <form className="form" onSubmit={(e) => void handleSubmit(e)}>
          <div className="field">
            <label className="field__label" htmlFor="user-name">Name <span className="field__required">*</span></label>
            <input className="field__input" id="user-name" value={name} onChange={(e) => setName(e.target.value)} required />
          </div>
          <div className="field">
            <label className="field__label" htmlFor="user-email">Email <span className="field__required">*</span></label>
            <input className="field__input" id="user-email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
          </div>
          <div className="field">
            <label className="field__label" htmlFor="user-password">Password <span className="field__required">*</span></label>
            <input className="field__input" id="user-password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required minLength={8} />
          </div>
          <div className="field">
            <label className="field__label" htmlFor="user-role">Role <span className="field__required">*</span></label>
            <select className="field__input" id="user-role" value={role} onChange={(e) => setRole(e.target.value as UserRole)}>
              {roles.map((r) => (
                <option key={r} value={r}>{r.replace('_', ' ')}</option>
              ))}
            </select>
          </div>
          <div className="form__actions">
            <Button type="submit" loading={saving}>{saving ? 'Creating…' : 'Create user'}</Button>
            <Button type="button" variant="outline" onClick={onClose}>Cancel</Button>
          </div>
        </form>
      </div>
    </div>
  );
};
