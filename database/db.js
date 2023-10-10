import { MongoClient, ObjectId } from "mongodb";
import dotenv from "dotenv";

dotenv.config();

function myMongoDB() {
  const myDB = {};
  const MONGODB_URI = process.env.MONGODB_URI;
  const DB_NAME = "quizeveryone";
  const COllCECTION_QUIZ = "quiz";
  const COllCECTION_RESPONSE = "response";

  const client = new MongoClient(MONGODB_URI);

  async function connect() {
    try {
      await client.db(DB_NAME).command({ serverStatus: 1 });
    } catch (error) {
      await client.connect();
      console.log("Connected to MongoDB");
    }
    return client.db(DB_NAME);
  }

  myDB.createQuiz = async (quiz) => {
    const db = await connect();
    const quizCol = db.collection(COllCECTION_QUIZ);
    const result = await quizCol.insertOne(quiz);
    console.log("Inserted quiz:", result);
    return result;
  };

  myDB.getQuizById = async (quizId) => {
    const db = await connect();
    const quizCol = db.collection(COllCECTION_QUIZ);
    const quiz = await quizCol.findOne({ _id: new ObjectId(quizId) });
    return quiz;
  };

  myDB.insertResponse = async (responseData) => {
    const db = await connect();
    const responseCol = db.collection(COllCECTION_RESPONSE);
    const result = await responseCol.insertOne(responseData);
    console.log("Response Submitted:", result);
    return result;
  };

  myDB.getResponseById = async (responseId) => {
    const db = await connect();
    const responseCol = db.collection(COllCECTION_RESPONSE);
    return await responseCol.findOne({ _id: new ObjectId(responseId) });
  };

  myDB.closeConnection = async () => {
    if (client.isConnected()) {
      await client.close();
    }
  };

  myDB.connect = connect;
  return myDB;
}

export default myMongoDB();
