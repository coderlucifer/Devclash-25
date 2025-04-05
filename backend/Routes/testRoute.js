import express from "express";
import { getQuestions ,testFinished} from "../controllers/testController.js";


const router = express.Router();

router.post("/fetchquestions/:difficulty/:subject/:standard",getQuestions)
router.post("/finish",testFinished);


export default router