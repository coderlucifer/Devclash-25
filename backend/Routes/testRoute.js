import express from "express";
import { getQuestions ,testFinished ,getFormattedTestData} from "../controllers/testController.js";


const router = express.Router();

router.post("/fetchquestions/:difficulty/:subject/:standard",getQuestions)
router.post("/finish",testFinished);
//router.get("/gettest",getTests)
router.get('/gettestdata', getFormattedTestData)


export default router