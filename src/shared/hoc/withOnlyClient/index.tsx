import { useEffect, useState, ComponentType, JSX } from 'react';

export function withClientOnly<TProps extends JSX.IntrinsicAttributes>(
  Component: ComponentType<TProps>,
) {
  const ClientOnly = (props: TProps): JSX.Element | null => {
    const [hasMounted, setHasMounted] = useState(false);

    useEffect(() => {
      setHasMounted(true);
    }, []);

    if (!hasMounted) return null;

    return <Component {...props} />;
  };

  ClientOnly.displayName = `withClientOnly(${Component.displayName || Component.name || 'Component'})`;

  return ClientOnly;
}
