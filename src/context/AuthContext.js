import axios from "axios";
import { useEffect } from "react";
import { useReducer } from "react";
import { createContext } from "react";
import authReducer from "./authReducer";

const initialState = {
  //localstorage has to be String
  user: JSON.parse(localStorage.getItem("user")) || null, //if there is a user saved in localStorage
  loading: false,
  error: false,
};
export const AuthContext = createContext(initialState);

const AuthContextProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  const login = async (credentials) => {
    dispatch({ type: "LOGIN_START" });
    try {
      const res = await axios.post("/auth/login", credentials);
      dispatch({ type: "LOGIN_SUCCESS", payload: res.data.details });
    } catch (err) {
      dispatch({ type: "LOGIN_FAILURE", payload: err.response.data.message });
    }
  };
  const logout = () => {
    dispatch({ type: "LOGOUT" });
  };
  useEffect(() => {
    //when user changes we save in localstorage
    localStorage.setItem("user", JSON.stringify(state.user));
  }, [state.user]);
  return (
    <AuthContext.Provider
      value={{
        user: state.user,
        loading: state.loading,
        error: state.error,
        dispatch,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContextProvider;
