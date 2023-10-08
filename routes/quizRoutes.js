import express from "express";
import myDB from "../database/db.js";

const router = express.Router();

router.post("/create", async (req, res) => {
  console.log(req.body);
  try {
    const result = await myDB.createQuiz(req.body);
    res.status(201).json({ success: true, quizId: result.insertedId });
  } catch (error) {
    console.error("Error creating quiz:", error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
});

router.get("/id", async (req, res) => {
  console.log(req.query.id);
  try {
    const quiz = await myDB.getQuizById(req.query.id);
    if (quiz) {
      res.json(quiz);
    } else {
      res.status(404).json({ success: false, message: "Quiz not found" });
    }
  } catch (error) {
    console.error("Error fetching quiz:", error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
});

export default router;
