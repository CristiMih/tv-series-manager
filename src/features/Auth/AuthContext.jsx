import { createContext, useContext, useState } from "react";

const AuthContext = createContext(null);

const initialContextValue = {
  accessToken: null,
  user: null,
};

const storageKey = 'auth';

export function AuthContextProvider({ children }) {
  const [auth, setAuth] = useState(() => {
    const fromStorage = localStorage.getItem(storageKey)

    if(fromStorage) {
      return JSON.parse(fromStorage);
    }

    return initialContextValue;
  });

  function login(auth) {
    localStorage.setItem(storageKey, JSON.stringify(auth))
    setAuth(auth);
  }

  function logout() {
    localStorage.removeItem(storageKey);
    setAuth(initialContextValue);
  }

  return (
    <AuthContext value={{ ...auth, login, logout }}>{children}</AuthContext>
  );
}

export function useAuthContext() {
  const ctx = useContext(AuthContext);

  if (!ctx) {
    throw new Error(
      "The useAuthContext hook needs to be used in a descendant of the AuthContextProvider Component"
    );
  }

  return ctx;
}
