import './Login.css';

export default function ForgotPassword() {
  return (
    <div className="login-page">
      <h1>SportsConnect</h1>
      <h2>Forgot Password</h2>

      <div className="login-field login-username-field">
        <label>Email</label>
        <input type="email" placeholder="Enter your email" />
      </div>

      <div className="login-field login-password-field">
        <button type="button" className="login-button">
          Send Reset Email
        </button>
      </div>
    </div>
  );
}