import { generateDietPlan } from "../services/openaiService.js";

export async function getDietPlan(req, res) {
  const { calories, diet } = req.query;

  if (isNaN(calories)) calories = 2000;

    if (calories < 1200) calories = 1200;
    if (calories > 2500) calories = 2500;

  try {
    const plans = await generateDietPlan(calories, diet);

    res.json({
      message: `Dos opciones de plan para ${calories} kcal (${diet || "normal"})`,
      options: plans, 
    });
  } catch (error) {
    console.error("Error al generar dieta:", error);

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
