// src/App.jsx
import { useState } from 'react';
import Header from './shared/Header';
import TodosPage from './features/Todos/TodosPage';
import Logon from './features/Todos/Logon'; // Points to its current home in your file tree
import './App.css';

function App() {
  // Define our top-level authentication states
  const [email, setEmail] = useState('');
  const [token, setToken] = useState('');

  return (
    <div>
      {/* 1. Header always renders at the top of the app */}
      <Header />
      
      {/* 2. Conditional Rendering block */}
      {token ? (
        // If a secure token exists, display the interactive todos workspace
        // We pass the token down as a prop so TodosPage can authorize database API requests
        <TodosPage token={token} />
      ) : (
        // If no token exists, lock the view down and display the login form
        // We pass the state setter functions so Logon can lift up the token on success
        <Logon onSetEmail={setEmail} onSetToken={setToken} />
      )}
    </div>
  );
}

export default App;