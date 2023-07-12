import { Meteor } from "meteor/meteor";
import { User } from "/models/user";
import React, {
  ReactNode,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import { useSnackbar } from "./snackbar-context";
import { useLocalStorage } from "/hooks/localstorage";
type Status = "authenticated" | "unauthenticated" | "loading";

interface AuthContextProps {
  user: User | null;
  status: Status;
  updateToken: (token: string) => void;
  logout: () => void;
  authenticate: (email: string) => Promise<any>;
  updateUser: () => void;
}

interface AuthProviderProps {
  children: ReactNode;
}

const AuthContext = React.createContext<AuthContextProps>({
  user: null,
} as AuthContextProps);

export const useAuth = () => {
  return useContext(AuthContext);
};

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<User | null>(null);
  const [status, setStatus] = useState<Status>("loading");
  const [token, setToken] = useLocalStorage<string | null>("token", null);

  const verifyToken = useCallback(() => {
    if (token) {
      Meteor.call(
        "getUserWithAuthToken",
        token,
        (err: Meteor.Error, user: User | null) => {
          if (err) {
            openSnackbar("error", err.reason as string);
            resetUser();
          } else {
            if (user) {
              setUser(user);
              setStatus("authenticated");
            } else {
              resetUser();
              openSnackbar("info", "Token expired");
            }
          }
        }
      );
    } else {
      setUser(null);
      setStatus("unauthenticated");
    }
  }, [token]);
  const { openSnackbar } = useSnackbar();

  const resetUser = () => {
    setUser(null);
    setToken(null);
    setStatus("unauthenticated");
  };

  const updateToken = (token: string) => {
    setToken(token);
  };

  const authenticate = (email: string) =>
    Meteor.callAsync("authenticate", email);

  const logout = () => {
    setToken(null);
  };
  const updateUser = () => {
    verifyToken();
  };

  useEffect(() => {
    verifyToken();
  }, [verifyToken]);

  const value = {
    user,
    updateToken,
    logout,
    authenticate,
    status,
    updateUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
