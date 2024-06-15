
const { MongoClient, ServerApiVersion } = require('mongodb');
const uri = "mongodb+srv://admin:03YSVWXKVciXY1MP@main.mxumxrl.mongodb.net/?retryWrites=true&w=majority&appName=Main";

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

export async function dbconnect() {
    if (!client.isConnected()) await client.connect();
    return client.db('Main');
}