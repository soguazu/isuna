type Props = {
  size?: 'sm' | 'md' | 'lg';
  white?: boolean;
};

export const Spinner = ({ size = 'md', white }: Props) => {
  const cls = ['spinner', size !== 'md' && `spinner--${size}`, white && 'spinner--white']
    .filter(Boolean)
    .join(' ');
  return <span className={cls} role="status" aria-label="Loading" />;
};
