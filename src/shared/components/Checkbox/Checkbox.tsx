import cn from 'classnames';
import { forwardRef } from 'react';

export type CheckboxProps = React.InputHTMLAttributes<HTMLInputElement>;

export const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(
  (props, ref) => {
    return (
      <label className="inline-flex items-center cursor-pointer">
        <input type="checkbox" ref={ref} {...props} className="sr-only peer" />
        <div className="w-14 h-8 bg-gray-300 peer-checked:bg-green-500 rounded-full transition-all relative flex peer-checked:justify-end">
          <div className="w-6 h-6 bg-white rounded-full absolute block m-1" />
        </div>
      </label>
    );
  },
);
