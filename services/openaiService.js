import dotenv from "dotenv";
dotenv.config({ path: "key.env" });

const GROQ_API_URL = "https://api.groq.com/openai/v1/chat/completions";
const GROQ_API_KEY = process.env.GROQ_API_KEY;

export async function generateDietPlan(calories = 2000, diet = "normal") {

  const prompt = `
    Genera **dos planes de dieta equilibrada** diferentes con desayuno, almuerzo y cena.
    Calorías aproximadas: ${calories}.
    Tipo de dieta: ${diet}.
    Devuélvelos en formato JSON válido como un array con dos objetos, ejemplo:
    [
      { "breakfast": "...", "lunch": "...", "dinner": "..." },
      { "breakfast": "...", "lunch": "...", "dinner": "..." }
    ]
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
        max_completion_tokens: 700
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

export async function fetchDailyDiets(dietTypes = ["normal", "vegan", "vegetarian", "keto"]) {
  const prompt = `
    Devuelve un objeto JSON con claves para cada tipo de dieta: ${dietTypes.join(", ")}. 
    Cada valor debe ser un array de 3 objetos (exactamente 3) con las propiedades: "breakfast", "lunch", "dinner".
    Cada comida debe ser una cadena corta describiendo platos reales y aproximación calórica por comida, incluido los gramos por ingrediente.
    Estructura de ejemplo (debe respetarse JSON válido):
    {
      "normal": [
        { "breakfast": "...", "lunch": "...", "dinner": "..." },
        { "breakfast": "...", "lunch": "...", "dinner": "..." },
        { "breakfast": "...", "lunch": "...", "dinner": "..." }
      ],
      "vegan": [ ... ],
      "vegetarian": [ ... ],
      "keto": [ ... ]
    }
    Solo devuelve el JSON puro, sin texto adicional.
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
        max_completion_tokens: 1000
      })
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error("Detalles del error (fetchDailyDiets):", errorData);
      throw new Error(`Error de API: ${response.status} – ${JSON.stringify(errorData)}`);
    }

    const data = await response.json();
    const rawText = String(data.choices?.[0]?.message?.content || '').trim();
    console.log("Respuesta cruda fetchDailyDiets:", rawText);

    function extractJson(text) {
      if (!text) return text;
      const fenceRegex = "/```(?:json)?\s*([\s\S]*?)```/i";
      const fenceMatch = text.match(fenceRegex);
      if (fenceMatch && fenceMatch[1]) return fenceMatch[1].trim();

      const first = text.indexOf('{');
      const last = text.lastIndexOf('}');
      if (first !== -1 && last !== -1 && last > first) {
        return text.slice(first, last + 1).trim();
      }

      return text;
    }

    const cleaned = extractJson(rawText);

    let parsed;
    try {
      parsed = JSON.parse(cleaned);
    } catch (err) {
      console.error("Error parsing JSON from fetchDailyDiets. Cleaned text:\n", cleaned);
      const e = new Error(`Respuesta de la API no es JSON válido: ${err.message}`);
      e.raw = rawText;
      e.cleaned = cleaned;
      throw e;
    }

    const result = {};
    for (const t of dietTypes) {
      if (Array.isArray(parsed[t]) && parsed[t].length >= 3) {
        result[t] = parsed[t].slice(0, 3);
      } else {
        result[t] = [
          { breakfast: "Desayuno estándar", lunch: "Almuerzo estándar", dinner: "Cena estándar" },
          { breakfast: "Desayuno alternativo", lunch: "Almuerzo alternativo", dinner: "Cena alternativo" },
          { breakfast: "Desayuno extra", lunch: "Almuerzo extra", dinner: "Cena extra" }
        ];
      }
    }

    return result;

  } catch (error) {
    console.error("Error completo con Groq API (fetchDailyDiets):", error.message);
    throw error;
  }
}
