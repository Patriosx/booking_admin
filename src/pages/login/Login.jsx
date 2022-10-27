import "./login.scss";
import { AuthContext } from "../../context/AuthContext";
import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const navigate = useNavigate();
  const { loading, error, login } = useContext(AuthContext);
  const [credentials, setCredentials] = useState({
    username: undefined,
    password: undefined,
  });
  const handleInputChange = (e) => {
    setCredentials({ ...credentials, [e.target.name]: e.target.value });
  };
  const handleSubmit = (e) => {
    e.preventDefault();
    login(credentials);
    navigate("/");
  };
  return (
    <div className="login">
      <div className="loginContainer">
        <form action="" onSubmit={handleSubmit}>
          <input
            type="text"
            name="username"
            id="username"
            placeholder="email o username"
            onChange={handleInputChange}
          />
          <input
            type="password"
            name="password"
            id="password"
            placeholder="password"
            onChange={handleInputChange}
          />
          <button disabled={loading}>Login</button>
          {error && <p>{error}</p>}
          {loading && <p>{"loading..."}</p>}
        </form>
      </div>
    </div>
  );
};

export default Login;
