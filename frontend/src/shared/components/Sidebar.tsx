import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '@/features/auth/context/AuthContext';
import { usePermission } from '@/lib/hooks/usePermission';

export const Sidebar = () => {
  const { isAuthenticated, user, clearAuth } = useAuth();
  const { can } = usePermission();
  const navigate = useNavigate();

  const handleSignOut = () => {
    clearAuth();
    void navigate('/login');
  };

  const linkClass = ({ isActive }: { isActive: boolean }) =>
    `sidebar__link${isActive ? ' sidebar__link--active' : ''}`;

  return (
    <aside className="sidebar">
      <div className="sidebar__logo">
        <span className="sidebar__logo-mark">I</span>
        Inventra
      </div>

      <nav className="sidebar__nav" aria-label="Main navigation">
        <NavLink to="/products" className={linkClass}>
          <svg className="sidebar__link-icon" width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
            <rect x="1" y="1" width="6" height="6" rx="1" stroke="currentColor" strokeWidth="1.5" />
            <rect x="9" y="1" width="6" height="6" rx="1" stroke="currentColor" strokeWidth="1.5" />
            <rect x="1" y="9" width="6" height="6" rx="1" stroke="currentColor" strokeWidth="1.5" />
            <rect x="9" y="9" width="6" height="6" rx="1" stroke="currentColor" strokeWidth="1.5" />
          </svg>
          Products
        </NavLink>

        {can('users:read:list') && (
          <NavLink to="/users" className={linkClass}>
            <svg className="sidebar__link-icon" width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
              <circle cx="6" cy="5" r="3" stroke="currentColor" strokeWidth="1.5" />
              <path d="M1 14c0-2.761 2.239-5 5-5s5 2.239 5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
              <path d="M12 7l2 2 2-2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            Users
          </NavLink>
        )}
      </nav>

      <div className="sidebar__footer">
        {isAuthenticated && user ? (
          <>
            <NavLink to="/me" className="sidebar__user sidebar__user--link">
              <span className="sidebar__user-name">{user.name ?? user.email}</span>
              <span className="sidebar__user-role">{user.role.replace('_', ' ')}</span>
            </NavLink>
            <button type="button" className="sidebar__logout" onClick={handleSignOut}>
              Sign out
            </button>
          </>
        ) : (
          <NavLink to="/login" className="sidebar__signin">
            Sign in
          </NavLink>
        )}
      </div>
    </aside>
  );
};
