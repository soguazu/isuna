type Props = {
  message?: string;
};

export const FieldError = ({ message }: Props) => (
  <span className="field__error" role={message ? 'alert' : undefined}>
    {message ?? ''}
  </span>
);
