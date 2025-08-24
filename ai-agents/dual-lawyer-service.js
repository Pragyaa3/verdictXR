// ai-agents/dual-lawyer-service.js
const express = require('express');
const cors = require('cors');
const app = express();

app.use(cors());
app.use(express.json());

// Mock legal database - replace with real law API in production
const LEGAL_PRECEDENTS = {
  contract: {
    principles: ["Contract must have offer, acceptance, and consideration", "Breach of contract requires damages"],
    cases: ["Carlill v Carbolic Smoke Ball Co", "Hadley v Baxendale"]
  },
  tort: {
    principles: ["Duty of care must be established", "Causation must be proven"],
    cases: ["Donoghue v Stevenson", "Caparo Industries plc v Dickman"]
  },
  property: {
    principles: ["Adverse possession requires continuous occupation", "Easements can be acquired by prescription"],
    cases: ["Fee v Fee", "Wheeldon v Burrows"]
  },
  criminal: {
    principles: ["Burden of proof beyond reasonable doubt", "Mens rea and actus reus required"],
    cases: ["R v Smith", "R v Woollin"]
  }
};

// Enhanced prompts for dual lawyers
const LAWYER_PROMPTS = {
  plaintiff: {
    system: `You are an experienced Plaintiff's Attorney. Your job is to:
1. Argue in favor of the plaintiff's case
2. Find legal precedents that support your client
3. Analyze evidence to strengthen your position
4. Point out weaknesses in the defendant's arguments
5. Reference actual legal principles and case law
6. Be persuasive but factual

Always structure your response as:
- **Legal Basis**: Cite relevant laws/precedents
- **Evidence Analysis**: How evidence supports your client
- **Arguments**: Key points in favor of plaintiff
- **Counterarguments**: Address potential objections`,
    
    user: (caseDetails, evidence, opponentArgs) => `
Case Details: ${caseDetails}
Evidence Submitted: ${evidence}
Opponent's Arguments: ${opponentArgs || 'None yet'}

Please provide your argument for the PLAINTIFF. Use legal precedents and analyze the evidence.`
  },

  defendant: {
    system: `You are an experienced Defense Attorney. Your job is to:
1. Defend your client against all allegations
2. Find legal precedents that support the defense
3. Challenge the plaintiff's evidence and arguments
4. Raise procedural or substantive defenses
5. Reference actual legal principles and case law
6. Protect your client's interests

Always structure your response as:
- **Defense Strategy**: Key defensive positions
- **Legal Challenges**: Question plaintiff's legal basis
- **Evidence Disputes**: Challenge evidence credibility/relevance
- **Alternative Theories**: Present alternative explanations
- **Precedents**: Cite cases favoring defense`,
    
    user: (caseDetails, evidence, opponentArgs) => `
Case Details: ${caseDetails}
Evidence Submitted: ${evidence}
Plaintiff's Arguments: ${opponentArgs || 'None yet'}

Please provide your argument for the DEFENDANT. Challenge the plaintiff's case and defend your client.`
  }
};

// Simple AI response generator (replace with GPT/Claude API)
async function generateLawyerResponse(lawyerType, caseDetails, evidence, opponentArgs) {
  const prompt = LAWYER_PROMPTS[lawyerType];
  
  // Determine legal area from case details
  const legalArea = detectLegalArea(caseDetails);
  const relevantLaw = LEGAL_PRECEDENTS[legalArea] || LEGAL_PRECEDENTS.contract;
  
  // Mock AI response - replace with actual API call
  const response = await mockLegalAI(prompt, caseDetails, evidence, opponentArgs, relevantLaw, lawyerType);
  
  return {
    lawyer: lawyerType,
    argument: response,
    legalBasis: relevantLaw.principles,
    citedCases: relevantLaw.cases,
    timestamp: new Date().toISOString()
  };
}

function detectLegalArea(caseDetails) {
  const text = caseDetails.toLowerCase();
  if (text.includes('contract') || text.includes('agreement') || text.includes('breach')) return 'contract';
  if (text.includes('negligence') || text.includes('injury') || text.includes('damage')) return 'tort';
  if (text.includes('property') || text.includes('land') || text.includes('ownership')) return 'property';
  if (text.includes('crime') || text.includes('theft') || text.includes('assault')) return 'criminal';
  return 'contract'; // default
}

async function mockLegalAI(prompt, caseDetails, evidence, opponentArgs, relevantLaw, lawyerType) {
  // This simulates an AI response - replace with actual API call to GPT/Claude
  const isPlaintiff = lawyerType === 'plaintiff';
  
  const responses = {
    plaintiff: `
**Legal Basis**: Based on ${relevantLaw.principles[0]}, the plaintiff has a strong case. The precedent in ${relevantLaw.cases[0]} directly supports our position.

**Evidence Analysis**: The submitted evidence clearly demonstrates ${evidence ? 'a pattern of wrongdoing' : 'the defendant\'s liability'}. This evidence is both relevant and credible.

**Arguments**: 
1. The defendant failed to meet their legal obligations
2. Our client suffered quantifiable damages as a direct result
3. The law clearly favors our interpretation of the facts

**Counterarguments**: While the defense may claim ${opponentArgs ? 'procedural issues' : 'lack of evidence'}, the legal precedent established in ${relevantLaw.cases[1]} clearly refutes this position.`,

    defendant: `
**Defense Strategy**: We will challenge the plaintiff's claims on both factual and legal grounds, emphasizing the lack of sufficient evidence and questionable legal basis.

**Legal Challenges**: The plaintiff's reliance on ${relevantLaw.cases[0]} is misplaced. That case involved different circumstances and doesn't apply here.

**Evidence Disputes**: The evidence presented is ${evidence ? 'circumstantial and unreliable' : 'insufficient to meet the burden of proof'}. Key evidence is missing or improperly obtained.

**Alternative Theories**: The facts support an alternative explanation that completely exonerates our client. ${relevantLaw.principles[1]} actually supports the defense position.

**Precedents**: ${relevantLaw.cases[1]} establishes that similar cases require higher standards of proof, which the plaintiff has failed to meet.`
  };

  return responses[lawyerType];
}

// API Routes
app.post('/dual-lawyers', async (req, res) => {
  try {
    const { caseDetails, evidence, currentArguments } = req.body;
    
    // Generate both lawyer responses
    const plaintiffResponse = await generateLawyerResponse(
      'plaintiff', 
      caseDetails, 
      evidence, 
      currentArguments?.defendant?.argument
    );
    
    const defendantResponse = await generateLawyerResponse(
      'defendant', 
      caseDetails, 
      evidence, 
      currentArguments?.plaintiff?.argument
    );
    
    res.json({
      success: true,
      lawyers: {
        plaintiff: plaintiffResponse,
        defendant: defendantResponse
      },
      legalArea: detectLegalArea(caseDetails),
      timestamp: new Date().toISOString()
    });
    
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      error: error.message 
    });
  }
});

// Single lawyer consultation
app.post('/consult-lawyer', async (req, res) => {
  try {
    const { lawyerType, caseDetails, evidence, question } = req.body;
    
    const response = await generateLawyerResponse(lawyerType, caseDetails, evidence, question);
    
    res.json({
      success: true,
      consultation: response,
      legalArea: detectLegalArea(caseDetails)
    });
    
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      error: error.message 
    });
  }
});

// Enhanced AI Judge that considers both lawyers
app.post('/ai-judge-enhanced', async (req, res) => {
  try {
    const { trial, lawyerArguments } = req.body;
    
    const legalArea = detectLegalArea(trial.caseDetails || 'general case');
    const relevantLaw = LEGAL_PRECEDENTS[legalArea];
    
    // Judge considers both sides
    const verdict = `
**FINAL VERDICT**

After carefully considering arguments from both counsel and reviewing all evidence:

**Plaintiff's Strengths**: ${lawyerArguments?.plaintiff ? 'Strong legal precedent and compelling evidence' : 'Limited arguments presented'}

**Defendant's Strengths**: ${lawyerArguments?.defendant ? 'Effective challenges to evidence and alternative legal theories' : 'Defense not fully developed'}

**Legal Analysis**: Under ${relevantLaw.principles[0]}, and considering the precedent in ${relevantLaw.cases[0]}, the court finds...

**DECISION**: ${Math.random() > 0.5 ? 'JUDGMENT FOR PLAINTIFF' : 'JUDGMENT FOR DEFENDANT'}

**Reasoning**: The evidence ${Math.random() > 0.5 ? 'sufficiently demonstrates' : 'fails to prove'} the required elements. The law requires clear proof, which has ${Math.random() > 0.5 ? 'been provided' : 'not been established'}.

**Damages/Relief**: ${Math.random() > 0.5 ? 'Awarded as requested' : 'Motion denied'}
`;

    res.json({
      success: true,
      verdict,
      legalArea,
      considerationsReviewed: {
        plaintiffArguments: !!lawyerArguments?.plaintiff,
        defendantArguments: !!lawyerArguments?.defendant,
        evidenceReviewed: trial.evidence?.length || 0,
        legalPrecedentsConsidered: relevantLaw.cases.length
      }
    });
    
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      error: error.message 
    });
  }
});

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
  console.log(`🏛️  Dual Lawyer AI Service running on http://localhost:${PORT}`);
  console.log('📚 Legal database loaded with precedents');
  console.log('⚖️  Ready to provide dual-perspective legal analysis');
});

module.exports = app;