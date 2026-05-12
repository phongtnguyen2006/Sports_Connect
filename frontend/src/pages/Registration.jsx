import { useState } from 'react';

export default function Registration() {
  const [showRequirements, setShowRequirements] = useState(false);

  return (
    <div
      style={{
        minHeight: '80vh',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        paddingTop: '20px',
      }}
    >
      <h1>SportsConnect</h1>
      <h2>Register</h2>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          columnGap: '24px',
          rowGap: '20px',
          marginTop: '20px',
        }}
      >
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'flex-start',
          }}
        >
          <label style={{ fontWeight: 'bold', marginBottom: '8px' }}>
            First Name
          </label>

          <input
            type="text"
            placeholder="Enter your first name"
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
          }}
        >
          <label style={{ fontWeight: 'bold', marginBottom: '8px' }}>
            Last Name
          </label>

          <input
            type="text"
            placeholder="Enter your last name"
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
          }}
        >
          <label style={{ fontWeight: 'bold', marginBottom: '8px' }}>
            Date of Birth
          </label>

          <input
            type="date"
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
          }}
        >
          <label style={{ fontWeight: 'bold', marginBottom: '8px' }}>
            Username
          </label>

          <input
            type="text"
            placeholder="Create a username"
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
        </div>

        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'flex-start',
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

          <button
            type="button"
            onClick={() => setShowRequirements(true)}
            style={{
              marginTop: '8px',
              border: 'none',
              background: 'none',
              color: '#2563eb',
              fontSize: '14px',
              cursor: 'pointer',
              padding: 0,
            }}
          >
            Requirements
          </button>
        </div>

        <button
          type="button"
          style={{
            gridColumn: '1 / 3',
            marginTop: '10px',
            padding: '10px',
            width: '100%',
            border: 'none',
            borderRadius: '6px',
            backgroundColor: '#590808',
            color: 'white',
            fontSize: '16px',
            fontWeight: 'bold',
            cursor: 'pointer',
          }}
        >
          Register
        </button>
      </div>

      {showRequirements && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100vw',
            height: '100vh',
            backgroundColor: 'rgba(0, 0, 0, 0.4)',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <div
            style={{
              backgroundColor: 'white',
              padding: '24px',
              borderRadius: '8px',
              width: '320px',
              boxShadow: '0 4px 12px rgba(0, 0, 0, 0.2)',
            }}
          >
            <h3>Password Requirements</h3>

            <ul>
              <li>8-12 characters</li>
              <li>At least one special character</li>
              <li>At least one uppercase letter</li>
              <li>At least one lowercase letter</li>
            </ul>

            <button
              type="button"
              onClick={() => setShowRequirements(false)}
              style={{
                marginTop: '12px',
                padding: '8px 12px',
                border: 'none',
                borderRadius: '6px',
                backgroundColor: '#590808',
                color: 'white',
                cursor: 'pointer',
              }}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}