const express = require('express')
const app = express()
const MongoClient = require('mongodb').MongoClient;
const bddURL= process.env.MONGODB_URI || "mongodb+srv://root:root@cluster0-0vedk.mongodb.net/test?retryWrites=true&w=majority";
const client = new MongoClient(bddURL, { useNewUrlParser: true, useUnifiedTopology: true });
var dbName = 'notes-api'

// Parsing
app.use(express.json())

// GET method route
// GET method route
app.get('/', async function (req, res) {  
    
   
    res.send("Application note");
        
      

})


app.get('/notes', async function (req, res) {  

   
    
    try {
        await client.connect();
        console.log("Connected correctly to database");
        
        //var message = req.body.msg.split(' ')
        //console.log(message);
  
        const db = client.db(dbName);
       
  
        // Get the collection
        const col = db.collection('notes');
        // Get the documents that match the query
        const docs = await col.find().toArray();
        res.send(docs);
        
      } catch (err) {
        console.log(err.stack);
        console.log("fail to connect to database");
  
      }

})




var port = process.env.PORT || 3000;

app.listen(port, function () {
    console.log('Example app listening on port ', port)
})



