import fs from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";
import { fetchDailyDiets } from "./openaiService.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const CACHE_DIR = path.resolve(__dirname, "..", "data");
const CACHE_FILE = path.join(CACHE_DIR, "diets_cache.json");
// una petición por día

let currentFetchPromise = null; // Deduplicar peticiones concurrentes

function todayDateString() {
  return new Date().toISOString().slice(0, 10); // YYYY-MM-DD
}

async function ensureCacheDir() {
  try {
    await fs.mkdir(CACHE_DIR, { recursive: true });
  } catch (e) {
    // ignore
  }
}

async function readCache() {
  try {
    const raw = await fs.readFile(CACHE_FILE, "utf8");
    return JSON.parse(raw);
  } catch (e) {
    return null;
  }
}

async function writeCache(obj) {
  await ensureCacheDir();
  const payload = {
    timestamp: Date.now(),
    date: todayDateString(),
    data: obj
  };
  await fs.writeFile(CACHE_FILE, JSON.stringify(payload, null, 2), "utf8");
}

export async function getDailyDiets(dietTypes = ["normal", "vegan", "vegetarian", "keto"]) {
  const cache = await readCache();
  const cacheDate = cache && cache.date ? cache.date : null;
  const today = todayDateString();

  // Si ya hay cache para hoy, devolverla
  if (cache && cacheDate === today && cache.data) {
    return cache.data;
  }

  if (currentFetchPromise) {
    return currentFetchPromise;
  }

  // Lanzar la petición y guardarla en memoria
  currentFetchPromise = (async () => {
    try {
      const fresh = await fetchDailyDiets(dietTypes);
      await writeCache(fresh);
      return fresh;
    } finally {
      currentFetchPromise = null;
    }
  })();

  return currentFetchPromise;
}

export async function forceRefreshDailyDiets(dietTypes = ["normal", "vegan", "vegetarian", "keto"]) {
  // Forzar refresco aunque ya exista cache para hoy
  if (currentFetchPromise) {
    await currentFetchPromise; // esperar a que termine la petición en curso
  }

  const fresh = await fetchDailyDiets(dietTypes);
  await writeCache(fresh);
  return fresh;
}
