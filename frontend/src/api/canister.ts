// frontend/src/api/canister.ts
import { Actor, HttpAgent } from '@dfinity/agent';
import { idlFactory } from '../dfx_generated/court_backend';
import { Principal } from '@dfinity/principal';

// ---------- Env / Agent ----------
const AGENT_HOST =
  process.env.DFX_NETWORK === 'ic' ? 'https://ic0.app' : 'http://localhost:4943';

const canisterId =
  process.env.CANISTER_ID_COURT_BACKEND ||
  process.env.VITE_CANISTER_ID_COURT_BACKEND;

if (!canisterId) {
  console.warn(
    'CANISTER_ID_COURT_BACKEND environment variable is not set. Using local development.'
  );
}

const agent = new HttpAgent({ host: AGENT_HOST });

// Fetch root key for local replica
if (process.env.DFX_NETWORK !== 'ic') {
  agent.fetchRootKey().catch((err) => {
    console.warn(
      'Unable to fetch root key. Check to ensure that your local replica is running'
    );
    console.error(err);
  });
}

// Create the actor (typed as any to avoid "unknown" return types from candid bindings)
const actor = canisterId
  ? (Actor.createActor(idlFactory as any, {
      agent,
      canisterId,
    }) as any)
  : null;

// ---------- Local TS interfaces (frontend shape) ----------
interface Evidence {
  id: bigint;
  uploader: Principal;
  url: string;
  description: string;
  timestamp: bigint;
}

interface Message {
  sender: Principal;
  role: string;
  content: string;
  timestamp: bigint;
}

interface ParticipantRec {
  principal: Principal;
  role: string;
  joinedAt: bigint;
}

interface Trial {
  id: bigint;
  judge: Principal | null;
  plaintiff: Principal | null;
  defendant: Principal | null;
  observers: Principal[];
  evidence: Evidence[];
  log: Message[];
  verdict: string | null;
  aiVerdict: string | null;
  status: string;
  caseDetails: string | null;
  caseTitle?: string | null;
  participants: ParticipantRec[];
  createdAt: bigint;
}

// ---------- Helpers ----------
/** Safely unwrap Motoko Opt values coming back as [] | [T] */
const unwrapOpt = <T>(opt: unknown): T | null =>
  Array.isArray(opt) && opt.length > 0 ? (opt[0] as T) : null;

// ---------- API wrapper ----------
export const courtBackend = {
  createTrial: async (creator: Principal, role: string): Promise<bigint> => {
    if (!actor) throw new Error('Backend actor not initialized. Check canister configuration.');
    try {
      const trialId = (await actor.createTrial(creator, role)) as bigint;
      console.log('✅ Trial created on blockchain:', trialId.toString());
      return trialId;
    } catch (error) {
      console.error('❌ Error creating trial:', error);
      throw new Error(`Failed to create trial: ${error}`);
    }
  },

  joinTrial: async (
    trialId: bigint,
    principalId: Principal,
    role: string
  ): Promise<boolean> => {
    if (!actor) throw new Error('Backend actor not initialized.');
    try {
      const success = (await actor.joinTrial(trialId, principalId, role)) as boolean;
      console.log('✅ Joined trial:', trialId.toString());
      return success;
    } catch (error) {
      console.error('❌ Error joining trial:', error);
      throw new Error(`Failed to join trial: ${error}`);
    }
  },

  getTrial: async (trialId: bigint): Promise<Trial | null> => {
    if (!actor) throw new Error('Backend actor not initialized.');
    try {
      const trialOpt = (await actor.getTrial(trialId)) as unknown;
      return unwrapOpt<Trial>(trialOpt);
    } catch (error) {
      console.error('❌ Error getting trial:', error);
      return null;
    }
  },

  generateInviteCode: async (trialId: bigint): Promise<string | null> => {
    if (!actor) throw new Error('Backend actor not initialized.');
    try {
      const codeOpt = (await actor.generateInviteCode(trialId)) as unknown;
      return unwrapOpt<string>(codeOpt);
    } catch (error) {
      console.error('❌ Error generating invite code:', error);
      return null;
    }
  },

  joinTrialWithCode: async (
    code: string,
    principalId: Principal,
    role: string
  ): Promise<boolean> => {
    if (!actor) throw new Error('Backend actor not initialized.');
    try {
      const success = (await actor.joinTrialWithCode(
        code,
        principalId,
        role
      )) as boolean;
      console.log('✅ Joined trial with code:', code);
      return success;
    } catch (error) {
      console.error('❌ Error joining with code:', error);
      return false;
    }
  },

  getTrialFromCode: async (code: string): Promise<Trial | null> => {
    if (!actor) throw new Error('Backend actor not initialized.');
    try {
      const trialOpt = (await actor.getTrialFromCode(code)) as unknown;
      return unwrapOpt<Trial>(trialOpt);
    } catch (error) {
      console.error('❌ Error getting trial from code:', error);
      return null;
    }
  },

  setCaseTitle: async (trialId: bigint, caseTitle: string): Promise<boolean> => {
    if (!actor) throw new Error('Backend actor not initialized.');
    try {
      const success = (await actor.setCaseTitle(trialId, caseTitle)) as boolean;
      console.log('✅ Case title set:', caseTitle);
      return success;
    } catch (error) {
      console.error('❌ Error setting case title:', error);
      return false;
    }
  },

  setCaseDetails: async (trialId: bigint, caseDetails: string): Promise<boolean> => {
    if (!actor) throw new Error('Backend actor not initialized.');
    try {
      const success = (await actor.setCaseDetails(trialId, caseDetails)) as boolean;
      console.log('✅ Case details set');
      return success;
    } catch (error) {
      console.error('❌ Error setting case details:', error);
      return false;
    }
  },

  submitEvidence: async (
    trialId: bigint,
    url: string,
    description: string,
    uploader: Principal
  ): Promise<boolean> => {
    if (!actor) throw new Error('Backend actor not initialized.');
    try {
      const success = (await actor.submitEvidence(
        trialId,
        url,
        description,
        uploader
      )) as boolean;
      console.log('✅ Evidence submitted:', description);
      return success;
    } catch (error) {
      console.error('❌ Error submitting evidence:', error);
      return false;
    }
  },

  postMessage: async (
    trialId: bigint,
    role: string,
    content: string
  ): Promise<boolean> => {
    if (!actor) throw new Error('Backend actor not initialized.');
    try {
      const success = (await actor.postMessage(trialId, role, content)) as boolean;
      console.log('✅ Message posted:', content.substring(0, 50) + '...');
      return success;
    } catch (error) {
      console.error('❌ Error posting message:', error);
      return false;
    }
  },

  setAIVerdict: async (trialId: bigint, verdict: string): Promise<boolean> => {
    if (!actor) throw new Error('Backend actor not initialized.');
    try {
      const success = (await actor.setAIVerdict(trialId, verdict)) as boolean;
      console.log('✅ AI verdict set');
      return success;
    } catch (error) {
      console.error('❌ Error setting AI verdict:', error);
      return false;
    }
  },

  setVerdict: async (trialId: bigint, verdict: string): Promise<boolean> => {
    if (!actor) throw new Error('Backend actor not initialized.');
    try {
      const success = (await actor.setVerdict(trialId, verdict)) as boolean;
      console.log('✅ Verdict set');
      return success;
    } catch (error) {
      console.error('❌ Error setting verdict:', error);
      return false;
    }
  },

  getTrialsByParticipant: async (participant: Principal): Promise<Trial[]> => {
    if (!actor) throw new Error('Backend actor not initialized.');
    try {
      const trials = (await actor.getTrialsByParticipant(participant)) as Trial[];
      return trials;
    } catch (error) {
      console.error('❌ Error getting trials by participant:', error);
      return [];
    }
  },

  listTrials: async (): Promise<Trial[]> => {
    if (!actor) throw new Error('Backend actor not initialized.');
    try {
      const trials = (await actor.listTrials()) as Trial[];
      return trials;
    } catch (error) {
      console.error('❌ Error listing trials:', error);
      return [];
    }
  },

  getTrialStats: async (): Promise<{
    openTrials: bigint;
    closedTrials: bigint;
    totalEvidence: bigint;
  }> => {
    if (!actor) throw new Error('Backend actor not initialized.');
    try {
      const stats = (await actor.getTrialStats()) as {
        openTrials: bigint;
        closedTrials: bigint;
        totalEvidence: bigint;
      };
      return stats;
    } catch (error) {
      console.error('❌ Error getting trial stats:', error);
      return { openTrials: 0n, closedTrials: 0n, totalEvidence: 0n };
    }
  },

  healthCheck: async (): Promise<boolean> => {
    if (!actor) {
      console.warn('⚠️ Backend actor not initialized');
      return false;
    }
    try {
      await actor.getTrialStats();
      console.log('✅ Backend health check passed');
      return true;
    } catch (error) {
      console.error('❌ Backend health check failed:', error);
      return false;
    }
  },
};

// Export the actor for direct use if needed
export { actor };

// ---------- Debug logs ----------
console.log('🔧 Canister Configuration:');
console.log('  - Canister ID:', canisterId || 'NOT SET');
console.log('  - Network:', process.env.DFX_NETWORK || 'local');
console.log('  - Agent Host:', AGENT_HOST);
console.log('  - Actor Initialized:', !!actor);

// Auto health check on startup
if (actor) {
  courtBackend.healthCheck().then((healthy) => {
    if (healthy) {
      console.log('🎉 VR Legal Simulator backend is ready!');
    } else {
      console.warn('⚠️ Backend connection issues detected. Check your dfx local replica.');
    }
  });
}
