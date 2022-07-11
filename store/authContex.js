import React, { useEffect, useState } from "react";

const AuthContex = React.createContext({
  email:"",
  token: "",
  isLoggedin: false,
  login: (token) => {},
  logout: () => {},
});
export const AuthContexProvider = (props) => {
   useEffect(()=>{ const initialToken = localStorage.getItem("token")
                    const initialEmail=localStorage.getItem("email")
                    setEmail(initialEmail)
   setToken(initialToken)},[])
  
const [email,setEmail]=useState(null)
  const [token, setToken] = useState(null);
  const userLoggedIn = !!token;

  const loginHandler = (token,email) => {
    setToken(token);
    setEmail(email)
    localStorage.setItem("token", token);
    localStorage.setItem("email", email);
  };
  const logoutHandler = () => {
    setToken(null);
    setEmail(null)
    localStorage.removeItem("token");
    localStorage.removeItem("email")
  };
  const contexValue = {
    email:email,
    token: token,
    isLoggedin: userLoggedIn,
    login: loginHandler,
    logout: logoutHandler,
  };

  return (
    <AuthContex.Provider value={contexValue}>
      {props.children}
    </AuthContex.Provider>
  );
};
export default AuthContex;
