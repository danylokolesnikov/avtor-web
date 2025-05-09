import { useState } from 'react';
import cn from 'classnames';

import { isPromise } from '@/shared/utils/isPromise';

export type ButtonProps = React.DetailedHTMLProps<
  React.ButtonHTMLAttributes<HTMLButtonElement>,
  HTMLButtonElement
> & {
  isLoading?: boolean;
};

export function Button({
  children,
  onClick,
  type = 'button',
  disabled,
  isLoading: _isLoading,
  ...rest
}: ButtonProps) {
  const [isLoading, setLoading] = useState(false);

  let loading = isLoading || _isLoading;
  disabled = loading || disabled;

  const handleClick = (
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>,
  ) => {
    if (typeof onClick !== 'function') return;

    const result = onClick(event);

    if (isPromise(result)) {
      setLoading(true);
      const onEnded = () => setLoading(false);
      result.then(onEnded, onEnded);
    }
  };

  return (
    <button
      {...rest}
      disabled={disabled}
      type={type}
      onClick={handleClick}
      className={cn('border rounded-md p-2 cursor-pointer disabled:opacity-25', rest.className)}
    >
      {loading ? 'Loading...' : children}
    </button>
  );
}
