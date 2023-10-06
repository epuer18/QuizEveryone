import express from 'express';
import { connect } from '../database/db.js';

const router = express.Router();

router.post('/', async (req, res) => {
    const db = await connect();
    const quizData = req.body; // Ideally, validate this data first
    const result = await db.collection('quizzes').insertOne(quizData);
    res.json(result.ops[0]);
});

export default router;