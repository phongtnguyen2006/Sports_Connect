import { useState } from 'react';


import './Registration.css';

export default function Registration() {
  const [showRequirements, setShowRequirements] = useState(false);

  return (
    <div className="registration-page">
      <h1>SportsConnect</h1>
      <h2>Register</h2>

      <div className="registration-form">
        <div className="form-field">
          <label>First Name</label>
          <input type="text" placeholder="Enter your first name" />
        </div>

        <div className="form-field">
          <label>Last Name</label>
          <input type="text" placeholder="Enter your last name" />
        </div>

        <div className="form-field">
          <label>Username</label>
          <input type="text" placeholder="Create a username" />
        </div>

        <div className="form-field">
          <label>Email</label>
          <input type="email" placeholder="Enter your email" />
        </div>

        <div className="form-field">
          <label>Password</label>
          <input type="password" placeholder="Enter your password" />

          <button
            className="requirements-button"
            type="button"
            onClick={() => setShowRequirements(true)}
          >
            Requirements
          </button>
        </div>

        <button className="register-button" type="button">
          Register
        </button>
      </div>

      {showRequirements && (
        <div className="modal-overlay">
          <div className="requirements-modal">
            <h3>Password Requirements</h3>

            <ul>
              <li>8-12 characters</li>
              <li>At least one special character</li>
              <li>At least one uppercase letter</li>
              <li>At least one lowercase letter</li>
            </ul>

            <button
              className="close-button"
              type="button"
              onClick={() => setShowRequirements(false)}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}