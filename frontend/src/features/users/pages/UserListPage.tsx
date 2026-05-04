import { useEffect, useState } from 'react';
import { usersApi } from '@/lib/api/users.api';
import type { User } from '@/lib/types/user';
import { extractMessage } from '@/lib/utils/error';
import { usePermission } from '@/lib/hooks/usePermission';
import { useAuth } from '@/features/auth/context/AuthContext';
import { Alert } from '@/shared/components/Alert';
import { Button } from '@/shared/components/Button';
import { Spinner } from '@/shared/components/Spinner';
import { CreateUserModal } from '../components/CreateUserModal';

export const UserListPage = () => {
  const { can } = usePermission();
  const { user: me } = useAuth();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [disablingId, setDisablingId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [showCreate, setShowCreate] = useState(false);

  const load = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await usersApi.list();
      setUsers(data);
    } catch (err) {
      setError(extractMessage(err));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void load();
  }, []);

  const handleDisable = async (user: User) => {
    if (!window.confirm(`Disable "${user.name ?? user.email}"? They will not be able to sign in.`)) return;
    setDisablingId(user.id);
    setError(null);
    try {
      await usersApi.disable(user.id);
      await load();
    } catch (err) {
      setError(extractMessage(err));
    } finally {
      setDisablingId(null);
    }
  };

  const roleLabel = (role: string) => role.replace('_', ' ');

  return (
    <div className="page">
      <div className="page__header">
        <div>
          <p className="eyebrow">Administration</p>
          <h1>Users</h1>
        </div>
        {can('users:create') && (
          <Button onClick={() => setShowCreate(true)}>+ New user</Button>
        )}
      </div>

      {error && <Alert variant="error">{error}</Alert>}

      <div className="card">
        <div className="card__toolbar">
          {loading ? <Spinner size="sm" /> : <span className="card__count">{users.length} user{users.length !== 1 ? 's' : ''}</span>}
        </div>

        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Name / Email</th>
                <th>Role</th>
                <th>Status</th>
                <th>Joined</th>
                {can('users:disable') && <th aria-label="Actions" />}
              </tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr key={u.id}>
                  <td>
                    <strong>{u.name ?? '—'}</strong>
                    <small>{u.email}</small>
                  </td>
                  <td>
                    <span className={`role-badge role-badge--${u.role}`}>{roleLabel(u.role)}</span>
                  </td>
                  <td>
                    <span className={`status-badge status-badge--${u.isActive ? 'active' : 'inactive'}`}>
                      {u.isActive ? 'Active' : 'Disabled'}
                    </span>
                  </td>
                  <td>{new Date(u.createdAt).toLocaleDateString()}</td>
                  {can('users:disable') && (
                    <td>
                      {u.id !== me?.id && u.isActive && (
                        <Button
                          variant="danger-outline"
                          size="sm"
                          type="button"
                          loading={disablingId === u.id}
                          onClick={() => void handleDisable(u)}
                        >
                          Disable
                        </Button>
                      )}
                    </td>
                  )}
                </tr>
              ))}
              {!loading && users.length === 0 && (
                <tr>
                  <td className="empty-state" colSpan={can('users:disable') ? 5 : 4}>
                    No users found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {showCreate && (
        <CreateUserModal
          onClose={() => setShowCreate(false)}
          onCreated={() => { void load(); }}
        />
      )}
    </div>
  );
};
