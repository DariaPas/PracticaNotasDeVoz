const { MongoClient } = require('mongodb');



// MongoDB connection URI
const mongoURI = 'mongodb://localhost:27017/grabaciones';

const handleList = async (id) => {
  // Create a MongoDB client
  const client = new MongoClient(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true });

  try {
    // Connect to the MongoDB server
    await client.connect();

    // Access the database
    const database = client.db();

    // Access the collection (assuming a collection named 'audioFiles')
    const collection = database.collection('users');

    // Query the database to get the latest 5 audio files for the given user ID
    const userAudioFiles = await collection
      .find({ userId: id })
      .sort({ date: -1 }) // Sort by date in descending order (most recent first)
      .limit(5) // Limit the result to 5 documents
      .toArray();

    // Create the JSON response
    const jsonResponse = {
      files: userAudioFiles.map(({ filename, date }) => ({ filename, date })),
    };

    return jsonResponse;
  } finally {
    // Close the MongoDB client
    await client.close();
  }
};


module.exports = { handleList };