import React, { useState } from 'react';
import { courtBackend } from '../api/canister';

interface DashboardProps {
  principal: string;
}

const Dashboard: React.FC<DashboardProps> = ({ principal }) => {
  const [trialId, setTrialId] = useState<string>('');
  const [joinedTrial, setJoinedTrial] = useState<boolean>(false);
  const [evidence, setEvidence] = useState<string>('');
  const [chat, setChat] = useState<string>('');
  const [log, setLog] = useState<string[]>([]);
  const [aiResponse, setAIResponse] = useState<string>('');
  const [currentTrialId, setCurrentTrialId] = useState<string>('');

  // For MVP, use principal as both plaintiff and defendant for trial creation
  const handleCreateTrial = async () => {
    try {
      const id = await courtBackend.createTrial(principal, principal);
      setCurrentTrialId(id.toString());
      setJoinedTrial(true);
      setLog((l) => [...l, `Trial created! ID: ${id}`]);
    } catch (e) {
      setLog((l) => [...l, 'Error creating trial']);
    }
  };
  const handleJoinTrial = async () => {
    try {
      await courtBackend.joinTrial(Number(trialId));
      setCurrentTrialId(trialId);
      setJoinedTrial(true);
      setLog((l) => [...l, `Joined trial ${trialId}`]);
    } catch (e) {
      setLog((l) => [...l, 'Error joining trial']);
    }
  };
  const handleUploadEvidence = async () => {
    try {
      await courtBackend.submitEvidence(Number(currentTrialId), evidence, '');
      setLog((l) => [...l, `Evidence uploaded: ${evidence}`]);
      setEvidence('');
    } catch (e) {
      setLog((l) => [...l, 'Error uploading evidence']);
    }
  };
  const handleSendChat = async () => {
    try {
      await courtBackend.postMessage(Number(currentTrialId), { 'Plaintiff': null }, chat);
      setLog((l) => [...l, `You: ${chat}`]);
      setChat('');
    } catch (e) {
      setLog((l) => [...l, 'Error sending chat']);
    }
  };
  const handleAIJudge = async () => {
    try {
      await courtBackend.setAIVerdict(Number(currentTrialId), 'Sample AI verdict and reasoning.');
      setAIResponse('AI Judge: Sample AI verdict and reasoning.');
      setLog((l) => [...l, 'AI Judge: Sample AI verdict and reasoning.']);
    } catch (e) {
      setLog((l) => [...l, 'Error with AI judge']);
    }
  };

  return (
    <div style={{ marginTop: 24 }}>
      <h2>Dashboard</h2>
      {!joinedTrial ? (
        <div>
          <button onClick={handleCreateTrial}>Create Trial</button>
          <div style={{ margin: '12px 0' }}>
            <input
              type="text"
              placeholder="Enter Trial ID to join"
              value={trialId}
              onChange={e => setTrialId(e.target.value)}
            />
            <button onClick={handleJoinTrial}>Join Trial</button>
          </div>
        </div>
      ) : (
        <>
          <div style={{ margin: '12px 0' }}>
            <input
              type="text"
              placeholder="Evidence URL/desc"
              value={evidence}
              onChange={e => setEvidence(e.target.value)}
            />
            <button onClick={handleUploadEvidence}>Upload Evidence</button>
          </div>
          <div style={{ margin: '12px 0' }}>
            <input
              type="text"
              placeholder="Chat with judge/lawyer..."
              value={chat}
              onChange={e => setChat(e.target.value)}
            />
            <button onClick={handleSendChat}>Send</button>
          </div>
          <div style={{ margin: '12px 0' }}>
            <button onClick={handleAIJudge}>Ask AI Judge for Verdict</button>
          </div>
          <div style={{ background: '#f8f8f8', padding: 12, minHeight: 80 }}>
            <strong>Trial Log:</strong>
            <ul>
              {log.map((entry, i) => <li key={i}>{entry}</li>)}
            </ul>
          </div>
          {aiResponse && (
            <div style={{ background: '#e0ffe0', padding: 12, marginTop: 8 }}>
              <strong>{aiResponse}</strong>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default Dashboard; 