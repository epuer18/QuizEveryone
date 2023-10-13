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

// Update a quiz, done
router.put('/id', async (req, res) => {
  try {
      const updatedResult = await myDB.updateQuiz(req.query.id, req.body);
      const updatedCount = updatedResult.modifiedCount;
      if (updatedCount > 0) {
          res.json({ success: true, message: 'Quiz updated' });
      } else {
          res.status(404).json({ success: false, message: 'Quiz not found' });
      }
  } catch (error) {
      console.error('Error updating quiz:', error);
      res.status(500).json({ success: false, message: 'Internal Server Error' });
  }
});

// Delete a quiz, done
router.delete('/id', async (req, res) => {
  try {
      const result = await myDB.deleteQuiz(req.query.id);
      const deletedCount = result.deletedCount;
      if (deletedCount > 0) {
          res.json({ success: true, message: 'Quiz deleted' });
      } else {
          res.status(404).json({ success: false, message: 'Quiz not found' });
      }
  } catch (error) {
      console.error('Error deleting quiz:', error);
      res.status(500).json({ success: false, message: 'Internal Server Error' });
  }
});

export default router;
