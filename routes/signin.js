var express = require('express');
var router = express.Router();
const {MongoClient} = require('../config');
const {MONGODB_URI} = require('../config');
const {dbName} = require('../config');

router.post('/', async function(req, res){
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
  
  
  
  module.exports = {router};