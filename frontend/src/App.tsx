import React from 'react';
import { useInternetIdentity } from './hooks/useAuth';
import Dashboard from './components/Dashboard';
import CourtroomVR from './components/CourtroomVR';

const App: React.FC = () => {
  const { principal, isAuthenticated, login, logout } = useInternetIdentity();

  return (
    <div style={{ padding: 24 }}>
      <h1>VerdictVR Courtroom</h1>
      {!isAuthenticated ? (
        <button onClick={login}>Login with Internet Identity</button>
      ) : (
        <>
          <div style={{ marginBottom: 16 }}>
            <strong>Principal:</strong> {principal}
          </div>
          <button onClick={logout}>Logout</button>
          <CourtroomVR />
          <Dashboard principal={principal!} />
        </>
      )}
    </div>
  );
};

export default App; 