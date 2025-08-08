import React, { useState, useEffect } from 'react';
import { courtBackend } from '../api/canister';
import { Principal } from '@dfinity/principal';
import CourtroomVR from './CourtroomVR';
import { Participant, Evidence3D } from '../three/CourtroomScene';

interface DashboardProps {
  principal: string;
  onComplete: (role: string, trialId: string) => void;
}

const roles = [
  'Judge',
  'Plaintiff',
  'Defendant',
  'Observer',
  'AI Judge',
  'AI Lawyer',
];

const styles = {
  container: {
    background: '#f5efe6', // Cream/parchment
    minHeight: '100vh',
    fontFamily: 'serif',
    padding: '32px 0',
    color: '#3e2723', // Deep brown
  } as React.CSSProperties,
  card: {
    background: '#6d4c41', // Wood tone
    borderRadius: 12,
    boxShadow: '0 2px 8px rgba(62,39,35,0.08)',
    padding: 24,
    margin: '24px auto',
    maxWidth: 500,
    color: '#fff',
    border: '2px solid #bfa14a', // Gold accent
  } as React.CSSProperties,
  heading: {
    fontFamily: 'serif',
    fontWeight: 700,
    fontSize: 28,
    color: '#bfa14a', // Gold
    marginBottom: 12,
    letterSpacing: 1,
  } as React.CSSProperties,
  section: {
    marginBottom: 24,
    paddingBottom: 16,
    borderBottom: '1px solid #bfa14a',
  } as React.CSSProperties,
  label: {
    fontWeight: 600,
    color: '#bfa14a',
    marginRight: 8,
  } as React.CSSProperties,
  input: {
    borderRadius: 6,
    border: '1px solid #bfa14a',
    padding: '8px 12px',
    marginRight: 8,
    fontSize: 16,
    background: '#f5efe6',
    color: '#3e2723',
  } as React.CSSProperties,
  button: {
    background: '#bfa14a',
    color: '#fff',
    border: 'none',
    borderRadius: 6,
    padding: '8px 18px',
    fontWeight: 700,
    fontSize: 16,
    cursor: 'pointer',
    marginLeft: 4,
    boxShadow: '0 1px 4px rgba(191,161,74,0.12)',
    transition: 'background 0.2s',
  } as React.CSSProperties,
  log: {
    background: '#f5efe6',
    color: '#3e2723',
    borderRadius: 8,
    padding: 12,
    minHeight: 80,
    marginTop: 8,
    fontSize: 15,
  } as React.CSSProperties,
  aiVerdict: {
    background: '#fffbe6',
    color: '#6d4c41',
    border: '1px solid #bfa14a',
    borderRadius: 8,
    padding: 12,
    marginTop: 12,
    fontWeight: 600,
    fontSize: 17,
  } as React.CSSProperties,
  summary: {
    background: '#bfa14a',
    color: '#fff',
    borderRadius: 10,
    padding: 16,
    marginBottom: 24,
    boxShadow: '0 1px 6px rgba(191,161,74,0.10)',
    fontSize: 17,
  } as React.CSSProperties,
  error: {
    color: '#d32f2f',
    fontWeight: 600,
    marginTop: 8,
  } as React.CSSProperties,
  success: {
    color: '#388e3c',
    fontWeight: 600,
    marginTop: 8,
  } as React.CSSProperties,
};

const Dashboard: React.FC<DashboardProps> = ({ principal, onComplete }) => {
  const [selectedRole, setSelectedRole] = useState<string>('');
  const [trialId, setTrialId] = useState<string>('');
  const [joinedTrial, setJoinedTrial] = useState<boolean>(false);
  const [evidence, setEvidence] = useState<string>('');
  const [chat, setChat] = useState<string>('');
  const [log, setLog] = useState<string[]>([]);
  const [aiResponse, setAIResponse] = useState<string>('');
  const [currentTrialId, setCurrentTrialId] = useState<string>('');
  const [loading, setLoading] = useState<string>('');
  const [error, setError] = useState<string>('');
  const [success, setSuccess] = useState<string>('');
  const [trialData, setTrialData] = useState<any>(null);

  // Fetch trial data when joinedTrial or currentTrialId changes
  useEffect(() => {
    if (joinedTrial && currentTrialId) {
      courtBackend.getTrial(Number(currentTrialId)).then(setTrialData);
    }
  }, [joinedTrial, currentTrialId]);

  // Only allow trial actions after role is selected
  const canProceed = !!selectedRole;

  const handleCreateTrial = async () => {
    setLoading('Creating trial...'); setError(''); setSuccess('');
    try {
      const principalObj = Principal.fromText(principal);
      const id = await courtBackend.createTrial(principalObj, principalObj);
      setCurrentTrialId((id as number).toString());
      setJoinedTrial(true);
      setLog((l) => [...l, `Trial created! ID: ${id}`]);
      setSuccess('Trial created successfully!');
      onComplete(selectedRole, (id as number).toString());
    } catch (e) {
      setError('Error creating trial: ' + (e instanceof Error ? e.message : JSON.stringify(e)));
    } finally {
      setLoading('');
    }
  };
  const handleJoinTrial = async () => {
    setLoading('Joining trial...'); setError(''); setSuccess('');
    try {
      await courtBackend.joinTrial(Number(trialId));
      setCurrentTrialId(trialId);
      setJoinedTrial(true);
      setLog((l) => [...l, `Joined trial ${trialId}`]);
      setSuccess('Joined trial successfully!');
      onComplete(selectedRole, trialId);
    } catch (e) {
      setError('Error joining trial');
    } finally {
      setLoading('');
    }
  };
  const handleUploadEvidence = async () => {
    setLoading('Uploading evidence...'); setError(''); setSuccess('');
    try {
      await courtBackend.submitEvidence(Number(currentTrialId), evidence, '');
      setLog((l) => [...l, `Evidence uploaded: ${evidence}`]);
      setEvidence('');
      setSuccess('Evidence uploaded!');
    } catch (e) {
      setError('Error uploading evidence');
    } finally {
      setLoading('');
    }
  };
  const handleSendChat = async () => {
    setLoading('Sending message...'); setError(''); setSuccess('');
    try {
      await courtBackend.postMessage(Number(currentTrialId), { 'Plaintiff': null }, chat);
      setLog((l) => [...l, `You: ${chat}`]);
      setChat('');
      setSuccess('Message sent!');
    } catch (e) {
      setError('Error sending chat');
    } finally {
      setLoading('');
    }
  };
  const handleAIJudge = async () => {
    setLoading('Requesting AI verdict...'); setError(''); setSuccess('');
    try {
      setLog((l) => [...l, 'Requesting AI verdict...']);
      // Fetch trial data from backend
      const trial = await courtBackend.getTrial(Number(currentTrialId));
      // Custom replacer to handle BigInt
      const replacer = (key: string, value: unknown) => typeof value === 'bigint' ? value.toString() : value;
      // Call local AI judge service
      const response = await fetch('http://localhost:5000/ai-judge', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ trial }, replacer),
      });
      const data = await response.json();
      setAIResponse(data.verdict);
      setLog((l) => [...l, 'AI Judge: ' + data.verdict]);
      setSuccess('AI verdict received!');
      // Store on-chain
      await courtBackend.setAIVerdict(Number(currentTrialId), data.verdict);
    } catch (e) {
      setError('Error with AI judge: ' + (e instanceof Error ? e.message : JSON.stringify(e)));
    } finally {
      setLoading('');
    }
  };

  // Prepare participants for VR scene
  let participants: Participant[] = [];
  if (trialData) {
    participants.push({ role: 'Judge', principal: trialData.judge.toString(), displayName: 'Judge' });
    participants.push({ role: 'Plaintiff', principal: trialData.plaintiff.toString(), displayName: 'Plaintiff' });
    participants.push({ role: 'Defendant', principal: trialData.defendant.toString(), displayName: 'Defendant' });
    if (trialData.observers) {
      for (const obs of trialData.observers) {
        participants.push({ role: 'Observer', principal: obs.toString(), displayName: 'Observer' });
      }
    }
    // Optionally add AI roles if present
    if (trialData.aiVerdict) {
      participants.push({ role: 'AI Judge', principal: 'AI', displayName: 'AI Judge' });
    }
  }

  // Prepare evidence for VR scene
  let evidence3d: Evidence3D[] = [];
  if (trialData && trialData.evidence) {
    evidence3d = trialData.evidence.map((ev: any) => ({
      url: ev.url,
      description: ev.description,
      uploader: ev.uploader?.toString?.() || 'Unknown',
    }));
  }

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <div style={styles.heading}>Dashboard</div>
        {/* Role selection */}
        <div style={{ ...styles.section, borderBottom: 'none', marginBottom: 8 }}>
          <div style={styles.label}>Select your role:</div>
          <select
            style={{ ...styles.input, minWidth: 160 }}
            value={selectedRole}
            onChange={e => setSelectedRole(e.target.value)}
            disabled={!!loading}
          >
            <option value="">-- Choose Role --</option>
            {roles.map(role => (
              <option key={role} value={role}>{role}</option>
            ))}
          </select>
        </div>
        {/* Only show trial actions if role is selected and not yet joined */}
        {canProceed && !joinedTrial && (
          <div style={styles.section}>
            <button style={styles.button} onClick={handleCreateTrial} disabled={!!loading}>Create Trial</button>
            <div style={{ margin: '18px 0' }}>
              <input
                style={styles.input}
                type="text"
                placeholder="Enter Trial ID to join"
                value={trialId}
                onChange={e => setTrialId(e.target.value)}
                disabled={!!loading}
              />
              <button style={styles.button} onClick={handleJoinTrial} disabled={!!loading || !trialId}>Join Trial</button>
            </div>
          </div>
        )}
        {/* Show trial info and actions if joined */}
        {joinedTrial && (
          <>
            <div style={styles.summary}>
              <div><span style={styles.label}>Current Trial ID:</span> {currentTrialId}</div>
              <div><span style={styles.label}>Your Principal:</span> {principal}</div>
              <div><span style={styles.label}>Role:</span> {selectedRole}</div>
              <div><span style={styles.label}>Status:</span> <span style={{color:'#fff'}}>Active</span></div>
            </div>
            {/* Add VR Courtroom */}
            <div style={{ margin: '32px 0' }}>
              <CourtroomVR participants={participants} evidence={evidence3d} />
            </div>
            <div style={styles.section}>
              <div style={styles.label}>Evidence</div>
              <input
                style={styles.input}
                type="text"
                placeholder="Evidence URL/desc"
                value={evidence}
                onChange={e => setEvidence(e.target.value)}
                disabled={!!loading}
              />
              <button style={styles.button} onClick={handleUploadEvidence} disabled={!!loading || !evidence}>Upload</button>
            </div>
            <div style={styles.section}>
              <div style={styles.label}>Chat</div>
              <input
                style={styles.input}
                type="text"
                placeholder="Chat with judge/lawyer..."
                value={chat}
                onChange={e => setChat(e.target.value)}
                disabled={!!loading}
              />
              <button style={styles.button} onClick={handleSendChat} disabled={!!loading || !chat}>Send</button>
            </div>
            <div style={styles.section}>
              <button style={styles.button} onClick={handleAIJudge} disabled={!!loading}>Ask AI Judge for Verdict</button>
            </div>
            <div style={styles.log}>
              <strong>Trial Log:</strong>
              <ul style={{margin: '8px 0 0 0', padding: 0, listStyle: 'none'}}>
                {log.map((entry, i) => <li key={i} style={{marginBottom: 4}}>{entry}</li>)}
              </ul>
            </div>
            {aiResponse && (
              <div style={styles.aiVerdict}>
                <strong>AI Verdict:</strong> {aiResponse}
              </div>
            )}
          </>
        )}
        {loading && <div style={styles.label}>{loading}</div>}
        {error && <div style={styles.error}>{error}</div>}
        {success && <div style={styles.success}>{success}</div>}
      </div>
    </div>
  );
};

export default Dashboard; 