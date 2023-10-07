import { MongoClient } from 'mongodb';
import dotenv from 'dotenv';

dotenv.config();

function myMongoDB(){
    const myDB = {};
    const MONGODB_URI = process.env.MONGODB_URI;
    const DB_NAME = "quizeveryone";
    const COllCECTION_QUIZ = "quiz";
    const COllCECTION_RESPONSE = "response";

    const client = new MongoClient(MONGODB_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true
    });
    
    myDB.connect = async function connect() {
        try {
            await client.db(DB_NAME).command({ serverStatus: 1 });
        } catch (error) {
            await client.connect();
            console.log('Connected to MongoDB');
        }
        return client.db(DB_NAME);
    }

    myDB.createQuiz = async (quiz) => {
        const db = await connect();
        const quizCol = db.collection(COllCECTION_QUIZ);
        const result = await quizCol.insertOne(quiz);
        console.log('Inserted quiz:', result);
        return result;
    }

    myDB.getQuizById = async (quizId) => {
        const db = await connect();
        const quizCol = db.collection(COllCECTION_QUIZ);
        const quiz = await quizCol.findOne({ _id: quizId });
        return quiz;
    }


    myDB.updateQuiz = async (quizId, updatedData) => {
        const db = await connect();
        const quizCol = db.collection(COllCECTION_QUIZ);
        const result = await quizCol.updateOne({ _id: quizId }, { $set: updatedData });
        console.log('Updated quiz:', result);
        return result;
    }


    myDB.deleteQuiz = async (quizId) => {
        const db = await connect();
        const quizCol = db.collection(COllCECTION_QUIZ);
        const result = await quizCol.deleteOne({ _id: quizId });
        console.log('Deleted quiz:', result);
        return result;
    }


    myDB.closeConnection = async () => {
        if (client.isConnected()) {
            await client.close();
        }
    }

    return myDB;
}

export default myMongoDB();



// const MONGODB_URI = process.env.MONGODB_URI;

// const client = new MongoClient(MONGODB_URI, {
//     useNewUrlParser: true,
//     useUnifiedTopology: true
// });

// async function connect() {
//     await client.connect();
//     console.log('Connected to MongoDB');
//     return client.db('quizeveryone');
// }

// export { connect };