# VerdictVR: Decentralized AI-Powered Courtroom (VR)

## Vision
A decentralized, immersive courtroom simulation on-chain with:
- Avatars/presence for participants (judge, plaintiff, defendant, observer)
- AI-powered roles (AI judge/lawyer)
- Transparent logic on ICP (Internet Computer)
- Web-based VR using WebXR and Three.js
- All built with browser-native code (Motoko, JS/TS, Three.js)

## Modules Overview
1. **VR Courtroom Frontend**: WebXR-enabled, Three.js, React, dashboard UI
2. **AI Agents**: LLM APIs (OpenAI, LLaMA, WASM) via prompt templates
3. **Blockchain Backend (ICP)**: Motoko canisters for trials, roles, evidence, verdicts
4. **3D Assets and Scenes**: .glTF/.glb models loaded via code

## Project Structure
```
/frontend      # React + Three.js + WebXR + Dashboard
/backend       # ICP canisters (Motoko)
/ai-agents     # LLM prompt templates, proxy scripts
/assets        # .glTF/.glb 3D models
```

## MVP Quickstart
1. **Start the backend (ICP canister):**
   ```bash
   cd backend
   dfx start --background
   dfx deploy
   ```
2. **Start the frontend (React/WebXR):**
   ```bash
   cd frontend
   npm install
   npm start
   ```
3. **Open [http://localhost:3000](http://localhost:3000) in your browser.**

## Usage Flow
1. **Authenticate** with Internet Identity (login button).
2. **Create or join a trial** using the dashboard.
3. **Upload evidence** (URL/description) to the trial.
4. **Chat** in the trial log (messages stored on-chain).
5. **Ask the AI judge** for a verdict (sample LLM prompt, can be extended to real LLM API).
6. **View the VR courtroom** in your browser (WebXR/Three.js scene).

## AI Prompt Example
See `ai-agents/prompts/legal_judge.txt` for the legal reasoning prompt template used for AI judge verdicts.

## Hackathon/Demo Notes
- All trial data, evidence, and logs are stored on-chain (Motoko canister).
- The MVP is browser-based and requires no external engines (no Unity).
- The AI judge is currently a placeholder; connect to an LLM API for full functionality.
- For a real demo, deploy the canister to the ICP mainnet and update the frontend canister ID.

---
For questions or contributions, open an issue or PR! 
