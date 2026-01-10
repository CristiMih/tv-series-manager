 import { createContext, useContext, useState } from "react";

 const AuthContext = createContext(null);

 const initialContextValue = {
  accessToken: null,
  user: null,
 }

 export function AuthContextProvider({children}) {
  const [auth, setAuth] = useState(initialContextValue);

  function login(auth) {
    setAuth(auth);
  }

  function logout() {
    setAuth(initialContextValue);
  }

  return <AuthContext value={{...auth, login, logout}}>{children}</AuthContext>
 }

 export function useAuthContext() {
  const ctx = useContext(AuthContext);

  if(!ctx) {
    throw new Error('The useAuthContext hook needs to be used in a descendant of the AuthContextProvider Component')
  }

  return ctx;
 }
