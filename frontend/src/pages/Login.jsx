import './Login.css';

export default function Login({ onRegisterClick, onForgotPasswordClick }) {
  return (
    <div className="login-page">
      <h1>SportsConnect</h1>
      <h2>Login</h2>

      <div className="login-field login-username-field">
        <label>Username</label>
        <input type="text" placeholder="Enter your username" />
      </div>

      <div className="login-field login-password-field">
        <label>Password</label>
        <input type="password" placeholder="Enter your password" />

        <div className="login-link-row">
          <button
            type="button"
            className="login-text-link"
            onClick={onRegisterClick}
          >
            Register
          </button>

          <button
            type="button"
            className="login-text-link"
            onClick={onForgotPasswordClick}
          >
            Forgot password?
          </button>
        </div>

        <button type="button" className="login-button">
          Login
        </button>
      </div>
    </div>
  );
}