import express from "express";
import { rateLimit } from "express-rate-limit";
import {
  getCompanies,
  getCompanyById,
  getCompanyJobListing,
  getCompanyProfile,
  register,
  login,
  updateCompanyProfile,
} from "../controllers/companyControllers.js";
import { verifyUser } from "../middlewares/verifyUser.js";

const router = express.Router();

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per `window` (here, per 15 minutes)
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
});

router.post("/register", limiter, register);
router.post("/login", limiter, login);

// GET DATA
router.post("/get-company-profile", verifyUser, getCompanyProfile);
router.post("/get-company-joblisting", verifyUser, getCompanyJobListing);
router.get("/", getCompanies);
router.get("/get-company/:id", getCompanyById);

// UPDATE DATA
router.put("/update-company", verifyUser, updateCompanyProfile);

export default router;
