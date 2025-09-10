import express from "express";
import { getDietPlan } from "../controllers/dietController.js";

const router = express.Router();

router.get("/", getDietPlan);

export default router;
