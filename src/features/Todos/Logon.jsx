// src/features/Logon.jsx
import { useState } from 'react';

// Destructuring props passed down from App.jsx
function Logon({ onSetEmail, onSetToken }) {
  // Controlled form inputs for email and password
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  
  // UI feedback states
  const [authError, setAuthError] = useState('');
  const [isLoggingOn, setIsLoggingOn] = useState(false);

  // Form submission handler
  const handleSubmit = async (event) => {
    event.preventDefault(); // Stop page from refreshing
    setAuthError(''); // Clear old errors
    setIsLoggingOn(true); // Turn on loading state ("Pessimistic" UI starts)

    try {
      // Fetching from our local proxy route
      const response = await fetch('/api/users/logon', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include', // Ensures cookies are tracked correctly
        body: JSON.stringify({ email, password })
      });

      const data = await response.json();

      // Check for a completely successful login response
      if (response.status === 200 && data.name && data.csrfToken) {
        // Update parent state in App.jsx to lift the login screen
        onSetEmail(data.name);
        onSetToken(data.csrfToken);
      } else {
        // Handle explicit server rejection messages
        setAuthError(`Authentication failed: ${data?.message || 'Invalid credentials'}`);
      }
    } catch (error) {
      // Handle actual network disconnects or syntax breaking
      setAuthError(`Error: ${error.name} | ${error.message}`);
    } finally {
      // Always turn off the loading animation when the network request ends
      setIsLoggingOn(false);
    }
  };

  return (
    <div className="login-container">
      <h2>Log In to Your Account</h2>

      {/* Conditionally display an error block if authError has text */}
      {authError && <div style={{ color: 'red', marginBottom: '10px' }}>{authError}</div>}

      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="loginEmail">Email Address:</label>
          <input
            type="email"
            id="loginEmail"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        <div style={{ marginTop: '10px' }}>
          <label htmlFor="loginPassword">Password:</label>
          <input
            type="password"
            id="loginPassword"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        <button 
          type="submit" 
          disabled={isLoggingOn} 
          style={{ marginTop: '15px' }}
        >
          {isLoggingOn ? 'Logging in...' : 'Log On'}
        </button>
      </form>
    </div>
  );
}

export default Logon;