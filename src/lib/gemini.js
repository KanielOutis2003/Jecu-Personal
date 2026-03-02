const API_KEY = import.meta.env.VITE_GEMINI_API_KEY 
const GEMINI_MODEL = "gemini-2.0-flash";

export async function callGemini(prompt, system = "") { 
  const res = await fetch( 
    `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent?key=${API_KEY}`, 
    { 
      method: "POST", 
      headers: { "Content-Type": "application/json" }, 
      body: JSON.stringify({ 
        systemInstruction: { parts: [{ text: system || "You are a helpful assistant for a student. Be concise, practical, and friendly. Use simple language." }] }, 
        contents: [{ role: "user", parts: [{ text: prompt }] }], 
        generationConfig: { maxOutputTokens: 1000, temperature: 0.7 } 
      }) 
    } 
  ) 
  const data = await res.json() 
  return data.candidates?.[0]?.content?.parts?.[0]?.text || "Error" 
}
