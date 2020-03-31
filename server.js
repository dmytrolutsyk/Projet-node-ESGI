const express = require('express')
const app = express()
const MongoClient = require('mongodb').MongoClient;
const bddURL= process.env.MONGODB_URI || "mongodb+srv://root:root@cluster0-0vedk.mongodb.net/test?retryWrites=true&w=majority";
const client = new MongoClient(bddURL, { useNewUrlParser: true, useUnifiedTopology: true });
var dbName = 'notes-api'

var bcrypt = require('bcrypt');
var jwtUtils = require('./utils/jwt.utils');


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


app.post('/signup', async function(req, res){
  // Params
  var UserName = req.body.UserName;
  var PassWord = req.body.PassWord;
  var PassWordOk = req.body.PassWordOk;

  //connecion bdd
  const client = new MongoClient(MONGODB_URI, {userNewUrlParser: true});
  await client.connect();
  const db = client.db(dbName);
  const col = db.collection('users');
  console.log('Connected\n');

  if (UserName == null || PassWord == null || PassWordOk == null) {
      return res.status(400).json({'error': 'missing parameters'});
  }

  await col.findOne({
      attributes: ['UserName'],
      where: { UserName: UserName}
  })
  .then(function(userFound){
      if(!userFound) {
          Sbcrypt.hash(PassWord, 5, function(err, bcryptedPassWord){
              var newUser = models.User.create({
                  UserName: UserName,
                  PassWord: bcryptedPassWord,
                  PassWordOk: bcryptedPassWord
              })
              .then(function(newUser) {
                  return res.status(201).json({
                      'userId': newUser.id
                  })
              })
              .catch(function(err) {
                  return res.status(500).json({ 'error': 'cannot add user'});
              });                
          });

      } else {
          return res.status(409).json({ 'error': 'user already exit'});
      }
  })
  .catch(function(err) {
      return res.status(500).json({ 'error': 'unable to verify' });
  })


});


app.post('/signin', async function(req, res){
  //Params
  var UserName = req.body.UserName;
  var PassWord = req.body.PassWord;

  //connecion bdd
  const client = new MongoClient(MONGODB_URI, {userNewUrlParser: true});
  await client.connect();
  const db = client.db(dbName);
  const col = db.collection('users');
  console.log('Connected\n');

  if (UserName == null || PassWord == null){
      return res.status(400).json({ 'error' : 'missing parameters' });
  }

  await col.findOne({
      where: { UserName: UserName}
  })
  .then(function(userFound) {
      if (userFound){
          bcrypt.compare(PassWord, userFound.PassWord, function(errBycrypt, resBycrypt) {
              if (resBycrypt) {
                  return res.status(200).json({
                      'UserId': userFound.id,
                      'token': jwtUtils.generateTokenForUser(userFound)
                  });
              } else {
                  return res.status(403).json({ "error": "invalid password"});
              }
          });

      } else {
          return res.status(404).json({ 'error': 'user not exit in DB' });
      }
  })
  .catch(function(err){
      return res.status(500).json({ 'error': 'unable to verify user' });
  });
});




var port = process.env.PORT || 3000;

app.listen(port, function () {
    console.log('Example app listening on port ', port)
})



