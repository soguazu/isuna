import type { ComponentPropsWithoutRef } from 'react';
import { Spinner } from './Spinner';

type Variant = 'primary' | 'outline' | 'ghost' | 'danger' | 'danger-outline';
type Size = 'sm' | 'md' | 'lg';

type Props = ComponentPropsWithoutRef<'button'> & {
  variant?: Variant;
  size?: Size;
  loading?: boolean;
  full?: boolean;
};

export const Button = ({
  variant = 'primary',
  size = 'md',
  loading,
  full,
  disabled,
  children,
  className = '',
  ...rest
}: Props) => {
  const cls = [
    'btn',
    `btn--${variant}`,
    size !== 'md' && `btn--${size}`,
    full && 'btn--full',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <button className={cls} disabled={disabled || loading} {...rest}>
      {loading && <Spinner size="sm" white={variant === 'primary' || variant === 'danger'} />}
      {children}
    </button>
  );
};
