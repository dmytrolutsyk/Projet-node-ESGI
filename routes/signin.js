var express = require('express');
var jwtUtils = require('../utils/jwt.utils');
var bcrypt = require('bcrypt');
var router = express.Router();
const {MongoClient} = require('../config');
const {MONGODB_URI} = require('../config');
const {dbName} = require('../config');
const {isUsernameValid} = require('../config');


router.post('/', async function(req, res){
    //Params
    var UserName = req.body.UserName;
    var PassWord = req.body.PassWord;
    var UserFound = null;
    var UserPassWord = null;
    var UserId = null;
  
    //connecion bdd
    const client = new MongoClient(MONGODB_URI, {userNewUrlParser: true});
    await client.connect();
    const db = client.db(dbName);
    const col = db.collection('users');
    console.log('Connected\n');

    if (UserName == null || PassWord == null){
        return res.status(400).json({ 'error' : 'missing parameters' });
    }else if(PassWord.length <= 3) {
        return res.status(400).json({'error': 'Le mot de passe doit contenir au moins 4 caractères'});
    }else if(UserName.length <= 2 || UserName.length >= 21 ) {
        return res.status(400).json({'error': 'Votre identifiant doit contenir entre 2 et 20 caractères'});
    }else if(!isUsernameValid(UserName)) {
        return res.status(400).json({'error': 'identifiant ne doit contenir que des lettres minuscules non accentuées'});
    }

    let data = await col.find({}).toArray();
    console.log('req.body.UserName:', req.body.UserName)
    if (data.some(data => data.username === req.body.UserName)) {
        console.log("ok")
        data.forEach(element => {
            if(element.username === req.body.UserName){
               console.log("zebi")
               userFound = req.body.UserName
            //    UserFound = data.UserName;
               UserPassWord = element.password;
               UserId = element._id;
               console.log(UserFound, UserPassWord, UserId)
            }
        });
        bcrypt.compare(PassWord, UserPassWord, function(errBycrypt, resBycrypt) {
            if (resBycrypt) {
                return res.status(200).json({
                    'UserId': UserId,
                    'token': jwtUtils.generateTokenForUser(UserName)
                });
            } else {
                return res.status(403).json({ "error": "invalid password"});
            }
        });
    }else {
            return res.status(403).json({ 'error': 'Cet identifiant est inconnu' });
        }
    });

  
  
  
  module.exports = {router};