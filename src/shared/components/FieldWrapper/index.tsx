export type FieldWrapperProps = {
  children: React.ReactNode;
  htmlFor?: string;
  label?: string;
  error?: boolean | string;
};

export function FieldWrapper({
  label,
  htmlFor,
  error,
  children,
}: FieldWrapperProps) {
  return (
    <div>
      {label && <label htmlFor={htmlFor}>{label}</label>}
      {children}
      {typeof error === 'string' && <span>{error}</span>}
    </div>
  );
}
