import { generateDietPlan } from "../services/openaiService.js";

export async function getDietPlan(req, res) {
  const { calories, diet } = req.query;

  try {
    const plan = await generateDietPlan(calories, diet);
    res.json({
      message: `Plan para ${calories || "2000"} kcal (${diet || "normal"})`,
      plan,
    });
  } catch (error) {
    console.error("Error al generar dieta:", error);

    // Manejo específico de errores de OpenAI
    if (error.code === "insufficient_quota" || error.status === 429) {
      res.status(429).json({
        error: "Se ha alcanzado el límite de uso de la API. Intenta más tarde.",
      });
    } else {
      res.status(500).json({
        error: "Ocurrió un error inesperado al generar la dieta.",
      });
    }
  }
}
