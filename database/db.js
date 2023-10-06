import { MongoClient } from 'mongodb';

const MONGODB_URI = 'YOUR_MONGODB_CONNECTION_STRING';
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