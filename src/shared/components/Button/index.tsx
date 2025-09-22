import cn from 'classnames';

import { BaseButton, BaseButtonProps } from '../BaseButton';

import styles from './styles.module.css';

export type ButtonProps = BaseButtonProps & {
  variant?: 'primary' | 'secondary' | 'green' | null;
  size?: 'large' | 'small';
};

export function Button({
  variant = 'primary',
  size = 'large',
  ...rest
}: ButtonProps) {
  return (
    <BaseButton
      {...rest}
      className={cn(
        styles.root,
        variant && styles[variant],
        styles[size],
        rest.className,
      )}
    />
  );
}
