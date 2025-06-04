import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
} from 'react';
import { useGetMeQuery, v1Api } from '../api/v1';
import { parseCookies } from 'nookies';
import { authApi, useLogoutMutation } from '../api/auth';
import { useRouter } from 'next/router';
import { useAppDispatch } from '../store';
import { toast } from 'react-toastify';
import { ROUTE } from '../helpers/routers';
import { api } from '../api';
import { UserEntity } from '../types';
import { v1AdminApi } from '../api/v1-admin';

interface SessionContextType {
  user: UserEntity | null;
  isLoading: boolean;
  handleSucssesLogin: () => void;
  logout: () => void;
  isAuth: boolean;
}

const SessionContext = createContext<SessionContextType>(null!);

export const SessionProvider = ({ children }: { children: ReactNode }) => {
  const [logoutReq] = useLogoutMutation();
  const { push } = useRouter();
  const dispatch = useAppDispatch();
  const [hasToken, setHasToken] = useState<boolean | null>(null);
  const { data, isLoading: _isLoading } = useGetMeQuery(undefined, {
    skip: !hasToken,
  });

  const isLoading = _isLoading || hasToken === null;

  useEffect(() => {
    setHasToken(parseCookies().hasToken === '1');
  }, []);

  const logout = async () => {
    try {
      await toast.promise(logoutReq().unwrap(), {
        pending: 'Вихід...',
        success: 'Ви вийшли',
        error: 'Помилка виходу',
      });

      await push(ROUTE.home);

      dispatch(api.util.resetApiState());
      dispatch(authApi.util.resetApiState());
      dispatch(v1Api.util.resetApiState());
      dispatch(v1AdminApi.util.resetApiState());
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const handleSucssesLogin = () => setHasToken(true);

  return (
    <SessionContext.Provider
      value={{
        user: data ?? null,
        isAuth: Boolean(data),
        isLoading,
        handleSucssesLogin,
        logout,
      }}
    >
      {children}
    </SessionContext.Provider>
  );
};

export const useSession = (): SessionContextType => {
  const context = useContext(SessionContext);
  if (!context) {
    throw new Error('useSession must be used within a SessionProvider');
  }
  return context;
};
