//Imports

var bcrypt = require('bcrypt');
var jwtUtils = require('../utils/jwt.utils');
var models = require('../models');


//Routes

module.exports = {
    signup: function(req, res){
        // Params
        var UserName = req.body.UserName;
        var PassWord = req.body.PassWord;
        var PassWordOk = req.body.PassWordOk;

        if (UserName == null || PassWord == null || PassWordOk == null) {
            return res.status(400).json({'error': 'missing parameters'});
        }

        models.User.findOne({
            attributes: ['UserName'],
            where: { UserName: UserName}
        })
        .then(function(userFound){
            if(!userFound) {
                bcrypt.hash(PassWord, 5, function(err, bcryptedPassWord){
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


    },
    signin: function(req, res){
        //Params
        var UserName = req.body.UserName;
        var PassWord = req.body.PassWord;

        if (UserName == null || PassWord == null){
            return res.status(400).json({ 'error' : 'missing parameters' });
        }

        models.User.findOne({
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
    }
}

