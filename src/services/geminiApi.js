const FINANCE_GUARDRAIL_PROMPT = `
You are a financial assistant for Finsure, a business focused on insurance and financial services.

STRICT RULES:
1. ONLY answer questions related to: finance, insurance, investments, loans, mortgages, financial planning, business finance, risk management, and related financial topics.
2. If a question is NOT finance-related, respond EXACTLY with: "I can only assist with finance and insurance-related questions. Please ask about financial planning, insurance, investments, loans, or other financial topics."
3. Keep responses professional, accurate, and business-focused.
4. Prioritize practical, actionable financial advice.
5. Do not engage with off-topic conversations.
`;

const isFinanceRelated = (prompt) => {
  const financeKeywords = [
    'insurance', 'finance', 'loan', 'mortgage', 'investment', 'bank', 'credit',
    'debt', 'savings', 'retirement', 'tax', 'premium', 'policy', 'claim',
    'interest', 'rate', 'budget', 'wealth', 'asset', 'liability', 'equity',
    'portfolio', 'stock', 'bond', 'mutual fund', 'risk', 'coverage', 'premium',
    'deductible', 'annuity', 'pension', 'financial', 'money', 'payment',
    'calculator', 'emi', 'sip', 'term', 'life', 'health', 'auto', 'home'
  ];
  
  const lowerPrompt = prompt.toLowerCase();
  return financeKeywords.some(keyword => lowerPrompt.includes(keyword));
};

export const callGemini = async (prompt, systemPrompt = '') => {
  const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
  const apiUrl = import.meta.env.VITE_GEMINI_API_URL;
  
  console.log('Environment check:', {
    hasApiKey: !!apiKey,
    hasApiUrl: !!apiUrl,
    apiKeyLength: apiKey?.length,
    apiUrl: apiUrl
  });
  
  if (!apiKey) {
    console.error('Gemini API key is not configured');
    console.error('Available env vars:', Object.keys(import.meta.env));
    return "API key is not configured. Please check your environment settings.";
  }
  
  if (!apiUrl) {
    console.error('Gemini API URL is not configured');
    return "API URL is not configured. Please check your environment settings.";
  }
  
  if (!isFinanceRelated(prompt)) {
    return "I can only assist with finance and insurance-related questions. Please ask about financial planning, insurance, investments, loans, or other financial topics.";
  }
  
  const url = `${apiUrl}?key=${apiKey}`;

  console.log(url);
  
  const combinedSystemPrompt = FINANCE_GUARDRAIL_PROMPT + (systemPrompt ? '\n\n' + systemPrompt : '');
  
  const payload = {
    contents: [{ parts: [{ text: prompt }] }],
    systemInstruction: { parts: [{ text: combinedSystemPrompt }] }
  };

  const delays = [1000, 2000, 4000, 8000, 16000];
  
  for (let i = 0; i <= 5; i++) {
    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      
      if (!response.ok) {
         if (i < 5) {
            await new Promise(r => setTimeout(r, delays[i]));
            continue;
         }
         throw new Error(`API Error: ${response.status}`);
      }

      const data = await response.json();
      return data.candidates?.[0]?.content?.parts?.[0]?.text || "I couldn't generate a response at this time.";
    } catch {
      if (i === 5) return "Sorry, our AI service is currently busy. Please try again later.";
    }
  }
};
