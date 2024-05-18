import express from "express";
import { rateLimit } from "express-rate-limit";
import { register, login } from "../controllers/authControllers.js";

const router = express.Router();
const limiter = rateLimit({
  windowMs: 1000 * 60 * 15,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
});

router.post("/register", limiter, register);
router.post("/login", limiter, login);

export default router;
