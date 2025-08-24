import React, { useState, useEffect } from 'react';
import { courtBackend } from '../api/canister';
import { Principal } from '@dfinity/principal';
import CourtroomVR from './CourtroomVR';
import { Participant, Evidence3D } from '../three/CourtroomScene';

interface Evidence {
  id: bigint;
  uploader: Principal;
  url: string;
  description: string;
  timestamp: bigint;
}

interface Trial {
  id: bigint;
  judge: Principal;
  plaintiff: Principal;
  defendant: Principal;
  observers: Principal[];
  evidence: { url: string; description: string; uploader: Principal }[];
  aiVerdict?: string | null;
  verdict?: string | null;
  status?: string;
}

interface DashboardProps {
  principal: string;
  onComplete: (role: string, trialId: bigint) => void;
}

const roles = [
  'Judge',
  'Plaintiff',
  'Defendant',
  'Observer'
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

const roleToVariant = (uiRole: string) => {
  switch (uiRole) {
    case 'AI Judge': return { AIJudge: null };
    case 'AI Lawyer': return { AILawyer: null };
    case 'Judge': return { Judge: null };
    case 'Plaintiff': return { Plaintiff: null };
    case 'Defendant': return { Defendant: null };
    case 'Observer': return { Observer: null };
    default: return { Observer: null };
  }
};

const Dashboard: React.FC<DashboardProps> = ({ principal, onComplete }) => {
  const [selectedRole, setSelectedRole] = useState<string>('');
  const [trialIdInput, setTrialIdInput] = useState<string>('');
  const [inviteCode, setInviteCode] = useState<string>('');  // ✅ new
  const [myInviteCode, setMyInviteCode] = useState<string>('');  // ✅ generated when you create trial
  const [joinedTrial, setJoinedTrial] = useState<boolean>(false);
  const [evidence, setEvidence] = useState<string>('');
  const [evidenceUrl, setEvidenceUrl] = useState('');
  const [evidenceDesc, setEvidenceDesc] = useState('');
  const [chat, setChat] = useState<string>('');
  const [log, setLog] = useState<string[]>([]);
  const [aiResponse, setAIResponse] = useState<string>('');
  const [currentTrialId, setCurrentTrialId] = useState<bigint | null>(null);
  const [loading, setLoading] = useState<string>('');
  const [error, setError] = useState<string>('');
  const [success, setSuccess] = useState<string>('');
  const [trialData, setTrialData] = useState<Trial | null>(null);

  // Fetch trial data when joinedTrial or currentTrialId changes
  useEffect(() => {
    if (joinedTrial && currentTrialId) {
      courtBackend.getTrial(currentTrialId)
        .then((t) => {
          if (t) setTrialData(t as Trial); // ✅ assert type here
          else setError('Trial not found');
        })
        .catch(e => setError('Failed to fetch trial'));
    }
  }, [joinedTrial, currentTrialId]);


  // Only allow trial actions after role is selected
  const canProceed = !!selectedRole;

  const handleCreateTrial = async () => {
    if (!selectedRole) return;
    setLoading('Creating trial...');
    setError(''); setSuccess('');
    try {
      const principalObj = Principal.fromText(principal);
      const trialId: bigint = await courtBackend.createTrial(principalObj, selectedRole);
      setCurrentTrialId(trialId);
      setJoinedTrial(true);
      setLog([...log, `Trial created! ID: ${trialId}`]);
      setSuccess(`Trial created successfully! ID: ${trialId.toString()}`);
      onComplete(selectedRole, trialId);

      // Generate invite code
      const code = await courtBackend.generateInviteCode(trialId);
      setMyInviteCode(code);
      setLog([...log, `Invite code generated: ${code}`]);
    } catch (e) {
      setError('Error creating trial: ' + (e instanceof Error ? e.message : JSON.stringify(e)));
    } finally {
      setLoading('');
    }
  };

  const handleJoinWithCode = async () => {
    setLoading('Joining with invite code...');
    setError('');
    setSuccess('');

    try {
      const principalObj = Principal.fromText(principal);

      // ✅ Pass principal and role
      const ok = await courtBackend.joinTrialWithCode(inviteCode, principalObj, selectedRole);

      if (ok) {
        setJoinedTrial(true);
        setSuccess('Joined trial with invite code!');
        setLog((l) => [...l, `Joined with invite code: ${inviteCode}`]);

        // 🔧 Now fetch trialId linked to this invite code
        if (courtBackend.getTrialFromCode) {
          const trial = (await courtBackend.getTrialFromCode(inviteCode)) as Trial;
          if (trial) {
            setCurrentTrialId(trial.id);
            onComplete(selectedRole, trial.id);
          }

        }


      } else {
        setError('Invalid invite code');
      }

    } catch (e) {
      setError('Error joining with invite code');
    } finally {
      setLoading('');
    }
  };

  const handleJoinTrial = async () => {
    setLoading('Joining trial...');
    setError(''); setSuccess('');
    try {
      const idToJoin = BigInt(trialIdInput);
      const valid = await courtBackend.getTrial(idToJoin);
      if (!valid) {
        setError('Trial ID not found!');
        return;
      }
      await courtBackend.joinTrial(idToJoin, Principal.fromText(principal), selectedRole);
      setCurrentTrialId(idToJoin);
      setJoinedTrial(true);
      setLog([...log, `Joined trial ${idToJoin}`]);
      setSuccess('Joined trial successfully!');
      onComplete(selectedRole, idToJoin);
    } catch (e) {
      setError('Error joining trial');
    } finally {
      setLoading('');
    }
  };

  const handleUploadEvidence = async () => {
    setLoading('Uploading evidence...'); setError(''); setSuccess('');
    try {
      const principalObj = Principal.fromText(principal);

      // ✅ Pass uploader as Principal
      await courtBackend.submitEvidence(currentTrialId!, evidenceUrl, evidenceDesc, principalObj);
      setLog((l) => [...l, `Evidence uploaded: ${evidenceDesc} (${evidenceUrl})`]);
      setEvidenceUrl(''); setEvidenceDesc('');
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
      await courtBackend.postMessage(currentTrialId!, roleToVariant(selectedRole), chat);
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
      const trial = await courtBackend.getTrial(currentTrialId!);
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
      // Store on-chain (assuming setAIVerdict takes a bigint)
      await courtBackend.setAIVerdict(currentTrialId!, data.verdict);
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

    trialData.observers.forEach((obs) => {
      participants.push({ role: 'Observer', principal: obs.toString(), displayName: 'Observer' });
    });

    if (trialData.aiVerdict) {
      participants.push({ role: 'AI Judge', principal: 'AI', displayName: 'AI Judge' });
    }
  }


  // Prepare evidence for VR scene
  let evidence3d: Evidence3D[] = [];
  if (trialData && trialData.evidence) {
    evidence3d = trialData.evidence.map((ev) => ({
      url: ev.url,
      description: ev.description,
      uploader: ev.uploader.toString(),
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
                placeholder="Enter Trial ID"
                value={trialIdInput}
                onChange={e => setTrialIdInput(e.target.value)}
                disabled={!!loading}
              />
              <button style={styles.button} onClick={handleJoinTrial} disabled={!!loading || !trialIdInput}>Join Trial</button>
            </div>

            <div style={{ margin: '18px 0' }}>
              <input
                style={styles.input}
                type="text"
                placeholder="Enter Invite Code"
                value={inviteCode}
                onChange={e => setInviteCode(e.target.value)}
                disabled={!!loading}
              />
              <button style={styles.button} onClick={handleJoinWithCode} disabled={!!loading || !inviteCode}>
                Join with Code
              </button>
            </div>
          </div>
        )}

        {myInviteCode && (
          <div style={styles.summary}>
            <div><span style={styles.label}>Invite Code:</span> {myInviteCode}</div>
            <div style={{ fontSize: 14, color: '#fff' }}>Share this with others to let them join.</div>
          </div>
        )}

        {/* Show trial info and actions if joined */}
        {joinedTrial && (
          <>
            <div style={styles.summary}>
              <div><span style={styles.label}>Current Trial ID:</span> {currentTrialId?.toString()}</div>
              <div><span style={styles.label}>Your Principal:</span> {principal}</div>
              <div><span style={styles.label}>Role:</span> {selectedRole}</div>
              <div><span style={styles.label}>Status:</span> <span style={{ color: '#fff' }}>Active</span></div>
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
                placeholder="Evidence URL"
                value={evidenceUrl}
                onChange={e => setEvidenceUrl(e.target.value)}
                disabled={!!loading}
              />
              <input
                style={styles.input}
                type="text"
                placeholder="Short description"
                value={evidenceDesc}
                onChange={e => setEvidenceDesc(e.target.value)}
                disabled={!!loading}
              />
              <button style={styles.button}
                onClick={handleUploadEvidence}
                disabled={!!loading || !evidenceUrl || !evidenceDesc}>
                Upload
              </button>
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
              <ul style={{ margin: '8px 0 0 0', padding: 0, listStyle: 'none' }}>
                {log.map((entry, i) => <li key={i} style={{ marginBottom: 4 }}>{entry}</li>)}
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