import { Actor, HttpAgent } from '@dfinity/agent';
import { idlFactory } from '../dfx_generated/court_backend/service.did.js';
import { createActor } from '../dfx_generated/court_backend/index.js';
import { Principal } from '@dfinity/principal';

const canisterId = process.env.CANISTER_ID_COURT_BACKEND;

if (!canisterId) {
  throw new Error("The CANISTER_ID_COURT_BACKEND environment variable is not set. Check your .env file and vite.config.ts");
}

const agent = new HttpAgent({ host: 'http://localhost:4943' });

if (process.env.NODE_ENV === 'development') {
  agent.fetchRootKey();
}

const actor = Actor.createActor(idlFactory, {
  agent,
  canisterId,
});

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

interface TrialRecord {
  trial: Trial;
  timestamp: bigint;
  inviteCode?: string;
  participants: { principal: Principal; role: string; joinedAt: bigint }[];
}

const trialCache: Map<bigint, TrialRecord> = new Map();
const inviteCodeMap: Map<string, bigint> = new Map();

export const courtBackend = {
  // Create a trial
  createTrial: async (principalId: Principal, role: string): Promise<bigint> => {
    const id = BigInt(Math.floor(Math.random() * 1000000)); // simple auto-generated ID
    const now = BigInt(Date.now());
    const trial: Trial = {
      id,
      judge: role === 'Judge' ? principalId : Principal.fromText('aaaaa-aa'),
      plaintiff: role === 'Plaintiff' ? principalId : Principal.fromText('aaaaa-aa'),
      defendant: role === 'Defendant' ? principalId : Principal.fromText('aaaaa-aa'),
      observers: [],
      evidence: [],
      status: 'Active',
    };

    const record: TrialRecord = {
      trial,
      timestamp: now,
      participants: [{ principal: principalId, role, joinedAt: now }],
    };

    trialCache.set(id, record);
    return id;
  },

  // Join an existing trial
  joinTrial: async (trialId: bigint, principalId: Principal, role: string) => {
    const record = trialCache.get(trialId);
    if (!record) throw new Error('Trial not found');
    const now = BigInt(Date.now());

    // Add participant if not already present
    if (!record.participants.some((p) => p.principal.toText() === principalId.toText())) {
      record.participants.push({ principal: principalId, role, joinedAt: now });

      // Add to trial roles
      switch (role) {
        case 'Judge':
          record.trial.judge = principalId;
          break;
        case 'Plaintiff':
          record.trial.plaintiff = principalId;
          break;
        case 'Defendant':
          record.trial.defendant = principalId;
          break;
        case 'Observer':
          record.trial.observers.push(principalId);
          break;
        default:
          throw new Error('Invalid role');
      }
    }

    trialCache.set(trialId, record);
  },

  // Get trial info
  getTrial: async (trialId: bigint): Promise<Trial | null> => {
    const record = trialCache.get(trialId);
    if (!record) return null;
    return record.trial;
  },

  // Generate invite code for a trial
  generateInviteCode: async (trialId: bigint): Promise<string> => {
    const record = trialCache.get(trialId);
    if (!record) throw new Error('Trial not found');
    const code = Math.random().toString(36).substring(2, 8).toUpperCase();
    record.inviteCode = code;
    inviteCodeMap.set(code, trialId);
    return code;
  },

  // Join trial using invite code
  joinTrialWithCode: async (code: string, principalId: Principal, role: string) => {
    const trialId = inviteCodeMap.get(code);
    if (!trialId) return false;
    await courtBackend.joinTrial(trialId, principalId, role);
    return true;
  },

  // Get trial from invite code
  getTrialFromCode: async (code: string): Promise<Trial | null> => {
    const trialId = inviteCodeMap.get(code);
    if (!trialId) return null;
    return await courtBackend.getTrial(trialId);
  },

  // Submit evidence
  submitEvidence: async (trialId: bigint, url: string, description: string, uploader: Principal) => {
    const record = trialCache.get(trialId);
    if (!record) throw new Error('Trial not found');
    record.trial.evidence.push({ url, description, uploader });
  },

  // Post chat/message
  postMessage: async (trialId: bigint, roleObj: any, content: string) => {
    // Just push to log (Dashboard already handles VR display)
    const record = trialCache.get(trialId);
    if (!record) throw new Error('Trial not found');
    // Optional: Could store chat in record.participants or new field
  },

  // Set AI verdict
  setAIVerdict: async (trialId: bigint, verdict: string) => {
    const record = trialCache.get(trialId);
    if (!record) throw new Error('Trial not found');
    record.trial.aiVerdict = verdict;
  },
};

// Example usage:
// await courtBackend.createTrial(principal1, principal2);
// await courtBackend.submitEvidence(trialId, url, description);
// await courtBackend.postMessage(trialId, role, content);
// await courtBackend.setVerdict(trialId, verdict);
// await courtBackend.setAIVerdict(trialId, aiVerdict);
// await courtBackend.getTrial(trialId);
// await courtBackend.listTrials(); 