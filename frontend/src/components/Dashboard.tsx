//frontend/src/components/Dashboard.tsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { courtBackend } from '../api/canister';
import { Principal } from '@dfinity/principal';
import CourtroomVR from './CourtroomVR';
import { Participant, Evidence3D } from '../three/CourtroomScene';
import { dashboardStyles as styles } from '../styles/dashboardStyles';

const keyframes = `
  * {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body, html {
  margin: 0;
  padding: 0;
  width: 100%;
}
  
  @keyframes rotate {
    from { transform: rotate(0deg); }
    to { transform: rotate(360deg); }
  }
  
  @keyframes titleShimmer {
    0%, 100% { filter: brightness(1) contrast(1); }
    50% { filter: brightness(1.2) contrast(1.1); }
  }
  
  .hover-glow:hover {
    box-shadow: 0 0 30px rgba(79, 70, 229, 0.6), 0 0 60px rgba(124, 58, 237, 0.3) !important;
    transform: translateY(-2px) scale(1.02) !important;
  }
  
  .card-hover:hover {
    transform: translateY(-5px) !important;
    box-shadow: 0 25px 50px rgba(0, 0, 0, 0.4), 0 0 30px rgba(79, 70, 229, 0.3) !important;
    border-color: rgba(79, 70, 229, 0.5) !important;
  }
`;

interface LawyerArgument {
  lawyer: string;
  argument: string;
  legalBasis: string[];
  citedCases: string[];
  timestamp: string;
}

interface LawyerDebate {
  plaintiff: LawyerArgument;
  defendant: LawyerArgument;
}

interface Evidence {
  id: bigint;
  uploader: Principal;
  url: string;
  description: string;
  timestamp: bigint;
}

interface Trial {
  id: bigint;
  judge: Principal | null;
  plaintiff: Principal | null;
  defendant: Principal | null;
  observers: Principal[];
  evidence: Evidence[];
  aiVerdict?: string | null;
  verdict?: string | null;
  status?: string;
  caseDetails?: string;
  caseTitle?: string; // NEW: Add case title
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

const Dashboard: React.FC<DashboardProps> = ({ principal, onComplete }) => {
  const [selectedRole, setSelectedRole] = useState<string>('');
  const navigate = useNavigate();
  const [trialIdInput, setTrialIdInput] = useState<string>('');
  const [inviteCode, setInviteCode] = useState<string>('');
  const [myInviteCode, setMyInviteCode] = useState<string>('');
  const [joinedTrial, setJoinedTrial] = useState<boolean>(false);

  // NEW: Case Management State
  const [caseTitle, setCaseTitle] = useState<string>('');
  const [caseDetails, setCaseDetails] = useState<string>('');

  // Evidence State
  const [evidenceUrl, setEvidenceUrl] = useState('');
  const [evidenceDesc, setEvidenceDesc] = useState('');
  const [uploadMode, setUploadMode] = useState<'url' | 'file'>('url');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [filePreview, setFilePreview] = useState<string | null>(null);
  const [uploadProgress, setUploadProgress] = useState<number>(0);

  // Chat State
  const [chat, setChat] = useState<string>('');
  const [log, setLog] = useState<string[]>([]);
  const [aiResponse, setAIResponse] = useState<string>('');

  // Trial State
  const [currentTrialId, setCurrentTrialId] = useState<bigint | null>(null);
  const [loading, setLoading] = useState<string>('');
  const [error, setError] = useState<string>('');
  const [success, setSuccess] = useState<string>('');
  const [trialData, setTrialData] = useState<Trial | null>(null);

  // Lawyer State
  const [lawyerDebate, setLawyerDebate] = useState<LawyerDebate | null>(null);
  const [selectedLawyer, setSelectedLawyer] = useState<'plaintiff' | 'defendant' | null>(null);
  const [lawyerQuestion, setLawyerQuestion] = useState<string>('');
  const [lawyerResponses, setLawyerResponses] = useState<
    { type: 'plaintiff' | 'defendant'; text: string }[]
  >([]);

  // NEW: Show VR and Controls
  const [showVR, setShowVR] = useState<boolean>(false);

   // File upload utility functions
  const getFileIcon = (fileType: string): string => {
    if (fileType.includes('image')) return '🖼️';
    if (fileType.includes('pdf')) return '📄';
    if (fileType.includes('video')) return '🎥';
    if (fileType.includes('audio')) return '🎵';
    if (fileType.includes('text')) return '📝';
    if (fileType.includes('word')) return '📃';
    if (fileType.includes('excel') || fileType.includes('sheet')) return '📊';
    return '📎';
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // File size limit (10MB)
    const maxSize = 10 * 1024 * 1024;
    if (file.size > maxSize) {
      setError('File size must be less than 10MB');
      return;
    }

    setSelectedFile(file);
    setEvidenceDesc(file.name); // Auto-populate description with filename

    // Create preview for images
    if (file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (e) => setFilePreview(e.target?.result as string);
      reader.readAsDataURL(file);
    } else {
      setFilePreview(null);
    }
  };

  const uploadFileToIPFS = async (file: File): Promise<string> => {
    // Simulate file upload - in production, implement your preferred storage solution
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = () => {
        // For demo purposes, we'll use data URL
        // In production, upload to IPFS, AWS S3, or your preferred storage
        resolve(reader.result as string);
      };
      reader.readAsDataURL(file);
    });
  };

  // Add this with your other useEffects
  useEffect(() => {
    const savedTrial = sessionStorage.getItem('verdictxr-trial-state');
    if (savedTrial) {
      try {
        const parsedTrial = JSON.parse(savedTrial);
        setCurrentTrialId(parsedTrial.trialId ? BigInt(parsedTrial.trialId) : null);
        setSelectedRole(parsedTrial.selectedRole);
        setJoinedTrial(parsedTrial.joinedTrial);

        if (parsedTrial.trialData) {
          const restoredTrialData = {
            ...parsedTrial.trialData,
            id: parsedTrial.trialData.id ? BigInt(parsedTrial.trialData.id) : null,
            evidence: parsedTrial.trialData.evidence?.map((ev: any) => ({
              ...ev,
              id: ev.id ? BigInt(ev.id) : null,
              timestamp: ev.timestamp ? BigInt(ev.timestamp) : null
            }))
          };
          setTrialData(restoredTrialData);
        }

        setCaseDetails(parsedTrial.caseDetails || '');
        setCaseTitle(parsedTrial.caseTitle || '');
        setMyInviteCode(parsedTrial.inviteCode || '');
        sessionStorage.removeItem('verdictxr-trial-state');
      } catch (e) {
        console.error('Failed to restore trial state:', e);
      }
    }
  }, []);

  // Fetch trial data when joinedTrial or currentTrialId changes
  useEffect(() => {
    if (joinedTrial && currentTrialId) {
      courtBackend.getTrial(currentTrialId)
        .then((t) => {
          if (t) {
            const trialWithDetails = t as Trial;
            setTrialData(trialWithDetails);
            // Set case details if they exist
            if (trialWithDetails.caseDetails) {
              setCaseDetails(trialWithDetails.caseDetails);
            }
            if (trialWithDetails.caseTitle) {
              setCaseTitle(trialWithDetails.caseTitle);
            }
          } else {
            setError('Trial not found');
          }
        })
        .catch(e => setError('Failed to fetch trial'));
    }
  }, [joinedTrial, currentTrialId]);

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
      setLog([...log, `✅ Trial created! ID: ${trialId}`]);
      setSuccess(`Trial created successfully! ID: ${trialId.toString()}`);
      onComplete(selectedRole, trialId);

      // Generate invite code
      const code = await courtBackend.generateInviteCode(trialId);
      if (code) {
        setMyInviteCode(code);
        setLog(prev => [...prev, `🔗 Invite code generated: ${code}`]);
      }
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
      const ok = await courtBackend.joinTrialWithCode(inviteCode, principalObj, selectedRole);

      if (ok) {
        setJoinedTrial(true);
        setSuccess('Joined trial with invite code!');
        setLog((l) => [...l, `✅ Joined with invite code: ${inviteCode}`]);

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
      setLog([...log, `✅ Joined trial ${idToJoin}`]);
      setSuccess('Joined trial successfully!');
      onComplete(selectedRole, idToJoin);
    } catch (e) {
      setError('Error joining trial');
    } finally {
      setLoading('');
    }
  };

  // NEW: Save case title
  const handleSaveCaseTitle = async () => {
    if (!currentTrialId || !caseTitle.trim()) return;
    setLoading('Saving case title...');
    try {
      await courtBackend.setCaseTitle(currentTrialId, caseTitle);
      setLog(prev => [...prev, `📝 Case title set: ${caseTitle}`]);
      setSuccess('Case title saved!');
    } catch (e) {
      setError('Error saving case title');
    } finally {
      setLoading('');
    }
  };

  // NEW: Save case details
  const handleSaveCaseDetails = async () => {
    if (!currentTrialId || !caseDetails.trim()) return;
    setLoading('Saving case details...');
    try {
      await courtBackend.setCaseDetails(currentTrialId, caseDetails);
      setLog(prev => [...prev, `📄 Case details updated`]);
      setSuccess('Case details saved!');
    } catch (e) {
      setError('Error saving case details');
    } finally {
      setLoading('');
    }
  };

  const handleStartLawyerDebate = async () => {
    if (!caseDetails.trim()) {
      setError('Please provide case details first');
      return;
    }

    setLoading('Consulting both lawyers...');
    setError(''); setSuccess('');

    try {
      const evidenceText = trialData?.evidence.map(e => `${e.description}: ${e.url}`).join('; ') || '';

      const response = await fetch('http://localhost:5001/dual-lawyers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          caseDetails,
          evidence: evidenceText,
          currentArguments: lawyerDebate
        }),
      });

      const data = await response.json();

      if (data.success) {
        setLawyerDebate(data.lawyers);
        setLog(prev => [...prev, '⚖️ Both lawyers have provided their arguments']);
        setSuccess('Dual lawyer consultation complete!');
      } else {
        setError('Failed to get lawyer consultation: ' + (data.error || 'Unknown error'));
      }
    } catch (e) {
      setError('Error consulting lawyers. Make sure the dual-lawyer service is running on port 5001: ' + (e instanceof Error ? e.message : 'Unknown error'));
    } finally {
      setLoading('');
    }
  };

  const handleConsultSingleLawyer = async () => {
    if (!selectedLawyer || !lawyerQuestion.trim()) {
      setError('Please select a lawyer and ask a question');
      return;
    }

    setLoading(`Consulting ${selectedLawyer} lawyer...`);
    setError(''); setSuccess('');

    try {
      const evidenceText = trialData?.evidence.map(e => `${e.description}: ${e.url}`).join('; ') || '';

      const response = await fetch('http://localhost:5001/consult-lawyer', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          lawyerType: selectedLawyer,
          caseDetails,
          evidence: evidenceText,
          question: lawyerQuestion
        }),
      });

      const data = await response.json();

      if (data.success) {
        setLawyerResponses(prev => [
          ...prev,
          { type: selectedLawyer, text: data.consultation.argument }
        ]);
        setLawyerQuestion('');
        setSuccess(`${selectedLawyer} lawyer consultation complete!`);
      } else {
        setError('Failed to consult lawyer: ' + (data.error || 'Unknown error'));
      }
    } catch (e) {
      setError('Error consulting lawyer. Make sure the dual-lawyer service is running: ' + (e instanceof Error ? e.message : 'Unknown error'));
    } finally {
      setLoading('');
    }
  };

  const handleEnhancedAIJudge = async () => {
    setLoading('Requesting enhanced AI verdict...');
    setError(''); setSuccess('');

    try {
      const trial = await courtBackend.getTrial(currentTrialId!);
      const trialWithDetails = { ...trial, caseDetails, caseTitle };

      const response = await fetch('http://localhost:5000/ai-judge-enhanced', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          trial: trialWithDetails,
          lawyerArguments: lawyerDebate
        }),
      });

      const data = await response.json();

      if (data.success) {
        setAIResponse(data.verdict);
        setLog(prev => [...prev, '⚖️ Enhanced AI Judge: ' + data.verdict]);
        setSuccess('Enhanced AI verdict received!');
        await courtBackend.setAIVerdict(currentTrialId!, data.verdict);
      } else {
        setError('Failed to get AI verdict: ' + (data.error || 'Unknown error'));
      }
    } catch (e) {
      setError('Error with enhanced AI judge. Make sure the ai-judge service is running on port 5000: ' + (e instanceof Error ? e.message : 'Unknown error'));
    } finally {
      setLoading('');
    }
  };

   const handleUploadEvidence = async () => {
    setLoading('Uploading evidence...'); 
    setError(''); 
    setSuccess('');
    setUploadProgress(0);

    try {
      const principalObj = Principal.fromText(principal);
      let finalUrl = evidenceUrl;

      if (uploadMode === 'file' && selectedFile) {
        setLoading('Processing file...');
        setUploadProgress(25);
        
        // Upload file and get URL
        finalUrl = await uploadFileToIPFS(selectedFile);
        setUploadProgress(75);
        
        if (!finalUrl) {
          throw new Error('Failed to upload file');
        }
      }

      if (!finalUrl || !evidenceDesc) {
        setError('Please provide both evidence source and description');
        return;
      }

      setUploadProgress(90);
      await courtBackend.submitEvidence(currentTrialId!, finalUrl, evidenceDesc, principalObj);
      
      setLog((l) => [...l, `📎 Evidence uploaded: ${evidenceDesc} ${uploadMode === 'file' ? `(${selectedFile?.name})` : `(${finalUrl})`}`]);
      
      // Reset form
      setEvidenceUrl(''); 
      setEvidenceDesc('');
      setSelectedFile(null);
      setFilePreview(null);
      setUploadProgress(100);
      
      setSuccess('Evidence uploaded successfully!');
    } catch (e) {
      setError('Error uploading evidence: ' + (e instanceof Error ? e.message : 'Unknown error'));
    } finally {
      setLoading('');
      setTimeout(() => setUploadProgress(0), 1000);
    }
  };

  const handleSendChat = async () => {
    setLoading('Sending message...'); setError(''); setSuccess('');
    try {
      await courtBackend.postMessage(currentTrialId!, selectedRole, chat);
      setLog((l) => [...l, `💬 You: ${chat}`]);
      setChat('');
      setSuccess('Message sent!');
    } catch (e) {
      setError('Error sending chat');
    } finally {
      setLoading('');
    }
  };

  // Prepare participants for VR scene
  let participants: Participant[] = [];
  if (trialData) {
    if (trialData.judge) participants.push({ role: 'Judge', principal: trialData.judge.toString(), displayName: 'Judge' });
    if (trialData.plaintiff) participants.push({ role: 'Plaintiff', principal: trialData.plaintiff.toString(), displayName: 'Plaintiff' });
    if (trialData.defendant) participants.push({ role: 'Defendant', principal: trialData.defendant.toString(), displayName: 'Defendant' });

    trialData.observers.forEach((obs) => {
      participants.push({ role: 'Observer', principal: obs.toString(), displayName: 'Observer' });
    });
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

  // Enhanced Evidence Upload Component
  const EvidenceUploadSection = () => (
    <div style={{ marginTop: '20px' }}>
      <h4 style={{ marginBottom: '15px', color: '#ffffff' }}>📎 Submit Evidence</h4>
      
      {/* Upload Mode Toggle */}
      <div style={{ 
        display: 'flex', 
        marginBottom: '15px',
        background: 'rgba(255,255,255,0.1)',
        borderRadius: '8px',
        padding: '4px'
      }}>
        <button
          style={{
            flex: 1,
            padding: '8px 16px',
            border: 'none',
            borderRadius: '6px',
            background: uploadMode === 'url' ? 'rgba(79, 70, 229, 0.8)' : 'transparent',
            color: '#ffffff',
            cursor: 'pointer',
            fontSize: '14px',
            transition: 'all 0.3s ease'
          }}
          onClick={() => {
            setUploadMode('url');
            setSelectedFile(null);
            setFilePreview(null);
          }}
        >
          🔗 URL
        </button>
        <button
          style={{
            flex: 1,
            padding: '8px 16px',
            border: 'none',
            borderRadius: '6px',
            background: uploadMode === 'file' ? 'rgba(79, 70, 229, 0.8)' : 'transparent',
            color: '#ffffff',
            cursor: 'pointer',
            fontSize: '14px',
            transition: 'all 0.3s ease'
          }}
          onClick={() => {
            setUploadMode('file');
            setEvidenceUrl('');
          }}
        >
          📁 File Upload
        </button>
      </div>

      {/* URL Mode */}
      {uploadMode === 'url' && (
        <input
          style={styles.input}
          type="text"
          placeholder="Evidence URL"
          value={evidenceUrl}
          onChange={e => setEvidenceUrl(e.target.value)}
          disabled={!!loading}
        />
      )}

      {/* File Mode */}
      {uploadMode === 'file' && (
        <div style={{ marginBottom: '15px' }}>
          <div style={{
            border: '2px dashed rgba(79, 70, 229, 0.5)',
            borderRadius: '12px',
            padding: '20px',
            textAlign: 'center' as const,
            background: 'rgba(79, 70, 229, 0.05)',
            transition: 'all 0.3s ease',
            cursor: 'pointer',
            position: 'relative' as const
          }}>
            <input
              type="file"
              accept="image/*,application/pdf,.doc,.docx,.txt,.mp4,.mp3,.xlsx,.xls"
              onChange={handleFileSelect}
              disabled={!!loading}
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                opacity: 0,
                cursor: 'pointer'
              }}
            />
            
            {selectedFile ? (
              <div>
                <div style={{ fontSize: '24px', marginBottom: '8px' }}>
                  {getFileIcon(selectedFile.type)}
                </div>
                <div style={{ color: '#ffffff', fontWeight: '600', marginBottom: '4px' }}>
                  {selectedFile.name}
                </div>
                <div style={{ color: '#a1a1aa', fontSize: '12px' }}>
                  {formatFileSize(selectedFile.size)} • {selectedFile.type}
                </div>
                
                {filePreview && (
                  <img 
                    src={filePreview} 
                    alt="Preview" 
                    style={{ 
                      maxWidth: '200px', 
                      maxHeight: '150px', 
                      marginTop: '10px',
                      borderRadius: '8px',
                      objectFit: 'cover' as const
                    }} 
                  />
                )}
              </div>
            ) : (
              <div>
                <div style={{ fontSize: '24px', marginBottom: '8px' }}>📁</div>
                <div style={{ color: '#ffffff', marginBottom: '4px' }}>
                  Click to select a file
                </div>
                <div style={{ color: '#a1a1aa', fontSize: '12px' }}>
                  Images, PDFs, Documents, Videos (Max 10MB)
                </div>
              </div>
            )}
          </div>
          
          {selectedFile && (
            <button
              style={{
                marginTop: '8px',
                padding: '6px 12px',
                background: 'rgba(239, 68, 68, 0.2)',
                border: '1px solid rgba(239, 68, 68, 0.3)',
                borderRadius: '6px',
                color: '#ffffff',
                cursor: 'pointer',
                fontSize: '12px'
              }}
              onClick={() => {
                setSelectedFile(null);
                setFilePreview(null);
                setEvidenceDesc('');
              }}
            >
              🗑️ Remove File
            </button>
          )}
        </div>
      )}

      {/* Description Input */}
      <input
        style={styles.input}
        type="text"
        placeholder="Brief description of the evidence"
        value={evidenceDesc}
        onChange={e => setEvidenceDesc(e.target.value)}
        disabled={!!loading}
      />

      {/* Upload Progress */}
      {uploadProgress > 0 && uploadProgress < 100 && (
        <div style={{
          width: '100%',
          height: '4px',
          background: 'rgba(255,255,255,0.2)',
          borderRadius: '2px',
          marginBottom: '10px',
          overflow: 'hidden'
        }}>
          <div
            style={{
              width: `${uploadProgress}%`,
              height: '100%',
              background: 'linear-gradient(90deg, #4F46E5, #7C3AED)',
              transition: 'width 0.3s ease'
            }}
          />
        </div>
      )}

      {/* Upload Button */}
      <button
        style={styles.button}
        className="hover-glow"
        onClick={handleUploadEvidence}
        disabled={
          !!loading || 
          (uploadMode === 'url' && (!evidenceUrl || !evidenceDesc)) ||
          (uploadMode === 'file' && (!selectedFile || !evidenceDesc))
        }
      >
        {uploadMode === 'file' ? '📤 Upload File' : '📎 Submit URL'}
      </button>

      {/* Supported Formats Info */}
      <div style={{
        fontSize: '11px',
        color: '#a1a1aa',
        marginTop: '8px',
        textAlign: 'center' as const
      }}>
        Supported: Images (JPG, PNG, GIF), PDFs, Documents (DOC, TXT), Videos (MP4), Audio (MP3), Spreadsheets (XLSX)
      </div>
    </div>
  );

  return (
    <>
      <style>{keyframes}</style>
      <div style={styles.container}>
        <div style={styles.heroBackground}></div>
        <div style={styles.lightBeams}></div>

        {/* Enhanced Header */}
        <div style={styles.headerSection} className="card-hover">
          <h1 style={styles.mainTitle}>⚖️ VR Legal Simulator</h1>
          <p style={styles.subtitle}>Experience immersive legal education with AI-powered attorneys and judges</p>
        </div>

        {/* Role Selection & Trial Creation */}
        <div style={styles.card} className="card-hover">
          <h2 style={styles.sectionTitle}>🎭 Role Selection</h2>
          <select
            style={styles.input}
            value={selectedRole}
            onChange={e => setSelectedRole(e.target.value)}
            disabled={!!loading}
          >
            <option value="">-- Choose Your Role --</option>
            {roles.map(role => (
              <option key={role} value={role}>{role}</option>
            ))}
          </select>

          {canProceed && !joinedTrial && (
            <div>
              <button
                style={{ ...styles.button, ...styles.primaryButton }}
                className="hover-glow"
                onClick={handleCreateTrial}
                disabled={!!loading}
              >
                🆕 Create New Trial
              </button>

              <div style={{ marginTop: '20px' }}>
                <input
                  style={styles.input}
                  type="text"
                  placeholder="Enter Trial ID"
                  value={trialIdInput}
                  onChange={e => setTrialIdInput(e.target.value)}
                  disabled={!!loading}
                />
                <button
                  style={styles.button}
                  className="hover-glow"
                  onClick={handleJoinTrial}
                  disabled={!!loading || !trialIdInput}
                >
                  🔗 Join by ID
                </button>
              </div>

              <div style={{ marginTop: '15px' }}>
                <input
                  style={styles.input}
                  type="text"
                  placeholder="Enter Invite Code"
                  value={inviteCode}
                  onChange={e => setInviteCode(e.target.value)}
                  disabled={!!loading}
                />
                <button
                  style={styles.button}
                  className="hover-glow"
                  onClick={handleJoinWithCode}
                  disabled={!!loading || !inviteCode}
                >
                  🎫 Join with Code
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Invite Code Display */}
        {myInviteCode && (
          <div style={styles.summary} className="card-hover">
            <div><strong>🎫 Invite Code:</strong> {myInviteCode}</div>
            <div style={{ fontSize: '14px', marginTop: '5px' }}>Share this code with others to let them join your trial</div>
          </div>
        )}

        {/* Trial Summary */}
        {joinedTrial && (
          <div style={styles.summary} className="card-hover">
            <div><strong>📋 Trial ID:</strong> {currentTrialId?.toString()}</div>
            <div><strong>👤 Your Principal:</strong> {principal}</div>
            <div><strong>🎭 Role:</strong> {selectedRole}</div>
            <div><strong>📊 Status:</strong> Active</div>
          </div>
        )}

        {/* Case Management */}
        {joinedTrial && (
          <div style={styles.card} className="card-hover">
            <h2 style={styles.sectionTitle}>📝 Case Management</h2>

            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600', color: '#ffffff' }}>Case Title:</label>
              <input
                style={styles.input}
                type="text"
                placeholder="Enter a descriptive case title..."
                value={caseTitle}
                onChange={e => setCaseTitle(e.target.value)}
                disabled={!!loading}
              />
              <button
                style={styles.button}
                className="hover-glow"
                onClick={handleSaveCaseTitle}
                disabled={!!loading || !caseTitle.trim()}
              >
                💾 Save Title
              </button>
            </div>

            <div>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600', color: '#ffffff' }}>Case Details:</label>
              <textarea
                style={styles.textarea}
                placeholder="Describe your legal case in detail. Include relevant facts, circumstances, and what you're seeking..."
                value={caseDetails}
                onChange={e => setCaseDetails(e.target.value)}
                disabled={!!loading}
              />
              <button
                style={styles.button}
                className="hover-glow"
                onClick={handleSaveCaseDetails}
                disabled={!!loading || !String(caseDetails || "").trim()}
              >
                💾 Save Details
              </button>
            </div>
          </div>
        )}

        {/* VR Courtroom Section */}
        {joinedTrial && (
          <div style={styles.vrPanel} className="card-hover">
            <h2 style={{ color: '#ffffff', fontSize: '1.5rem', marginBottom: '15px' }}>🥽 VR Courtroom Experience</h2>
            <button
              style={{ ...styles.button, ...styles.primaryButton }}
              className="hover-glow"
              onClick={() => {
                // Helper function to safely convert BigInt values
                const convertBigInts = (obj: any): any => {
                  if (obj === null || obj === undefined) return obj;
                  if (typeof obj === 'bigint') return obj.toString();
                  if (Array.isArray(obj)) return obj.map(convertBigInts);
                  if (typeof obj === 'object') {
                    const converted: any = {};
                    for (const [key, value] of Object.entries(obj)) {
                      converted[key] = convertBigInts(value);
                    }
                    return converted;
                  }
                  return obj;
                };

                try {
                  sessionStorage.setItem('verdictxr-trial-state', JSON.stringify({
                    trialId: currentTrialId?.toString(),
                    selectedRole: selectedRole,
                    joinedTrial: joinedTrial,
                    trialData: trialData ? convertBigInts(trialData) : null,
                    caseDetails: caseDetails,
                    caseTitle: caseTitle,
                    inviteCode: myInviteCode
                  }));
                  navigate('/vr-courtroom', { state: { participants, evidence: evidence3d } });
                } catch (error) {
                  console.error('Failed to save trial state:', error);
                  // Navigate anyway if saving fails
                  navigate('/vr-courtroom', { state: { participants, evidence: evidence3d } });
                }
              }}          >
              🥽 Show VR Courtroom
            </button>
          </div>
        )}

        {/* Control Panel */}
        {joinedTrial && (
          <div style={styles.controlPanel} className="card-hover">
            {/* Chat Section */}
            <div style={styles.chatSection}>
              <h3 style={styles.sectionTitle}>💬 Trial Chat</h3>
              <input
                style={styles.input}
                type="text"
                placeholder="Type your message..."
                value={chat}
                onChange={e => setChat(e.target.value)}
                disabled={!!loading}
                onKeyPress={e => e.key === 'Enter' && handleSendChat()}
              />
              <button
                style={styles.button}
                className="hover-glow"
                onClick={handleSendChat}
                disabled={!!loading || !chat.trim()}
              >
                📤 Send
              </button>

               {/* Enhanced Evidence Upload Section */}
              <EvidenceUploadSection />
            </div>

            {/* AI Legal Section */}
            <div style={styles.aiSection}>
              <h3 style={styles.sectionTitle}>🤖 AI Legal Consultation</h3>

              <button
                style={{ ...styles.button, ...styles.primaryButton }}
                className="hover-glow"
                onClick={handleStartLawyerDebate}
                disabled={!!loading || !(typeof caseDetails === "string" && caseDetails.trim())}
              >
                ⚖️ Start Dual Lawyer Analysis
              </button>

              <div style={{ marginTop: '15px' }}>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600', color: '#ffffff' }}>Quick Consultation:</label>
                <select
                  style={styles.input}
                  value={selectedLawyer || ''}
                  onChange={e => setSelectedLawyer(e.target.value as 'plaintiff' | 'defendant')}
                >
                  <option value="">Select Lawyer</option>
                  <option value="plaintiff">👔 Plaintiff's Lawyer</option>
                  <option value="defendant">🛡️ Defense Lawyer</option>
                </select>

                <input
                  style={styles.input}
                  type="text"
                  placeholder="Ask a specific legal question..."
                  value={lawyerQuestion}
                  onChange={e => setLawyerQuestion(e.target.value)}
                  disabled={!!loading}
                  onKeyPress={e => e.key === 'Enter' && handleConsultSingleLawyer()}
                />

                <button
                  style={styles.button}
                  className="hover-glow"
                  onClick={handleConsultSingleLawyer}
                  disabled={!!loading || !selectedLawyer || !lawyerQuestion.trim()}
                >
                  💼 Consult
                </button>
              </div>

              <button
                style={{ ...styles.button, ...styles.warningButton, marginTop: '15px' }}
                className="hover-glow"
                onClick={handleEnhancedAIJudge}
                disabled={!!loading}
              >
                👨‍⚖️ Request Final AI Verdict
              </button>
            </div>
          </div>
        )}

        {/* Lawyer Consultations */}
        {lawyerResponses.length > 0 && (
          <div style={styles.card} className="card-hover">
            <h3 style={styles.sectionTitle}>💼 Lawyer Consultations</h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>

              {/* Plaintiff Column */}
              <div style={{
                background: 'rgba(79, 70, 229, 0.1)',
                border: '1px solid rgba(79, 70, 229, 0.3)',
                padding: '16px',
                borderRadius: '12px',
                maxHeight: '250px',
                overflowY: 'auto',
                backdropFilter: 'blur(10px)'
              }}>
                <h4 style={{ color: '#4F46E5' }}>👔 Plaintiff Lawyer</h4>
                {lawyerResponses
                  .filter(r => r.type === 'plaintiff')
                  .map((r, i) => (
                    <p key={i} style={{ fontSize: '13px', marginBottom: '8px', color: '#a1a1aa' }}>{r.text}</p>
                  ))}
              </div>

              {/* Defendant Column */}
              <div style={{
                background: 'rgba(124, 58, 237, 0.1)',
                border: '1px solid rgba(124, 58, 237, 0.3)',
                padding: '16px',
                borderRadius: '12px',
                maxHeight: '250px',
                overflowY: 'auto',
                backdropFilter: 'blur(10px)'
              }}>
                <h4 style={{ color: '#7C3AED' }}>🛡️ Defense Lawyer</h4>
                {lawyerResponses
                  .filter(r => r.type === 'defendant')
                  .map((r, i) => (
                    <p key={i} style={{ fontSize: '13px', marginBottom: '8px', color: '#a1a1aa' }}>{r.text}</p>
                  ))}
              </div>
            </div>
          </div>
        )}

        {/* Dual Lawyer Debate Display */}
        {lawyerDebate && (
          <div style={styles.lawyerDebateContainer} className="card-hover">
            {/* Plaintiff's Lawyer */}
            <div style={{ ...styles.lawyerCard, ...styles.plaintiffCard }}>
              <div style={{
                fontSize: '18px',
                fontWeight: '700',
                marginBottom: '15px',
                textAlign: 'center' as const,
                background: 'linear-gradient(135deg, #4F46E5, #7C3AED)',
                color: '#fff',
                padding: '12px',
                borderRadius: '12px'
              }}>
                ⚖️ Plaintiff's Attorney
              </div>
              <div style={{
                fontSize: '14px',
                lineHeight: '1.6',
                whiteSpace: 'pre-line' as const,
                marginBottom: '15px',
                color: '#ffffff'
              }}>
                {lawyerDebate.plaintiff.argument}
              </div>
              {lawyerDebate.plaintiff.citedCases && lawyerDebate.plaintiff.citedCases.length > 0 && (
                <div style={{
                  background: 'rgba(79, 70, 229, 0.2)',
                  padding: '12px',
                  borderRadius: '8px',
                  border: '1px solid rgba(79, 70, 229, 0.4)',
                  fontSize: '12px'
                }}>
                  <strong style={{ color: '#ffffff' }}>📚 Legal Precedents:</strong>
                  <ul style={{ margin: '8px 0', paddingLeft: '20px' }}>
                    {lawyerDebate.plaintiff.citedCases.map((caseRef, i) => (
                      <li key={i} style={{ marginBottom: '4px', color: '#a1a1aa' }}>{caseRef}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            {/* Defendant's Lawyer */}
            <div style={{ ...styles.lawyerCard, ...styles.defendantCard }}>
              <div style={{
                fontSize: '18px',
                fontWeight: '700',
                marginBottom: '15px',
                textAlign: 'center' as const,
                background: 'linear-gradient(135deg, #7C3AED, #4F46E5)',
                color: '#fff',
                padding: '12px',
                borderRadius: '12px'
              }}>
                🛡️ Defense Attorney
              </div>
              <div style={{
                fontSize: '14px',
                lineHeight: '1.6',
                whiteSpace: 'pre-line' as const,
                marginBottom: '15px',
                color: '#ffffff'
              }}>
                {lawyerDebate.defendant.argument}
              </div>
              {lawyerDebate.defendant.citedCases && lawyerDebate.defendant.citedCases.length > 0 && (
                <div style={{
                  background: 'rgba(124, 58, 237, 0.2)',
                  padding: '12px',
                  borderRadius: '8px',
                  border: '1px solid rgba(124, 58, 237, 0.4)',
                  fontSize: '12px'
                }}>
                  <strong style={{ color: '#ffffff' }}>📚 Legal Precedents:</strong>
                  <ul style={{ margin: '8px 0', paddingLeft: '20px' }}>
                    {lawyerDebate.defendant.citedCases.map((caseRef, i) => (
                      <li key={i} style={{ marginBottom: '4px', color: '#a1a1aa' }}>{caseRef}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Trial Activity Log */}
        {joinedTrial && (
          <div style={styles.card} className="card-hover">
            <h3 style={styles.sectionTitle}>📜 Trial Activity Log</h3>
            <div style={styles.log}>
              {log.length === 0 ? (
                <p style={{ fontStyle: 'italic', color: '#a1a1aa' }}>No activity yet...</p>
              ) : (
                <ul style={{ margin: 0, padding: 0, listStyle: 'none' }}>
                  {log.map((entry, i) => (
                    <li key={i} style={{ marginBottom: '8px', fontSize: '13px', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '4px' }}>
                      <span style={{ color: '#71717a', fontSize: '11px' }}>
                        [{new Date().toLocaleTimeString()}]
                      </span> {entry}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        )}

        {/* AI Lawyer Debate */}
        {joinedTrial && log.some(entry => entry.includes("AI_Plaintiff") || entry.includes("AI_Defendant")) && (
          <div style={styles.card} className="card-hover">
            <h3 style={styles.sectionTitle}>⚖️ AI Lawyer Debate</h3>
            <div style={styles.debateContainer}>

              {/* Plaintiff Column */}
              <div style={styles.lawyerColumn}>
                <h4 style={{ color: "#4F46E5" }}>📢 Plaintiff Lawyer</h4>
                {log.filter(entry => entry.includes("AI_Plaintiff")).map((msg, i) => (
                  <div key={i} style={{ ...styles.bubble, ...styles.plaintiffBubble }}>
                    {msg.replace("AI_Plaintiff: ", "")}
                  </div>
                ))}
              </div>

              {/* Defendant Column */}
              <div style={styles.lawyerColumn}>
                <h4 style={{ color: "#7C3AED" }}>🛡️ Defendant Lawyer</h4>
                {log.filter(entry => entry.includes("AI_Defendant")).map((msg, i) => (
                  <div key={i} style={{ ...styles.bubble, ...styles.defendantBubble }}>
                    {msg.replace("AI_Defendant: ", "")}
                  </div>
                ))}
              </div>

            </div>
          </div>
        )}

        {/* AI Verdict Display */}
        {aiResponse && (
          <div style={styles.card} className="card-hover">
            <div style={styles.aiVerdict}>
              <h3 style={{ margin: '0 0 15px 0', fontSize: '20px', color: '#ffffff' }}>🏛️ FINAL AI VERDICT</h3>
              <div style={{
                whiteSpace: 'pre-line' as const,
                fontSize: '14px',
                lineHeight: '1.6',
                color: '#ffffff'
              }}>
                {aiResponse}
              </div>
            </div>
          </div>
        )}

        {/* Status Messages */}
        {loading && (
          <div style={{
            position: 'fixed',
            top: '20px',
            right: '20px',
            background: 'rgba(0,0,0,0.9)',
            color: '#fff',
            padding: '15px 25px',
            borderRadius: '12px',
            zIndex: 1000,
            fontSize: '14px',
            border: '1px solid rgba(79, 70, 229, 0.3)',
            backdropFilter: 'blur(20px)'
          }}>
            ⏳ {loading}
          </div>
        )}

        {error && <div style={styles.error}>{error}</div>}
        {success && <div style={styles.success}>{success}</div>}
      </div>
    </>
  );
};

export default Dashboard;