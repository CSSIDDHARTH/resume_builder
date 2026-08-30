import express from "express";
import protect from "../middlewares/authMiddleWare.js";
import { enhanceProjectDescription , enhanceJobDescription, enhanceProfessioanlSummary, uploadResume, analyzeResume } from "../controller/aiController.js";

const aiRouter = express.Router();

aiRouter.post('/enhance-pro-sum' , protect , enhanceProfessioanlSummary)
aiRouter.post('/enhance-job-desc' , protect , enhanceJobDescription)
aiRouter.post('/upload-resume' , protect , uploadResume)
aiRouter.post('/enhance-project-desc' , protect , enhanceProjectDescription)
aiRouter.post('/analyze-resume', protect, analyzeResume)

export default aiRouter