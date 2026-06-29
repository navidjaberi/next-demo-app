import React, { useEffect, useState } from "react";
import { supabase } from "../lib/supabase/client";
const AuthContext = React.createContext({
  user: null,
  email: "",
  isLoggedin: false,
  login: async (email, password) => {},
  logout: async () => {},
});

export const AuthContextProvider = (props) => {
  const [user, setUser] = useState(null);
  const [email, setEmail] = useState(null);
  const [loading, setLoading] = useState(true);

  const userLoggedIn = !!user;
  useEffect(() => {
    const getUser = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (session?.user) {
        setUser(session.user);
        setEmail(session.user.email);
      }

      setLoading(false);
    };

    getUser();

    // listen تغییرات auth
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      if (session?.user) {
        setUser(session.user);
        setEmail(session.user.email);
      } else {
        setUser(null);
        setEmail(null);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  // LOGIN
  const loginHandler = async (email, password) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) throw error;

    setUser(data.user);
    setEmail(data.user.email);
  };
  const signupHandler = async (email, password) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    });

    if (error) throw error;

    setUser(data.user);
    setEmail(data.user.email);
  };
  const logoutHandler = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setEmail(null);
  };

  const contextValue = {
    user,
    email,
    isLoggedin: userLoggedIn,
    login: loginHandler,
    signup: signupHandler,
    logout: logoutHandler,
    loading,
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {props.children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
