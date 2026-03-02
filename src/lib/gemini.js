const API_KEY = import.meta.env.VITE_GEMINI_API_KEY 
const GEMINI_MODEL = "gemini-2.0-flash";

export async function callGemini(prompt, system = "") { 
  if (!API_KEY) return "Gemini API key is missing. Please add it to your .env file.";
  
  try {
    const res = await fetch( 
      `https://generativelanguage.googleapis.com/v1/models/gemini-1.5-flash:generateContent?key=${API_KEY}`, 
      { 
        method: "POST", 
        headers: { "Content-Type": "application/json" }, 
        body: JSON.stringify({ 
          contents: [{ 
            parts: [{ 
              text: (system ? `System Instruction: ${system}\n\n` : "") + prompt 
            }] 
          }]
        }) 
      } 
    );
    const data = await res.json();
    
    if (data.error) {
      console.error("Gemini API Error:", data.error);
      return `AI Error: ${data.error.message}`;
    }

    return data.candidates?.[0]?.content?.parts?.[0]?.text || "No response from AI.";
  } catch (err) {
    console.error("Gemini Fetch Error:", err);
    return "Failed to connect to AI service.";
  }
}
