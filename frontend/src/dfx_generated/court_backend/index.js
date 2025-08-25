import { Actor, HttpAgent } from "@dfinity/agent";

// Imports and re-exports candid interface
import { idlFactory } from './service.did.js';
export { idlFactory } from './service.did.js';

// Get canister ID from environment variables
export const canisterId = process.env.CANISTER_ID_COURT_BACKEND;

if (!canisterId) {
  console.warn(
    "CANISTER_ID_COURT_BACKEND environment variable is not set. The actor may not work correctly."
  );
}

/**
 * Create an actor for your canister
 * @param {string | import("@dfinity/principal").Principal} canisterId
 * @param {{agentOptions?: import("@dfinity/agent").HttpAgentOptions; actorOptions?: import("@dfinity/agent").ActorConfig} | { agent?: import("@dfinity/agent").Agent; actorOptions?: import("@dfinity/agent").ActorConfig }} options
 */
export const createActor = (canisterId, options = {}) => {
  // Deprecation warning (keep for now)
  console.warn(`Deprecation warning: importing from .dfx. Consider running 'dfx generate' to generate JS bindings.
See https://internetcomputer.org/docs/current/developer-docs/updates/release-notes/`);

  // Explicit host for local development or mainnet
  const host =
    process.env.DFX_NETWORK === "ic" ? "https://ic0.app" : "http://127.0.0.1:4943";

  const agent = options.agent || new HttpAgent({ host, ...options.agentOptions });

  // Fetch root key for local development
  if (process.env.DFX_NETWORK !== "ic") {
    agent.fetchRootKey().catch((err) => {
      console.warn(
        "Unable to fetch root key. Make sure your local replica is running."
      );
      console.error(err);
    });
  }

  // Create the actor with the candid interface
  return Actor.createActor(idlFactory, {
    agent,
    canisterId,
    ...(options.actorOptions || {}),
  });
};

/**
 * A ready-to-use actor for the court_backend canister
 * @type {import("@dfinity/agent").ActorSubclass<import("./service.did.js")._SERVICE>}
 */
export const court_backend = canisterId ? createActor(canisterId) : undefined;
