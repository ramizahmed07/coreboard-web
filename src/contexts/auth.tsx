import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useReducer,
} from 'react';
import { useNavigate } from 'react-router-dom';
import { httpClient } from '../lib/httpClient';

// the different statuses of api request
type ApiStatus = 'idle' | 'resolved' | 'rejected' | 'pending';

export interface User {
  _id: string;
  username: string;
  role: 'teacher' | 'student';
  teacherId: string;
  voice: { lang: string; name: string };
}

interface AuthState {
  status: ApiStatus;
  isAuthenticated: boolean;
  user: User | null;
  error: string | null;
}

interface AuthProviderValue extends AuthState {
  isLoading: boolean;
  isError: boolean;
  isIdle: boolean;
  isSuccess: boolean;
  dispatch: React.Dispatch<AuthAction>;
}

interface AuthProviderProps {
  children: React.ReactNode;
}

// actions that the auth reducer accepts
export type AuthAction =
  | { type: 'STARTED' }
  | { type: 'RESOLVED'; payload: User }
  | { type: 'REJECTED'; payload: string }
  | { type: 'LOG_OUT' };

const initialState: AuthState = {
  status: 'idle',
  isAuthenticated: false,
  user: null,
  error: null,
};

const AuthContext = createContext<AuthProviderValue | undefined>(undefined);

const reducer = (state: AuthState, action: AuthAction): AuthState => {
  switch (action.type) {
    case 'STARTED':
      return { ...state, status: 'pending' };

    // if request successful, add user
    case 'RESOLVED':
      return {
        ...state,
        status: 'resolved',
        user: action.payload,
        isAuthenticated: true,
      };
    // if request failed, then add error
    case 'REJECTED':
      return {
        ...state,
        status: 'rejected',
        error: action.payload,
        isAuthenticated: false,
      };
    // clean everything on log out
    case 'LOG_OUT': {
      localStorage.removeItem('access_token');
      return {
        ...state,
        status: 'idle',
        isAuthenticated: false,
        error: null,
        user: null,
      };
    }
    default:
      return state;
  }
};

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [state, dispatch] = useReducer(reducer, initialState);
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchUser() {
      try {
        // request started
        dispatch({ type: 'STARTED' });
        const token = localStorage.getItem('access_token');
        if (!token) throw new Error();

        // fetch the current logged in user
        const { user } = await httpClient.get<{ user: User }>('/profile', {
          headers: {
            'x-authorization': token,
          },
        });

        // successful, add user to context
        dispatch({ type: 'RESOLVED', payload: user });
      } catch (error) {
        // failed, add error to context
        dispatch({
          type: 'REJECTED',
          payload: 'Please log in to access the app',
        });
      }
    }

    fetchUser();
  }, [dispatch, navigate]);

  const value = useMemo(
    () => ({
      ...state,
      isLoading: state.status === 'pending',
      isError: state.status === 'rejected',
      isIdle: state.status === 'idle',
      isSuccess: state.status === 'resolved',
      dispatch: dispatch,
    }),
    [state, dispatch]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export function useAuth() {
  const context = useContext(AuthContext);

  if (context === undefined)
    throw new Error('useAuth must be used within a AuthProvider');

  return context;
}
