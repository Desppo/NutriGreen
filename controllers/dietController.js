import { getDailyDiets } from "../services/dietCache.js";

function pickTwoRandom(arr) {
  if (!Array.isArray(arr)) return [];
  const n = arr.length;
  if (n === 0) return [];
  if (n === 1) return [arr[0]];
  let i = Math.floor(Math.random() * n);
  let j = Math.floor(Math.random() * (n - 1));
  if (j >= i) j = j + 1;
  return [arr[i], arr[j]];
}

export async function getDietPlan(req, res) {
  let calories = parseInt(req.query.calories) || 2000;
  const diet = req.query.diet || "normal";

  if (isNaN(calories)) calories = 2000;
  if (calories < 1200) calories = 1200;
  if (calories > 2500) calories = 2500;

  try {
    const allDiets = await getDailyDiets();
    const forDiet = allDiets[diet] || allDiets["normal"] || [];

    const options = pickTwoRandom(forDiet);

    res.json({
      message: `Dos opciones de plan para ${calories} kcal (${diet})`,
      options,
    });
  } catch (error) {
    console.error("Error al obtener dietas:", error);

    if (error.code === "insufficient_quota" || error.status === 429) {
      res.status(429).json({
        error: "Se ha alcanzado el límite de uso de la API. Intenta más tarde.",
      });
    } else {
      res.status(500).json({
        error: "Ocurrió un error inesperado al obtener las dietas.",
      });
    }
  }
}
