import express from "express";
import { getUser, updateUser } from "../controllers/userControllers.js";
import { verifyUser } from "../middlewares/verifyUser.js";

const router = express.Router();

router.post("/get-user", verifyUser, getUser);
router.put("/update-user", verifyUser, updateUser);

export default router;
