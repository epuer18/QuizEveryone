import express from 'express';
import myDB from '../database/db.js';

const router = express.Router();

router.post('/response', async (req, res) => {
    const responseData = req.body;
    try {
        const result = await myDB.insertResponse(responseData);
        res.status(201).json({ success: true, responseId: result.insertedId });
    } catch (error) {
        console.error('Error saving response:', error);
        res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
});


router.get('/feedback/responseId', async (req, res) => {
    try {
        const responseId = req.query.responseId;
        const feedbackData = await myDB.getResponseById(responseId);

        console.log("111" + req.query.responseId);

        console.log("reid" + responseId);

        console.log(feedbackData)

        const studentAnswers = feedbackData.quizResponses;
        // const correctAnswers = feedbackData.quizResponses.answer;

        let correctCount = 0;
        const detailedFeedback = [];

        console.log(studentAnswers);

        studentAnswers.forEach((studentAnswer) => {
            console.log(111111111111111111);
            console.log(studentAnswer);
            console.log(22222222222222222222);
            const isCorrect = studentAnswer.response === studentAnswer.answer;
            if (isCorrect) correctCount++;

            detailedFeedback.push({
                question: studentAnswer.question,
                studentAnswer: studentAnswer.response,
                correctAnswer: studentAnswer.answer,
                isCorrect: isCorrect
            });
        });

        const percentageCorrect = (correctCount / studentAnswers.length) * 100;

        // Return feedback to frontend
        res.json({
            success: true,
            percentageCorrect: percentageCorrect,
            feedback: detailedFeedback
        });

    } catch (error) {
        console.error('Error fetching feedback:', error);
        res.status(500).json({ success: false, message: 'Internal Server Error66666' });
    }
});

export default router;