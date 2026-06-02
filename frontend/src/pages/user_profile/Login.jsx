import { useState } from "react";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { loginUser } from "../../api/users";
import "./Login.css";

export default function Login({setCurrentUser}) {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  function handleChange(event) {
    const { name, value } = event.target;

    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");
    setLoading(true);

    try {
      const data = await loginUser(formData);

      if (data.session?.access_token) {
        localStorage.setItem("access_token", data.session.access_token);
      }

      const userDataResponse = await fetch ("/api/users/user-data", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${data.session.access_token}`,
        },

      });
      if (!userDataResponse.ok) {
        throw new Error(userData.error || "Could not load user data");
      }
      const userData = await userDataResponse.json();
      setCurrentUser(userData.user);

      navigate("/feed");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="login-page">
      <h1>SportsConnect</h1>
      <h2>Login</h2>

      {error && <p className="login-error">{error}</p>}

      <form className="login-form" onSubmit={handleSubmit}>
        <div>
          <label htmlFor="email">Email</label>
          <input
            id="email"
            type="email"
            name="email"
            placeholder="Enter your email"
            value={formData.email}
            onChange={handleChange}
          />
        </div>

        <div>
          <label htmlFor="password">Password</label>
          <input
            id="password"
            type="password"
            name="password"
            placeholder="Enter your password"
            value={formData.password}
            onChange={handleChange}
          />

          <a className="forgot-password-link" href="#">
            Forgot password?
          </a>

          <Link className="register-instead-link" to="/Registration">
            Register instead
          </Link>
        </div>

        <button type="submit" disabled={loading}>
          {loading ? "Logging in..." : "Login"}
        </button>
      </form>
    </div>
  );
}
