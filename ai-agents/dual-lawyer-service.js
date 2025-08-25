// ai-agents/enhanced-dual-lawyer-service.js - ENHANCED VERSION
const express = require('express');
const cors = require('cors');
const fs = require('fs');

// Enhanced environment handling
const envPath = './prompts/.env';
if (fs.existsSync(envPath)) {
  require('dotenv').config({ path: envPath });
} else {
  require('dotenv').config(); // Try default .env
}

const app = express();
app.use(express.json({ limit: '10mb' }));
app.use(cors({
  origin: ['http://localhost:3000', 'http://localhost:5173', 'http://localhost:5174'],
  credentials: true
}));

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

console.log('👔 Dual Lawyer AI Service Starting...');
console.log('📁 Environment file exists:', fs.existsSync(envPath));
console.log('🔑 GEMINI_API_KEY loaded:', !!GEMINI_API_KEY);
console.log('🔑 OPENAI_API_KEY loaded:', !!OPENAI_API_KEY);

// ENHANCED: Comprehensive legal database
const LEGAL_PRECEDENTS = {
  contract: {
    principles: [
      "Contract formation requires offer, acceptance, and consideration",
      "Breach of contract must demonstrate damages or loss",
      "Material breach excuses non-performance by other party",
      "Contracts must have legal capacity and lawful purpose"
    ],
    cases: [
      "Carlill v Carbolic Smoke Ball Co (1893) - Unilateral contract formation",
      "Hadley v Baxendale (1854) - Consequential damages rule",
      "Williams v Roffey Bros (1991) - Practical benefit as consideration",
      "Photo Production Ltd v Securicor (1980) - Exclusion clauses"
    ]
  },
  tort: {
    principles: [
      "Negligence requires duty, breach, causation, and damages",
      "Duty of care determined by reasonable foreseeability",
      "Standard of care is that of reasonable person",
      "Causation requires both factual and legal causation"
    ],
    cases: [
      "Donoghue v Stevenson (1932) - Neighbor principle",
      "Caparo Industries plc v Dickman (1990) - Three-stage test for duty",
      "Wagon Mound No 1 (1961) - Remoteness of damage",
      "Bolton v Stone (1951) - Standard of care in negligence"
    ]
  },
  property: {
    principles: [
      "Adverse possession requires continuous and exclusive occupation",
      "Easements can be acquired by express grant or implication",
      "Property rights include right to exclude others",
      "Registration provides evidence of title"
    ],
    cases: [
      "Fee v Fee (1820) - Adverse possession requirements",
      "Wheeldon v Burrows (1879) - Implied easements",
      "Pye v Graham (2002) - Modern adverse possession",
      "Malory Enterprises v Cheshire Homes (2002) - Trespass to land"
    ]
  },
  criminal: {
    principles: [
      "Burden of proof beyond reasonable doubt",
      "Mens rea (guilty mind) and actus reus (guilty act) required",
      "Presumption of innocence until proven guilty",
      "Right to legal representation and fair trial"
    ],
    cases: [
      "R v Smith (1959) - Causation in criminal law",
      "R v Woollin (1999) - Intention and foresight",
      "R v G and R (2003) - Recklessness standard",
      "R v Malcherek (1981) - Medical intervention and causation"
    ]
  },
  family: {
    principles: [
      "Best interests of child paramount in custody cases",
      "Marriage requires consent and legal capacity",
      "Property division considers contributions and needs",
      "Domestic violence affects custody and contact"
    ],
    cases: [
      "Re KD (1988) - Best interests test",
      "White v White (2001) - Fair sharing in financial cases",
      "Re A (2001) - Paramountcy principle",
      "Re L (2000) - Domestic violence and contact"
    ]
  },
  employment: {
    principles: [
      "Unfair dismissal requires fair reason and procedure",
      "Discrimination unlawful on protected characteristics",
      "Health and safety duty on employers",
      "Right to notice and severance pay"
    ],
    cases: [
      "British Home Stores v Burchell (1978) - Reasonable belief test",
      "Iceland Frozen Foods v Jones (1982) - Range of responses",
      "Seldon v Clarkson Wright (2012) - Age discrimination",
      "Walker v Northumberland CC (1995) - Psychiatric injury at work"
    ]
  }
};

// ENHANCED: Better legal area detection
function detectLegalArea(caseDetails) {
  const text = caseDetails.toLowerCase();
  
  // Score each legal area based on keywords
  const scores = {};
  
  // Contract law keywords
  const contractWords = ['contract', 'agreement', 'breach', 'offer', 'acceptance', 'consideration', 'terms', 'clause'];
  scores.contract = contractWords.filter(word => text.includes(word)).length;
  
  // Tort law keywords
  const tortWords = ['negligence', 'injury', 'damage', 'duty', 'care', 'accident', 'liability', 'harm'];
  scores.tort = tortWords.filter(word => text.includes(word)).length;
  
  // Property law keywords
  const propertyWords = ['property', 'land', 'ownership', 'lease', 'tenant', 'landlord', 'easement', 'title'];
  scores.property = propertyWords.filter(word => text.includes(word)).length;
  
  // Criminal law keywords
  const criminalWords = ['crime', 'theft', 'assault', 'fraud', 'battery', 'criminal', 'police', 'arrest'];
  scores.criminal = criminalWords.filter(word => text.includes(word)).length;
  
  // Family law keywords
  const familyWords = ['divorce', 'custody', 'child', 'marriage', 'spouse', 'family', 'maintenance', 'contact'];
  scores.family = familyWords.filter(word => text.includes(word)).length;
  
  // Employment law keywords
  const employmentWords = ['employment', 'dismissal', 'workplace', 'employer', 'employee', 'discrimination', 'unfair'];
  scores.employment = employmentWords.filter(word => text.includes(word)).length;
  
  // Return the area with highest score, defaulting to contract
  const maxScore = Math.max(...Object.values(scores));
  if (maxScore === 0) return 'contract'; // Default
  
  return Object.keys(scores).find(key => scores[key] === maxScore) || 'contract';
}

// ENHANCED: Professional lawyer prompts
const LAWYER_PROMPTS = {
  plaintiff: {
    system: `You are a highly experienced Plaintiff's Attorney with expertise across multiple areas of law. Your role is to:

CORE OBJECTIVES:
1. Advocate zealously for your client's interests
2. Build the strongest possible case using evidence and law
3. Identify all potential claims and remedies
4. Anticipate and counter defense arguments
5. Cite relevant legal authorities and precedents
6. Calculate appropriate damages and relief

RESPONSE STRUCTURE:
**EXECUTIVE SUMMARY**: Brief overview of your position
**LEGAL BASIS**: Primary legal theories and authorities
**EVIDENCE ANALYSIS**: How evidence supports your claims  
**DAMAGE ASSESSMENT**: Quantification of losses/harm
**PROCEDURAL STRATEGY**: Court procedures and timeline
**COUNTERARGUMENTS**: Address potential defense positions
**CONCLUSION**: Summary of why client should prevail`,
    
    user: (caseDetails, evidence, legalArea, opponentArgs) => `
CASE DETAILS: ${caseDetails}
EVIDENCE SUBMITTED: ${evidence || 'No evidence provided'}
LEGAL AREA DETECTED: ${legalArea}
DEFENSE ARGUMENTS: ${opponentArgs || 'None yet provided'}

Please provide your comprehensive argument for the PLAINTIFF. Use specific legal precedents and analyze all evidence thoroughly.`
  },

  defendant: {
    system: `You are a seasoned Defense Attorney with a reputation for thorough case analysis and strategic defense. Your mission is to:

CORE OBJECTIVES:
1. Protect client from all liability and damages
2. Challenge every element of plaintiff's case
3. Raise all available defenses and counterclaims
4. Question evidence credibility and admissibility
5. Exploit procedural weaknesses in plaintiff's case
6. Present alternative theories and explanations

RESPONSE STRUCTURE:
**DEFENSE STRATEGY**: Overall approach and themes
**LEGAL CHALLENGES**: Attack on plaintiff's legal theories
**EVIDENCE DISPUTES**: Credibility and admissibility issues
**AFFIRMATIVE DEFENSES**: Positive defenses available
**PROCEDURAL OBJECTIONS**: Process and jurisdiction issues
**ALTERNATIVE THEORIES**: Different interpretation of facts
**CONCLUSION**: Why case should be dismissed/defendant wins`,
    
    user: (caseDetails, evidence, legalArea, opponentArgs) => `
CASE DETAILS: ${caseDetails}
EVIDENCE SUBMITTED: ${evidence || 'No evidence provided'}  
LEGAL AREA DETECTED: ${legalArea}
PLAINTIFF'S ARGUMENTS: ${opponentArgs || 'None yet provided'}

Please provide your comprehensive DEFENSE argument. Challenge the plaintiff's case and protect your client's interests using all available legal strategies.`
  }
};

// ENHANCED: AI API calls with better error handling
async function callGeminiAPI(prompt) {
  if (!GEMINI_API_KEY) {
    throw new Error('GEMINI_API_KEY not configured');
  }

  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-exp:generateContent?key=${GEMINI_API_KEY}`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ 
          parts: [{ text: prompt }] 
        }],
        generationConfig: {
          temperature: 0.7,
          topP: 0.8,
          topK: 40,
          maxOutputTokens: 2048,
        }
      }),
    }
  );

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(`Gemini API error: ${errorData.error?.message || response.statusText}`);
  }

  const data = await response.json();
  return data.candidates?.[0]?.content?.parts?.[0]?.text || 'No response from Gemini';
}

async function callOpenAI(prompt) {
  if (!OPENAI_API_KEY) {
    throw new Error('OPENAI_API_KEY not configured');
  }

  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${OPENAI_API_KEY}`
    },
    body: JSON.stringify({
      model: 'gpt-4',
      messages: [
        { role: 'system', content: 'You are an expert legal attorney providing professional legal analysis.' },
        { role: 'user', content: prompt }
      ],
      temperature: 0.7,
      max_tokens: 2048
    })
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(`OpenAI API error: ${errorData.error?.message || response.statusText}`);
  }

  const data = await response.json();
  return data.choices?.[0]?.message?.content || 'No response from OpenAI';
}

// ENHANCED: Professional mock AI with legal knowledge
function generateMockLegalResponse(lawyerType, caseDetails, evidence, legalArea, relevantLaw, opponentArgs) {
  const isPlaintiff = lawyerType === 'plaintiff';
  
  const responses = {
    plaintiff: `**EXECUTIVE SUMMARY**
Based on the case details provided, the plaintiff has a strong legal foundation for this ${legalArea} matter. The evidence supports multiple viable claims with significant potential for recovery.

**LEGAL BASIS**
Primary legal theory centers on ${relevantLaw.principles[0]}. The landmark case of ${relevantLaw.cases[0]} establishes clear precedent supporting our position. Additionally, ${relevantLaw.principles[1]} provides secondary grounds for liability.

**EVIDENCE ANALYSIS**
${evidence ? `The submitted evidence demonstrates a clear pattern supporting our client's claims. Key evidence items directly contradict the defendant's position and establish the factual basis necessary for recovery.` : `While additional evidence would strengthen our position, the case details provide sufficient foundation for our claims under established legal precedents.`}

**DAMAGE ASSESSMENT**
Our client has suffered quantifiable damages including:
- Direct monetary losses
- Consequential damages under ${relevantLaw.cases[1]}
- Potential punitive damages if misconduct is established
- Legal costs and interest

**PROCEDURAL STRATEGY**
We recommend proceeding with immediate filing to preserve all claims. Discovery will focus on obtaining documentation supporting our damages calculation and establishing the full extent of defendant's liability.

**COUNTERARGUMENTS**
${opponentArgs ? `The defense has raised several points, but these fail to address the core legal issues. Their arguments regarding procedural matters are without merit under current law.` : `We anticipate the defense will challenge liability and damages, but the legal precedents clearly support our position.`}

**CONCLUSION**
The law and facts strongly favor our client. We recommend pursuing full damages and injunctive relief where applicable. This case presents an excellent opportunity for successful resolution in our client's favor.`,

    defendant: `**DEFENSE STRATEGY**
This case presents numerous opportunities for successful defense. Our strategy focuses on challenging the fundamental elements of plaintiff's claims while presenting strong affirmative defenses.

**LEGAL CHALLENGES**
Plaintiff's reliance on ${relevantLaw.cases[0]} is misplaced as that precedent involved materially different facts. The legal standard established in ${relevantLaw.cases[1]} actually supports dismissal of these claims. Furthermore, plaintiff has failed to establish the essential elements required under ${relevantLaw.principles[0]}.

**EVIDENCE DISPUTES**
${evidence ? `The evidence presented is circumstantial at best and fails to meet the required burden of proof. Key evidence appears to have been obtained improperly and may be inadmissible. The chain of custody and authentication present significant challenges for plaintiff.` : `The complete lack of supporting evidence demonstrates the weakness of plaintiff's case. Without proper documentation, plaintiff cannot meet their burden of proof.`}

**AFFIRMATIVE DEFENSES**
Multiple affirmative defenses are available:
- Statute of limitations may bar some or all claims
- Comparative/contributory negligence reduces or eliminates liability
- Assumption of risk applies to plaintiff's voluntary conduct
- Failure to mitigate damages limits recovery

**PROCEDURAL OBJECTIONS**
Jurisdictional challenges may be available depending on case specifics. Venue appears improper and should be challenged. Plaintiff's pleadings fail to state a claim upon which relief can be granted.

**ALTERNATIVE THEORIES**
The facts support multiple alternative explanations that completely exonerate our client:
- Third-party intervention caused the alleged damages
- Plaintiff's own actions were the proximate cause
- No duty relationship existed between the parties

**CONCLUSION**
This case should be dismissed with prejudice. The law does not support plaintiff's claims, the evidence is insufficient, and strong defenses are available. We recommend aggressive motion practice to resolve this matter quickly and favorably.`
  };

  return responses[lawyerType];
}

// ENHANCED: Main lawyer response generator
async function generateLawyerResponse(lawyerType, caseDetails, evidence, opponentArgs) {
  const legalArea = detectLegalArea(caseDetails);
  const relevantLaw = LEGAL_PRECEDENTS[legalArea] || LEGAL_PRECEDENTS.contract;
  const prompt = LAWYER_PROMPTS[lawyerType];
  
  let argument;
  
  try {
    // Try AI APIs first
    if (GEMINI_API_KEY) {
      console.log(`📡 Calling Gemini API for ${lawyerType} lawyer...`);
      const fullPrompt = `${prompt.system}\n\n${prompt.user(caseDetails, evidence, legalArea, opponentArgs)}\n\nRelevant Legal Precedents:\n${relevantLaw.cases.join('\n')}`;
      argument = await callGeminiAPI(fullPrompt);
    } else if (OPENAI_API_KEY) {
      console.log(`📡 Calling OpenAI API for ${lawyerType} lawyer...`);
      const fullPrompt = `${prompt.system}\n\n${prompt.user(caseDetails, evidence, legalArea, opponentArgs)}\n\nRelevant Legal Precedents:\n${relevantLaw.cases.join('\n')}`;
      argument = await callOpenAI(fullPrompt);
    } else {
      console.log(`🎭 Using enhanced mock AI for ${lawyerType} lawyer...`);
      argument = generateMockLegalResponse(lawyerType, caseDetails, evidence, legalArea, relevantLaw, opponentArgs);
    }
  } catch (apiError) {
    console.warn(`⚠️  AI API failed for ${lawyerType}, using enhanced mock:`, apiError.message);
    argument = generateMockLegalResponse(lawyerType, caseDetails, evidence, legalArea, relevantLaw, opponentArgs);
  }
  
  return {
    lawyer: lawyerType,
    argument: argument,
    legalBasis: relevantLaw.principles,
    citedCases: relevantLaw.cases,
    legalArea: legalArea,
    timestamp: new Date().toISOString()
  };
}

// API Routes

// ENHANCED: Dual lawyers endpoint
app.post('/dual-lawyers', async (req, res) => {
  try {
    console.log('⚖️  Dual lawyer consultation requested');
    const { caseDetails, evidence, currentArguments } = req.body;
    
    if (!caseDetails) {
      return res.status(400).json({ 
        success: false, 
        error: 'Case details are required' 
      });
    }
    
    // Generate both lawyer responses with context
    const [plaintiffResponse, defendantResponse] = await Promise.all([
      generateLawyerResponse(
        'plaintiff', 
        caseDetails, 
        evidence, 
        currentArguments?.defendant?.argument
      ),
      generateLawyerResponse(
        'defendant', 
        caseDetails, 
        evidence, 
        currentArguments?.plaintiff?.argument
      )
    ]);
    
    console.log('✅ Dual lawyer analysis complete');
    res.json({
      success: true,
      lawyers: {
        plaintiff: plaintiffResponse,
        defendant: defendantResponse
      },
      legalArea: detectLegalArea(caseDetails),
      analysisMetadata: {
        evidenceConsidered: !!evidence,
        priorArgumentsConsidered: !!currentArguments,
        precedentsCited: plaintiffResponse.citedCases.length + defendantResponse.citedCases.length,
        timestamp: new Date().toISOString()
      }
    });
    
  } catch (error) {
    console.error('❌ Dual lawyer error:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Failed to generate dual lawyer analysis: ' + error.message 
    });
  }
});

// ENHANCED: Single lawyer consultation
app.post('/consult-lawyer', async (req, res) => {
  try {
    console.log('👔 Single lawyer consultation requested');
    const { lawyerType, caseDetails, evidence, question } = req.body;
    
    if (!lawyerType || !caseDetails) {
      return res.status(400).json({ 
        success: false, 
        error: 'Lawyer type and case details are required' 
      });
    }
    
    if (!['plaintiff', 'defendant'].includes(lawyerType)) {
      return res.status(400).json({ 
        success: false, 
        error: 'Invalid lawyer type. Must be "plaintiff" or "defendant"' 
      });
    }
    
    // Include the specific question in the case details
    const enhancedCaseDetails = question ? 
      `${caseDetails}\n\nSPECIFIC QUESTION: ${question}` : 
      caseDetails;
    
    const response = await generateLawyerResponse(
      lawyerType, 
      enhancedCaseDetails, 
      evidence, 
      null
    );
    
    console.log(`✅ ${lawyerType} lawyer consultation complete`);
    res.json({
      success: true,
      consultation: response,
      legalArea: detectLegalArea(caseDetails),
      questionAnswered: !!question
    });
    
  } catch (error) {
    console.error('❌ Single lawyer consultation error:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Failed to consult lawyer: ' + error.message 
    });
  }
});

// ENHANCED: Health check endpoint
app.get('/health', (req, res) => {
  res.json({
    service: 'Dual Lawyer AI',
    status: 'running',
    apis: {
      gemini: !!GEMINI_API_KEY,
      openai: !!OPENAI_API_KEY,
      mockAI: !GEMINI_API_KEY && !OPENAI_API_KEY
    },
    legalAreas: Object.keys(LEGAL_PRECEDENTS),
    precedentsLoaded: Object.values(LEGAL_PRECEDENTS).reduce((acc, area) => acc + area.cases.length, 0),
    timestamp: new Date().toISOString()
  });
});

// ENHANCED: Legal database info endpoint
app.get('/legal-database', (req, res) => {
  res.json({
    legalAreas: Object.keys(LEGAL_PRECEDENTS),
    database: LEGAL_PRECEDENTS,
    totalPrecedents: Object.values(LEGAL_PRECEDENTS).reduce((acc, area) => acc + area.cases.length, 0),
    totalPrinciples: Object.values(LEGAL_PRECEDENTS).reduce((acc, area) => acc + area.principles.length, 0)
  });
});

// Error handling middleware
app.use((error, req, res, next) => {
  console.error('🚨 Unhandled error in Dual Lawyer Service:', error);
  res.status(500).json({
    success: false,
    error: 'Internal server error',
    message: process.env.NODE_ENV === 'development' ? error.message : 'Service temporarily unavailable'
  });
});

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
  console.log(`👔 Dual Lawyer AI Service running on http://localhost:${PORT}`);
  console.log(`🔗 Health check: http://localhost:${PORT}/health`);
  console.log(`📚 Legal database: http://localhost:${PORT}/legal-database`);
  console.log('⚖️  Ready to provide dual-perspective legal analysis');
  
  if (!GEMINI_API_KEY && !OPENAI_API_KEY) {
    console.warn('⚠️  WARNING: No AI API keys configured. Using enhanced mock responses.');
    console.warn('   Set GEMINI_API_KEY or OPENAI_API_KEY for real AI analysis.');
    console.warn('   Mock responses are still professionally structured for development.');
  } else {
    console.log('🚀 Real AI integration active!');
  }
  
  console.log(`📊 Legal Database Loaded:
  - ${Object.keys(LEGAL_PRECEDENTS).length} legal areas
  - ${Object.values(LEGAL_PRECEDENTS).reduce((acc, area) => acc + area.cases.length, 0)} case precedents  
  - ${Object.values(LEGAL_PRECEDENTS).reduce((acc, area) => acc + area.principles.length, 0)} legal principles`);
});

module.exports = app;