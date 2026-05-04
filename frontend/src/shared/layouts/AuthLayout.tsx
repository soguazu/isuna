import type { ReactNode } from 'react';

type Props = {
  children: ReactNode;
};

export const AuthLayout = ({ children }: Props) => (
  <div className="auth-layout">
    <div className="auth-layout__brand">
      <div className="auth-layout__brand-content">
        <div className="auth-layout__logo">Inventra</div>
        <p className="auth-layout__tagline">Manage your products with clarity and precision.</p>
      </div>
    </div>
    <div className="auth-layout__form">
      <div className="auth-layout__form-inner">{children}</div>
    </div>
  </div>
);
