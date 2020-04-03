var express = require('express');
var router = express.Router();
const {MongoClient} = require('../config');
const {MONGODB_URI} = require('../config');
const {dbName} = require('../config');

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

  module.exports = {router};