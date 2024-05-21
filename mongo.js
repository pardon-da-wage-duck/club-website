require('dotenv').config();
const {MongoClient} = require('mongodb');
const uri = process.env.MONGODB_CONNECTION_URI;
const client = new MongoClient(uri);

