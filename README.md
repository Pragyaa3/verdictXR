# VerdictVR: Decentralized AI-Powered Courtroom (VR)

VerdictVR is an ambitious project to build a decentralized, immersive courtroom simulation that runs entirely on the Internet Computer blockchain. It combines the power of decentralized applications with virtual reality and artificial intelligence to create a transparent and accessible legal environment.

Our vision is to create a platform where legal proceedings can be conducted in a virtual space with participants represented by avatars. The platform supports roles like judge, plaintiff, and defendant, and even integrates AI-powered agents to act as judges or lawyers. All trial logic, evidence, and verdicts are stored transparently on-chain.

## ✨ Key Features

- **Decentralized & On-Chain**: All trial data, evidence, and logs are stored securely on the Internet Computer, ensuring transparency and immutability.
- **Immersive VR Experience**: A web-based VR courtroom built with WebXR and Three.js, accessible directly from your browser without needing any external game engines.
- **AI-Powered Roles**: Integrate with Large Language Models (LLMs) like OpenAI or LLaMA to power AI judges and lawyers, providing legal reasoning and verdicts based on evidence.
- **Real-time Interaction**: Participants can communicate through an on-chain chat log and interact with the trial process via a user-friendly dashboard.
- **Role-Based Access**: Users can join trials in different capacities (Judge, Plaintiff, Defendant, Observer).

## 🛠️ Technology Stack

- **Frontend**: React, Vite, Three.js, Framer Motion, and WebXR for the immersive VR experience and user dashboard.
- **Backend**: Motoko canisters running on the Internet Computer Protocol (ICP) for all smart contract logic.
- **AI Agents**: A proxy server built with Express.js to securely connect to LLM APIs (e.g., OpenAI).
- **3D Assets**: `.glTF` and `.glb` models for the courtroom and avatars.

## 📂 Project Structure

```
/
├── frontend/      # React + Three.js + WebXR Frontend
├── backend/       # ICP Motoko Canisters (Smart Contracts)
├── ai-agents/     # LLM prompt templates and proxy server
└── assets/        # 3D models and other static assets
```

## 🚀 Getting Started

### Prerequisites

- Node.js (v18 or later)
- DFINITY Canister SDK (dfx)
- `pnpm` (or your preferred package manager)

### 1. Setup and Deploy Backend Canister

First, start the local replica of the Internet Computer.

```bash
dfx start --background
```

Next, deploy the Motoko canister.

```bash
cd backend
dfx deploy
```

### 2. Configure and Start the Frontend

The frontend needs to know the canister ID to communicate with the backend. The deploy script creates a `.env` file with this information.

```bash
cd frontend
npm install
npm run dev
```

### 3. (Optional) Start the AI Agent Proxy

To enable the AI Judge functionality, you need to run the AI proxy server.

First, create a `.env` file in the root directory with your OpenAI API key:

```
OPENAI_API_KEY=your_api_key_here
```

Then, start the server:

```bash
cd ../ # (from frontend directory)
npm install
node ai-agents/proxy.js # (Assuming proxy is in this location)
```

### 4. Access the Application

Open **http://localhost:3000** (or the port specified by Vite) in a WebXR-compatible browser.

## 📖 Canister API

The core logic is handled by the `court_backend` Motoko canister, which exposes the following methods:

- `createTrial(creator, role)`: Creates a new trial and assigns the creator a role.
- `joinTrial(trialId, principal, role)`: Allows a user to join an existing trial.
- `getTrial(trialId)`: Fetches the complete state of a specific trial.
- `submitEvidence(trialId, url, description, uploader)`: Adds a piece of evidence to a trial.
- `postMessage(trialId, role, content)`: Posts a message to the on-chain trial log.
- `setAIVerdict(trialId, verdict)`: Updates the trial with a verdict from an AI agent.
- `setVerdict(trialId, verdict)`: Allows a human judge to set the final verdict.
- `listTrials()`: Returns a list of all active trials.

## 🎛️ Usage Flow

1.  **Authenticate**: Log in using Internet Identity.
2.  **Dashboard**: Use the dashboard to create a new trial or join an existing one.
3.  **Manage Trial**: As a participant, you can set the case title, add details, and upload evidence (links and descriptions).
4.  **Chat**: All participants can communicate through the real-time, on-chain chat log.
5.  **AI Verdict**: The judge can request a verdict from the AI, which analyzes the case details and evidence.
6.  **VR Courtroom**: Enter the immersive VR courtroom to view the scene and participants.

## 📝 Notes for Hackathons/Demos

- The AI judge functionality requires the AI proxy server to be running and configured with an LLM API key.
- For a live demo, deploy the canister to the ICP mainnet and update the `CANISTER_ID_COURT_BACKEND` in the frontend's environment variables.
- The project is built entirely with browser-native technologies, showcasing the power of a fully on-chain web application.

---

## 🤝 Contributing

Contributions are welcome! If you'd like to help improve VerdictVR, please feel free to open an issue or submit a pull request.

1.  Fork the repository.
2.  Create your feature branch (`git checkout -b feature/YourFeature`).
3.  Commit your changes (`git commit -m 'Add some feature'`).
4.  Push to the branch (`git push origin feature/YourFeature`).
5.  Open a Pull Request.

## 📄 License

This project is licensed under the MIT License. See the `LICENSE` file for details.
 
For questions or contributions, open an issue or PR! 
