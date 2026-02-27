import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from "./context/AuthContext";

function LoginForm({ loginUrl }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const { login } = useAuth();
  const navigate = useNavigate();

  async function handleLogin(e) {
    e.preventDefault();
    try {
      const response = await fetch(loginUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });
      if (response.ok) {
        const data = await response.json();
        login(username, data.access_token);
        navigate('/');
      } else if (response.status === 401) {
        setErrorMessage("Invalid username or password");
      }
    } catch (error) {
      console.log("Error:", error);
    }
  }

  return (
    <form onSubmit={handleLogin}>
      {errorMessage && <p>{errorMessage}</p>}
      <label>
        Username:
        <input
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
      </label>
      <br/>
      <label>
        Password:
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </label>
      <br/>
      <button type="submit">Login</button>
    </form>
  );
}

export default LoginForm;
