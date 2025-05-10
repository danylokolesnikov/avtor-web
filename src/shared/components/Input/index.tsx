import cn from 'classnames';

export type InputProps = React.DetailedHTMLProps<
  React.InputHTMLAttributes<HTMLInputElement>,
  HTMLInputElement
>;

export function Input({ className, ...rest }: InputProps) {
  return (
    <input
      {...rest}
      className={cn(
        'w-full py-2 px-4 rounded-lg border-[2px] border-[#E6E6E6]',
        className,
      )}
    />
  );
}
