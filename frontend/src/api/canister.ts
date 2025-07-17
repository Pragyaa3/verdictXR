import { Actor, HttpAgent } from '@dfinity/agent';
import { idlFactory as courtIDL } from '../../../.dfx/local/canisters/court_backend/court_backend.did.js';

const canisterId = process.env.REACT_APP_BACKEND_CANISTER_ID || 'court_backend_canister_id_here';

const agent = new HttpAgent({ host: 'http://localhost:4943' });

export const courtBackend = Actor.createActor(courtIDL, {
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