// ai-agents/ai-judge-service.js
const express = require('express');
const cors = require('cors');
const fs = require('fs');

// 🔧 FIXED: Better environment variable handling
const envPath = './prompts/.env';
if (fs.existsSync(envPath)) {
  require('dotenv').config({ path: envPath });
} else {
  require('dotenv').config(); // Try default .env
}

const app = express();
app.use(express.json({ limit: '10mb' })); // 🔧 ENHANCED: Handle larger payloads
app.use(cors({
  origin: ['http://localhost:3000', 'http://localhost:5173'], // 🔧 ENHANCED: Support Vite dev server
  credentials: true
}));

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const OPENAI_API_KEY = process.env.OPENAI_API_KEY; // 🔧 NEW: OpenAI fallback

console.log('🏛️  AI Judge Service Starting...');
console.log('📁 Environment file exists:', fs.existsSync(envPath));
console.log('🔑 GEMINI_API_KEY loaded:', !!GEMINI_API_KEY);
console.log('🔑 OPENAI_API_KEY loaded:', !!OPENAI_API_KEY);

// 🔧 ENHANCED: Comprehensive legal analysis prompts
const JUDGE_PROMPTS = {
  basic: `You are an experienced AI Judge with expertise in multiple areas of law. 
Your role is to provide impartial, well-reasoned verdicts based on evidence and legal principles.

ANALYSIS FRAMEWORK:
1. **Jurisdiction & Standing**: Verify proper legal authority
2. **Evidence Review**: Assess credibility and relevance of all evidence
3. **Legal Precedents**: Apply relevant case law and statutes
4. **Burden of Proof**: Determine if standards are met
5. **Damages/Relief**: Calculate appropriate remedies if applicable

VERDICT FORMAT:
- **CASE SUMMARY**: Brief overview of the matter
- **KEY FINDINGS**: Critical facts established
- **LEGAL ANALYSIS**: Application of law to facts  
- **VERDICT**: Clear decision with reasoning
- **DAMAGES/ORDERS**: Specific relief granted or denied`,

  enhanced: `You are an AI Judge conducting a comprehensive trial analysis. 
You have reviewed arguments from both plaintiff and defendant attorneys, along with all submitted evidence.

ENHANCED ANALYSIS REQUIREMENTS:
1. **Evaluate Lawyer Arguments**: Compare strengths/weaknesses of both sides
2. **Evidence Synthesis**: Integrate all evidence into cohesive analysis
3. **Legal Research**: Apply relevant precedents and statutes
4. **Procedural Compliance**: Ensure all legal requirements are met
5. **Fairness Assessment**: Guarantee impartial consideration

Your verdict should be detailed, legally sound, and demonstrate careful consideration of all presented arguments.`
};

// 🔧 ENHANCED: Comprehensive trial data processor
function processTrialData(trial) {
  const summary = {
    trialId: trial.id?.toString() || 'Unknown',
    participants: {
      judge: trial.judge?.toString() || 'AI Judge',
      plaintiff: trial.plaintiff?.toString() || 'Unknown',
      defendant: trial.defendant?.toString() || 'Unknown',
      observers: trial.observers?.length || 0
    },
    caseDetails: trial.caseDetails || 'No case details provided',
    evidence: trial.evidence?.map(e => ({
      description: e.description,
      uploader: e.uploader?.toString(),
      url: e.url
    })) || [],
    messages: trial.log?.map(msg => ({
      sender: msg.sender?.toString(),
      role: msg.role,
      content: msg.content,
      timestamp: new Date(Number(msg.timestamp) / 1000000).toLocaleString() // Convert nanoseconds
    })) || [],
    status: trial.status || 'Active',
    createdAt: trial.createdAt ? new Date(Number(trial.createdAt) / 1000000).toLocaleString() : 'Unknown'
  };

  return summary;
}

// 🔧 NEW: Gemini API integration
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
    const errorData = await response.json();
    throw new Error(`Gemini API error: ${errorData.error?.message || response.statusText}`);
  }

  const data = await response.json();
  return data.candidates?.[0]?.content?.parts?.[0]?.text || 'No response from Gemini';
}

// 🔧 NEW: OpenAI API fallback
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
        { role: 'system', content: JUDGE_PROMPTS.basic },
        { role: 'user', content: prompt }
      ],
      temperature: 0.7,
      max_tokens: 2048
    })
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(`OpenAI API error: ${errorData.error?.message || response.statusText}`);
  }

  const data = await response.json();
  return data.choices?.[0]?.message?.content || 'No response from OpenAI';
}

// 🔧 NEW: Mock AI fallback for development
function mockAIJudge(trialSummary) {
  const verdicts = [
    'JUDGMENT FOR PLAINTIFF',
    'JUDGMENT FOR DEFENDANT', 
    'CASE DISMISSED',
    'SETTLEMENT RECOMMENDED'
  ];
  
  const verdict = verdicts[Math.floor(Math.random() * verdicts.length)];
  
  return `**MOCK AI VERDICT** (Replace with real AI in production)

**CASE SUMMARY**: Trial ${trialSummary.trialId} involving dispute between parties.

**KEY FINDINGS**: 
- Evidence Submitted: ${trialSummary.evidence.length} items
- Court Messages: ${trialSummary.messages.length} entries
- Case Details: ${trialSummary.caseDetails ? 'Provided' : 'Missing'}

**LEGAL ANALYSIS**: Based on the submitted evidence and case details, the court finds that the legal standards ${Math.random() > 0.5 ? 'have been met' : 'are insufficient'}.

**VERDICT**: ${verdict}

**REASONING**: ${verdict.includes('PLAINTIFF') ? 
  'The evidence clearly demonstrates liability and damages warranting relief.' : 
  'The plaintiff has failed to meet the required burden of proof.'}

**DAMAGES/ORDERS**: ${verdict.includes('PLAINTIFF') ? 
  'Damages awarded in the amount reasonably supported by evidence.' : 
  'No damages awarded. Case dismissed with prejudice.'}

⚠️ **NOTE**: This is a development mock. Configure GEMINI_API_KEY or OPENAI_API_KEY for real AI analysis.`;
}

// 🚀 BASIC AI JUDGE ENDPOINT
app.post('/ai-judge', async (req, res) => {
  try {
    console.log('🏛️  Basic AI Judge Request Received');
    
    const { trial } = req.body;
    if (!trial) {
      return res.status(400).json({ 
        success: false,
        error: 'Missing trial data' 
      });
    }

    const trialSummary = processTrialData(trial);
    const prompt = `${JUDGE_PROMPTS.basic}

**TRIAL DATA:**
${JSON.stringify(trialSummary, null, 2)}

Please provide your judicial verdict and reasoning.`;

    let verdict;
    try {
      // Try Gemini first
      if (GEMINI_API_KEY) {
        console.log('📡 Calling Gemini API...');
        verdict = await callGeminiAPI(prompt);
      } else if (OPENAI_API_KEY) {
        console.log('📡 Calling OpenAI API...');
        verdict = await callOpenAI(prompt);
      } else {
        console.log('🎭 Using Mock AI Judge...');
        verdict = mockAIJudge(trialSummary);
      }
    } catch (apiError) {
      console.warn('⚠️  AI API failed, using mock:', apiError.message);
      verdict = mockAIJudge(trialSummary);
    }

    console.log('✅ Basic AI Judge Verdict Generated');
    res.json({ 
      success: true,
      verdict,
      trialId: trialSummary.trialId,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('❌ Basic AI Judge Error:', error);
    res.status(500).json({ 
      success: false,
      error: 'AI Judge service error: ' + error.message 
    });
  }
});

// 🚀 ENHANCED AI JUDGE ENDPOINT (considers lawyer arguments)
app.post('/ai-judge-enhanced', async (req, res) => {
  try {
    console.log('🏛️  Enhanced AI Judge Request Received');
    
    const { trial, lawyerArguments } = req.body;
    if (!trial) {
      return res.status(400).json({ 
        success: false,
        error: 'Missing trial data' 
      });
    }

    const trialSummary = processTrialData(trial);
    
    // 🔧 ENHANCED: Include lawyer arguments in analysis
    const lawyerAnalysis = lawyerArguments ? `
**PLAINTIFF'S ATTORNEY ARGUMENT:**
${lawyerArguments.plaintiff?.argument || 'No argument provided'}

**CITED PRECEDENTS (Plaintiff):**
${lawyerArguments.plaintiff?.citedCases?.join(', ') || 'None cited'}

**DEFENSE ATTORNEY ARGUMENT:**
${lawyerArguments.defendant?.argument || 'No argument provided'}

**CITED PRECEDENTS (Defense):**
${lawyerArguments.defendant?.citedCases?.join(', ') || 'None cited'}
` : 'No lawyer arguments provided.';

    const prompt = `${JUDGE_PROMPTS.enhanced}

**TRIAL DATA:**
${JSON.stringify(trialSummary, null, 2)}

**ATTORNEY ARGUMENTS:**
${lawyerAnalysis}

**INSTRUCTIONS:**
Provide a comprehensive judicial verdict that:
1. Evaluates both attorney arguments fairly
2. Weighs all evidence and legal precedents cited
3. Applies relevant law to the established facts
4. Renders a clear, reasoned decision
5. Awards appropriate relief if warranted

Please provide your detailed judicial verdict.`;

    let verdict;
    try {
      // Try AI APIs
      if (GEMINI_API_KEY) {
        console.log('📡 Calling Gemini API for Enhanced Analysis...');
        verdict = await callGeminiAPI(prompt);
      } else if (OPENAI_API_KEY) {
        console.log('📡 Calling OpenAI API for Enhanced Analysis...');
        verdict = await callOpenAI(prompt);
      } else {
        console.log('🎭 Using Enhanced Mock AI Judge...');
        verdict = `${mockAIJudge(trialSummary)}

**ATTORNEY ARGUMENT ANALYSIS:**
${lawyerArguments ? 
  `Both counsel presented arguments. Plaintiff's position focused on establishing liability, while Defense raised valid procedural challenges. The court has considered all arguments in reaching this verdict.` : 
  'No attorney arguments were presented for consideration.'}`;
      }
    } catch (apiError) {
      console.warn('⚠️  Enhanced AI API failed, using mock:', apiError.message);
      verdict = mockAIJudge(trialSummary);
    }

    console.log('✅ Enhanced AI Judge Verdict Generated');
    res.json({ 
      success: true,
      verdict,
      trialId: trialSummary.trialId,
      lawyerArgumentsConsidered: !!lawyerArguments,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('❌ Enhanced AI Judge Error:', error);
    res.status(500).json({ 
      success: false,
      error: 'Enhanced AI Judge service error: ' + error.message 
    });
  }
});

// 🔧 NEW: Health check endpoint
app.get('/health', (req, res) => {
  res.json({
    service: 'AI Judge',
    status: 'running',
    apis: {
      gemini: !!GEMINI_API_KEY,
      openai: !!OPENAI_API_KEY
    },
    timestamp: new Date().toISOString()
  });
});

// 🔧 ENHANCED: Better error handling and logging
app.use((error, req, res, next) => {
  console.error('🚨 Unhandled AI Judge Error:', error);
  res.status(500).json({
    success: false,
    error: 'Internal server error',
    message: process.env.NODE_ENV === 'development' ? error.message : undefined
  });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🏛️  AI Judge Service running on http://localhost:${PORT}`);
  console.log(`🔗 Health check: http://localhost:${PORT}/health`);
  console.log('⚖️  Ready to render verdicts with legal authority');
  
  if (!GEMINI_API_KEY && !OPENAI_API_KEY) {
    console.warn('⚠️  WARNING: No AI API keys configured. Using mock responses.');
    console.warn('   Set GEMINI_API_KEY or OPENAI_API_KEY for real AI analysis.');
  }
});

module.exports = app;