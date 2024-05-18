import express from "express";
import {
  createJob,
  deleteJobPost,
  getJobById,
  getJobPosts,
  updateJob,
} from "../controllers/jobControllers.js";
import { verifyUser } from "../middlewares/verifyUser.js";

const router = express.Router();

router.post("/upload-job", verifyUser, createJob);
router.put("/update-job/:jobId", verifyUser, updateJob);

// GET JOB POST
router.get("/find-jobs", getJobPosts);
router.get("/get-job-detail/:id", getJobById);

// DELETE JOB POST
router.delete("/delete-job/:id", verifyUser, deleteJobPost);

export default router;
