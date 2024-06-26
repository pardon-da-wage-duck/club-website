require('dotenv').config();
const http = require('http');
const {MongoClient} = require('mongodb');

//mongodb constants
const uri = process.env.MONGODB_CONNECTION_URI;
const client = new MongoClient(uri);
const clubsDatabase = 'Clubsdb';
const clubsCollection = 'clubs';
client.connect();

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

const port = 8081;
http.createServer(function (req, res) {
  let body = "";
  req.on('data', chunk => {
    console.log('Received chunk: ', chunk.toString()); //comment out later
    body += chunk.toString();
  });
  req.on('end', async () => {
    console.log('Final body string: ', body); //comment out later
    try {
      body = JSON.parse(body);

      res.writeHead(200, {
        'Content-Type': 'text/html', 
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE',
        'Access-Control-Allow-Headers': 'Content-Type'
      });

      switch (body.request) {
        case "loadCatalog":
          setTimeout(function(){
            response = findClubs({}, {projection: {"club": 1}}).toArray;
            console.log(response);
            res.write(response);
          }, 900);
        
          break;
        case "request_name":
          //function
          break;
      }

      res.end();
    }

    catch (error) {
      console.error('Error handling request:', error);
      if (!res.headersSent) {
        res.writeHead(500, {'Content-Type': 'application/json'});
        res.end(JSON.stringify({ error: "Internal Server Error" }));
      } else {
        res.end();
      }
    }

  });
}).listen(port, () => {
  console.log(`server listening on port ${port}`);
});
