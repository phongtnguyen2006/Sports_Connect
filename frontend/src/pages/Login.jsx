export default function Login() {
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
      <h2>Login</h2>

      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'flex-start',
          marginTop: '20px',
        }}
      >
        <label style={{ fontWeight: 'bold', marginBottom: '8px' }}>
          Username
        </label>

        <input
          type="text"
          placeholder="Enter your username"
          style={{
            padding: '10px',
            width: '250px',
            border: '1px solid #ccc',
            borderRadius: '6px',
            fontSize: '16px',
          }}
        />
      </div>

      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'flex-start',
          marginTop: '40px',
        }}
      >
        <label style={{ fontWeight: 'bold', marginBottom: '8px' }}>
          Password
        </label>

        <input
          type="password"
          placeholder="Enter your password"
          style={{
            padding: '10px',
            width: '250px',
            border: '1px solid #ccc',
            borderRadius: '6px',
            fontSize: '16px',
          }}
        />
        <a
        href="#"
        style={{
            alignSelf: 'flex-end',
            marginTop: '8px',
            fontSize: '14px',
            color: '#2563eb',
            textDecoration: 'none',
        }}
        >
        Forgot password?
        </a>
        
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
        Login
        </button>

        </div>
    </div>
  );
}
