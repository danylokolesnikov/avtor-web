import { useState } from 'react';
import cn from 'classnames';

import { isPromise } from '@/shared/utils/isPromise';

import { Loader } from '../Loader';
import styles from './styles.module.css';

export type BaseButtonProps = React.DetailedHTMLProps<
  React.ButtonHTMLAttributes<HTMLButtonElement>,
  HTMLButtonElement
> & {
  isLoading?: boolean;
};

export function BaseButton({
  children,
  onClick,
  type = 'button',
  disabled,
  isLoading: _isLoading,
  ...rest
}: BaseButtonProps) {
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
      className={cn(styles.root, rest.className)}
    >
      {loading && (
        <span className="absolute">
          <Loader />
        </span>
      )}
      <span
        className={cn(
          loading && 'opacity-0',
          'flex justify-center items-center',
        )}
      >
        {children}
      </span>
    </button>
  );
}
