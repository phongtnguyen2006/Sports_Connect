import { useState } from 'react';
import { useNavigate } from "react-router-dom";
import './Registration.css';


export default function Registration() {
  const [showRequirements, setShowRequirements] = useState(false);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
    username: "",
    firstName: "",
    lastName: ""
  });

  const [error,setError] = useState("");
  const [loading, setLoading] = useState(false);

  function handleChange(event){
    const name = event.target.name;
    const value = event.target.value;


    setFormData((prevData) => ({
      ...prevData,
      [name]: value
    }));

  }
  function isPasswordValid(password) {
    const hasValidLength = password.length >= 8 && password.length <= 12;
    const hasSpecialCharacter = /[^A-Za-z0-9]/.test(password);
    const hasUppercase = /[A-Z]/.test(password);
    const hasLowercase = /[a-z]/.test(password);

    return (
      hasValidLength &&
      hasSpecialCharacter &&
      hasUppercase &&
      hasLowercase
    );
  }

  async function handleSubmit(event){
    event.preventDefault();

    setError("");
    if(!isPasswordValid(formData.password)){
      setError("Password must be 8-12 characters and  include uppercase,lowercase, and a special Character Data.");
        return;
    }
    setLoading(true);

    try{
      const response = await fetch("/api/users/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(formData)
      });
      const data = await response.json();

      if(!response.ok){
        throw new Error(data.error || "registration failed");
      }
      console.log("Registration succesful:", data);

      navigate("/login");

    }catch (err){
      setError(err.message);

    }finally{
      setLoading(false);
    }
  }
  return (
   
    <div className="registration-page">
  
      <h1>SportsConnect</h1>
      <h2>Create Account</h2>

      {error && <p style={{color: "red"}} > {error} </p>}

      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="firstName"> First name</label>
          <input
          id="firstName"
          type="text"
          name="firstName"
          value={formData.firstName}
          onChange={handleChange}
          />
        </div>
        <div>
          <label htmlFor="lastName"> Last name</label>
          <input
          id="lastName"
          type="text"
          name="lastName"
          value={formData.lastName}
          onChange={handleChange}
          />
        </div>
        <div>
          <label htmlFor="Username"> Username</label>
          <input
          id="Username"
          type="text"
          name="username"
          value={formData.username}
          onChange={handleChange}
          />
        </div>
        <div>
          <label htmlFor="email"> Email</label>
          <input
          id="email"
          type="text"
          name="email"
          value={formData.email}
          onChange={handleChange}
          />
        </div>
        <div>
          <label htmlFor="password"> Password</label>
          <input
          id="password"
          type="password"
          name="password"
          value={formData.password}
          onChange={handleChange}
          />
            <p className="password-help">
          Password must be 8-12 characters and include uppercase, lowercase, and a special character.
          </p>
        </div>

        <button type="submit" disabled={loading}>
          {loading ? "Creating account(yay)" : "Register"}
        </button>

      </form>
      
    </div>

  );
}