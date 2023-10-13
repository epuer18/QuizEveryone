import express from "express";
import myDB from "../database/db.js";

const router = express.Router();

router.post("/response", async (req, res) => {
  const responseData = req.body;
  try {
    const result = await myDB.insertResponse(responseData);
    res.status(201).json({ success: true, responseId: result.insertedId });
  } catch (error) {
    console.error("Error saving response:", error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
});

router.get("/feedback/responseId", async (req, res) => {
  try {
    const responseId = req.query.responseId;
    const feedbackData = await myDB.getResponseById(responseId);

    const studentAnswers = feedbackData.quizResponses;

    let correctCount = 0;
    const detailedFeedback = [];

    studentAnswers.forEach((studentAnswer) => {
      const isCorrect = studentAnswer.response === studentAnswer.answer;
      if (isCorrect) correctCount++;

      detailedFeedback.push({
        question: studentAnswer.question,
        studentAnswer: studentAnswer.response,
        correctAnswer: studentAnswer.answer,
        isCorrect: isCorrect,
      });
    });

    const percentageCorrect = (correctCount / studentAnswers.length) * 100;

    res.json({
      success: true,
      percentageCorrect: percentageCorrect,
      feedback: detailedFeedback,
    });
  } catch (error) {
    console.error("Error fetching feedback:", error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
});

// // Delete a respond
// router.delete('/response', async (req, res) => {
//   try {
//       const result = await myDB.deleteResponseById(req.query.responseId);
//       const deletedCount = result.deletedCount;
//       if (deletedCount > 0) {
//           res.json({ success: true, message: 'Response deleted' });
//       } else {
//           res.status(404).json({ success: false, message: 'Response not found' });
//       }
//   } catch (error) {
//       console.error('Error deleting response:', error);
//       res.status(500).json({ success: false, message: 'Internal Server Error' });
//   }
// });

export default router;
