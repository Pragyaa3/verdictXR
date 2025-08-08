import { Actor, HttpAgent } from '@dfinity/agent';
import { idlFactory } from '../dfx_generated/court_backend/service.did.js';
import { createActor } from '../dfx_generated/court_backend/index.js';

const canisterId = process.env.CANISTER_ID_COURT_BACKEND;

if (!canisterId) {
  throw new Error("The CANISTER_ID_COURT_BACKEND environment variable is not set. Check your .env file and vite.config.ts");
}

const agent = new HttpAgent({ host: 'http://localhost:4943' });

if (process.env.NODE_ENV === 'development') {
  agent.fetchRootKey();
}

export const courtBackend = Actor.createActor(idlFactory, {
  agent,
  canisterId,
});

// Example usage:
// await courtBackend.createTrial(principal1, principal2);
// await courtBackend.submitEvidence(trialId, url, description);
// await courtBackend.postMessage(trialId, role, content);
// await courtBackend.setVerdict(trialId, verdict);
// await courtBackend.setAIVerdict(trialId, aiVerdict);
// await courtBackend.getTrial(trialId);
// await courtBackend.listTrials(); 