import type { ReactNode } from 'react';

type AlertVariant = 'error' | 'success' | 'warning';

type Props = {
  variant?: AlertVariant;
  children: ReactNode;
};

const icons: Record<AlertVariant, string> = {
  error: '✕',
  success: '✓',
  warning: '!',
};

export const Alert = ({ variant = 'error', children }: Props) => (
  <div className={`alert alert--${variant}`} role="alert">
    <span className="alert__icon">{icons[variant]}</span>
    <span>{children}</span>
  </div>
);
