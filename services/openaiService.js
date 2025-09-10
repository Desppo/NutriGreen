import dotenv from "dotenv";
dotenv.config({ path: "key.env" });

const GROQ_API_URL = "https://api.groq.com/openai/v1/chat/completions";
const GROQ_API_KEY = process.env.GROQ_API_KEY;

export async function generateDietPlan(calories = 2000, diet = "normal") {
  const prompt = `
    Genera un plan de dieta equilibrada con desayuno, almuerzo y cena.
    Calorías aproximadas: ${calories}.
    Tipo de dieta: ${diet}.
    Devuélvelo en formato JSON válido: 
    { "breakfast": "...", "lunch": "...", "dinner": "..." }
    Solo devuelve el JSON, sin texto adicional.
  `;

  try {
    const response = await fetch(GROQ_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${GROQ_API_KEY}`
      },
      body: JSON.stringify({
        model: "llama-3.3-70b-versatile",
        messages: [{ role: "user", content: prompt }],
        temperature: 0.7,
        max_completion_tokens: 500,
        response_format: { type: "json_object" }
      })
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error("Detalles del error:", errorData);
      throw new Error(`Error de API: ${response.status} – ${JSON.stringify(errorData)}`);
    }

    const data = await response.json();
    const text = data.choices[0].message.content.trim();

    console.log("Respuesta cruda:", text);
    return JSON.parse(text);

  } catch (error) {
    console.error("Error completo con Groq API:", error.message);
    throw error;
  }
}
