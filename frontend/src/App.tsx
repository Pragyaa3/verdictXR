import React, { useState } from 'react';
import { useInternetIdentity } from './hooks/useAuth';
import Dashboard from './components/Dashboard';
import CourtroomVR from './components/CourtroomVR';


const lightTheme = {
  background: 'linear-gradient(135deg, #f5efe6 0%, #fffbe6 100%)',
  minHeight: '100vh',
  fontFamily: 'serif',
  color: '#3e2723',
  display: 'flex',
  flexDirection: 'column' as const,
  alignItems: 'center' as const,
  justifyContent: 'center' as const,
  padding: '0',
};

const cardStyle = {
  background: '#fff',
  borderRadius: 18,
  boxShadow: '0 4px 24px rgba(191,161,74,0.10)',
  padding: '64px 48px',
  minWidth: '440px',
  maxWidth: '600px',
  textAlign: 'center' as const,
  border: '2px solid #bfa14a',
};

const titleStyle = {
  fontFamily: 'serif',
  fontWeight: 800,
  fontSize: 44,
  color: '#bfa14a',
  marginBottom: 18,
  letterSpacing: 2,
  textShadow: '0 2px 8px #fffbe6',
};

const buttonStyle = {
  background: '#bfa14a',
  color: '#fff',
  border: 'none',
  borderRadius: 8,
  padding: '14px 32px',
  fontWeight: 700,
  fontSize: 20,
  cursor: 'pointer',
  marginTop: 18,
  boxShadow: '0 2px 8px rgba(191,161,74,0.12)',
  transition: 'background 0.2s',
};

const App: React.FC = () => {
  const { principal, isAuthenticated, login, logout } = useInternetIdentity();
  const [role, setRole] = useState<string | null>(null);
  const [trialId, setTrialId] = useState<bigint | null>(null);

  // Handler to be called when user selects role and joins/creates a trial
  const handleDashboardComplete = (selectedRole: string, joinedTrialId: bigint) => {
    setRole(selectedRole);
    setTrialId(joinedTrialId);
  };

  return (
  <div style={lightTheme}>
      <div style={cardStyle}>
        <div style={titleStyle}>VerdictXR</div>
        {!isAuthenticated ? (
          <>
            <div style={{ fontSize: 20, marginBottom: 12, color: '#6d4c41' }}>
              Welcome to the next-gen virtual courtroom experience.
            </div>
            <button style={buttonStyle} onClick={login}>Connect to Internet Identity</button>
          </>
        ) : (
          <>
            <div style={{ marginBottom: 16, fontSize: 18 }}>
              <strong>Principal:</strong> {principal}
            </div>
            <button style={{ ...buttonStyle, background: '#fffbe6', color: '#bfa14a', border: '1px solid #bfa14a' }} onClick={logout}>Logout</button>
            {/* Show Dashboard until role and trial are set */}
            {(!role || !trialId) ? (
              <Dashboard principal={principal!} onComplete={handleDashboardComplete} />
            ) : (
              <CourtroomVR participants={[]} evidence={[]} />
            )}
          </>
        )}
      </div>
      {/* About Section */}
      <div style={{
        position: 'fixed',
        left: 0,
        bottom: 0,
        width: '100%',
        padding: '12px 0',
        background: 'linear-gradient(90deg, #fffbe6 0%, #f5efe6 100%)',
        textAlign: 'center' as const,
        color: '#6d4c41',
        fontSize: 15,
        borderTop: '1px solid #bfa14a',
        boxShadow: '0 -2px 12px rgba(191,161,74,0.06)',
        zIndex: 100
      }}>
        <h2 style={{ color: '#bfa14a', fontWeight: 700, fontSize: 20, marginBottom: 6 }}>About VerdictXR</h2>
        <div style={{ maxWidth: 500, margin: '0 auto', lineHeight: 1.4 }}>
          VerdictXR is a next-generation virtual courtroom platform for immersive, secure, and collaborative legal proceedings.<br />
          <strong>Features:</strong> Secure login, 3D courtroom, evidence sharing, chat, and AI verdicts.<br />
          <span style={{ color: '#bfa14a', fontWeight: 600 }}>Experience the future of justice.</span>
        </div>
      </div>
    </div>
  );
};

export default App;