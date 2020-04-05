var express = require('express');
var router = express.Router();
const {MongoClient} = require('../config');
const {MONGODB_URI} = require('../config');
const {dbName} = require('../config');
var bcrypt = require('bcrypt');
const {isUsernameValid} = require('../config');
var jwtUtils = require('../utils/jwt.utils');


router.post('/', async function(req, res){
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
  
    if (UserName == null || PassWord == null /*|| PassWordOk == null*/) {
        return res.status(400).json({'error': 'missing parameters'});
    }else if(PassWord.length <= 3) {
        return res.status(400).json({'error': 'Le mot de passe doit contenir au moins 4 caractères'});
    }else if(PassWord != PassWordOk) {
    //    return res.status(400).json({'error': 'Le mot de passe saisi est différent de la confirmation, veuilliez recommencer'});
    }else if(UserName.length <= 2 || UserName.length >= 21 ) {
        return res.status(400).json({'error': 'Votre identifiant doit contenir entre 2 et 20 caractères'});
    }else if(!isUsernameValid(UserName)) {
        return res.status(400).json({'error': 'identifiant ne doit contenir que des lettres minuscules non accentuées'});
    }
    
    let data = await col.find({}).toArray();
    console.log(data)
    if (data.some(data => data.UserName === req.body.UserName)) {
        return res.status(400).json({ 'error': 'Cet identifiant est déjà associé à un compte'});
    } else {
        bcrypt.hash(PassWord, 5, function(err, bcryptedPassWord){
            let user = {
                username: UserName,
                password: bcryptedPassWord,
            };
            col.insertOne(user, (err, result) => {
                if (err) {
                    console.log(err)
                    return res.status(500).json({ 'error': 'cannot add user'});
                } else {
                    //resolve({ data: { createdId: result.insertedId }, statusCode: 201 });
                    return res.status(201).json({ 'createdId': result.insertedId,
                    'token': jwtUtils.generateTokenForUser(UserName) })
                }
            });
        });

    }
    });

  module.exports = {router};