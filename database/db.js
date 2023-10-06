import { MongoClient } from 'mongodb';
import dotenv from 'dotenv';

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI;
const client = new MongoClient(MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

async function connect() {
    await client.connect();
    console.log('Connected to MongoDB');
    return client.db('quizeveryone');
}

export { connect };