export default function ForgotPassword({ onBackToLogin }) {
  return (
    <div
      style={{
        minHeight: '70vh',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <h1>SportsConnect</h1>
      <h2>Forgot Password</h2>

      <p style={{ marginTop: '10px', marginBottom: '20px' }}>
        Enter your email and we will send you a password reset link.
      </p>

      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'flex-start',
        }}
      >
        <label style={{ fontWeight: 'bold', marginBottom: '8px' }}>
          Email
        </label>

        <input
          type="email"
          placeholder="Enter your email"
          style={{
            padding: '10px',
            width: '250px',
            border: '1px solid #ccc',
            borderRadius: '6px',
            fontSize: '16px',
          }}
        />

        <button
          type="button"
          style={{
            marginTop: '20px',
            padding: '10px',
            width: '272px',
            border: 'none',
            borderRadius: '6px',
            backgroundColor: '#590808',
            color: 'white',
            fontSize: '16px',
            fontWeight: 'bold',
            cursor: 'pointer',
          }}
        >
          Send Email
        </button>

        <button
          type="button"
          onClick={onBackToLogin}
          style={{
            marginTop: '12px',
            border: 'none',
            background: 'none',
            color: '#2563eb',
            fontSize: '14px',
            cursor: 'pointer',
            padding: 0,
            alignSelf: 'center',
          }}
        >
          Back to Login
        </button>
      </div>
    </div>
  );
}