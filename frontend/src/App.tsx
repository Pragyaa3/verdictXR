import React, { useState } from 'react';
import { useInternetIdentity } from './hooks/useAuth';
import Dashboard from './components/Dashboard';
import CourtroomVR from './components/CourtroomVR';

const App: React.FC = () => {
  const { principal, isAuthenticated, login, logout } = useInternetIdentity();
  const [role, setRole] = useState<string | null>(null);
  const [trialId, setTrialId] = useState<string | null>(null);

  // Handler to be called when user selects role and joins/creates a trial
  const handleDashboardComplete = (selectedRole: string, joinedTrialId: string) => {
    setRole(selectedRole);
    setTrialId(joinedTrialId);
  };

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
          {/* Show Dashboard until role and trial are set */}
          {(!role || !trialId) ? (
            <Dashboard principal={principal!} onComplete={handleDashboardComplete} />
          ) : (
            <CourtroomVR participants={[]} evidence={[]} />
          )}
        </>
      )}
    </div>
  );
};

export default App; 