require('dotenv').config();
const {MongoClient} = require('mongodb');
const uri = process.env.MONGODB_CONNECTION_URI;
const client = new MongoClient(uri);
const fs = require("fs");

const jsonfile = 'bths-clubs.json';
const bthsclubs = fs.readFileSync(jsonfile, 'utf-8');
const clubs = JSON.parse(bthsclubs);

//mongodb constants
const clubsDatabase = 'Clubsdb';
const clubsCollection = 'clubs';

//function to upload all the data stored in the json file onto mongodb database
async function uploadData(array){
    try {
        await client.connect();
    
        // insert several json documents into mongodb database
        const result = client.db(clubsDatabase).collection(clubsCollection).insertMany(array, {ordered: true});

        console.log('total number of json objects inserted:', (await result).insertedCount);

      } finally {
        // Close the database connection when finished or an error occurs
        await client.close();
      }
}


async function updateData(){
    try {
        await client.connect();
    
        // insert several json documents into mongodb database
        const result = await client.db(clubsDatabase).collection(clubsCollection).updateMany(
            {},
            {$set: {
            "club_logo": "https://www.bths.edu/pics/header_logo.png",
            "description": "A valid description of the club is currently unavailable.",
            "members": 0
            }}
        )

        console.log('total number of json objects inserted:', result.upsertedCount);

      } finally {
        // Close the database connection when finished or an error occurs
        await client.close();
      }
}

/**
 * Searches and returns the documents from mongodb database that matches the filter
 * @param query a JSON object containing the search criteria, ex: {"field_name": value, "filed_name": value}
 * @param output a JSON object containing specified fields to be returned 
 * documentation: https://www.mongodb.com/docs/manual/reference/method/db.collection.find/#std-label-method-find-projection
 */
async function findClubs(query, output){
  try {
    await client.connect();
    const cursor = await client.db(clubsDatabase).collection(clubsCollection).find(query, output).limit(10);
    const result = await cursor.toArray();
    console.log(result)
    return result;
  } finally {
    // Close the database connection when finished or an error occurs
    await client.close();
  }
}

async function main(){
  const filter = {"meeting_days": "Wednesdays"};
  const options = {projection: {"club": 1}};
  const response = await findClubs(filter, options);
  // console.log(response);
}

main();

//code used to convert csv file to a json file
// let csvToJson = require('convert-csv-to-json');

// let fileInputName = 'bths clubs.csv'; 
// let fileOutputName = 'bths-clubs.json';

// csvToJson.fieldDelimiter(',')
//             .parseSubArray("*",',')
//             .supportQuotedField(true)
//             .generateJsonFileFromCsv(fileInputName,fileOutputName);

