import { FieldWrapper, FieldWrapperProps } from '../FieldWrapper';
import { Input, InputProps } from '../Input';

type InputFieldProps = InputProps &
  Omit<FieldWrapperProps, 'children' | 'htmlFor'>;

export function InputField({ error, label, id, ...rest }: InputFieldProps) {
  return (
    <FieldWrapper htmlFor={id} error={error} label={label}>
      <Input id={id} {...rest} />
    </FieldWrapper>
  );
}
