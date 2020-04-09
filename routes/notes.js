var express = require('express');
var router = express.Router();
const {MongoClient} = require('../config');
const {MONGODB_URI} = require('../config');
const {dbName} = require('../config');
const {dateNow} = require('../config');
const {jwt} = require('../config');
const {JWT_SIGN_SECRET} = require('../config');
var ObjectId = require('mongodb').ObjectID;


/* GET NOTES */
router.get('/', async function(req, res) {
    var token = req.get('Authorization');
    jwt.verify(token, JWT_SIGN_SECRET, async (err, data) => {
        
        if (err) {
            res.status(401).send('Utilisateur non connecté');
        } else {    
            console.log("gere")
            const client = new MongoClient(MONGODB_URI, {useNewUrlParser: true});
                try {
                    console.log("test");
                    await client.connect();
                    let userID =  data.userId;
                    console.log(userID)
                    console.log(data.username)
                    const db = client.db(dbName);
                    const col = db.collection('notes');console.log('Connected\n');
                    //Display all datas of the collection
                    console.log('Displaying datas\n');
                    let results = await col.find({ userID: userID}).sort({ _id: -1}).toArray();
                    res.send({
                        error: null,
                        notes: results
                    });
                } catch (err) {
                    res.send({
                        error: err
                    });
                }
                client.close();
            
        }
    });
    
});

/* PUT A NOTE */
router.put('/', async function(req, res) {
    var token = req.get('Authorization');
    jwt.verify(token, JWT_SIGN_SECRET, async (err, data) => {
        if (err) {
            res.status(401).send('Utilisateur non connecté');
        } else {    

            const client = new MongoClient(MONGODB_URI, {useNewUrlParser: true});

                await client.connect();
                const db = client.db(dbName);
                const col = db.collection('notes');
                console.log('Connected\n');
                
                //INSERT ONE DOCUMENT
                let userID = data.userId;

                let content = req.body.content;

                console.log(content);
                console.log(userID);
                let createdAt = dateNow();
                let lastUpdatedAt = null;
                if(content.length === 0){
                    res.status(400).send({error: 'Aucun contenu n\'a été saisi'});
                } else {
                    let resInsert = await col.insertOne({
                        userID,
                        content,
                        createdAt,
                        lastUpdatedAt
                    });
                    let note = resInsert.ops[0];
                    res.send({
                        error: null,
                        note
                    });
                }
        
                client.close();
        }
    });

});

/* Patch A NOTE */
router.patch('/:id', async function(req, res) {
    var token = req.get('Authorization');
    jwt.verify(token, JWT_SIGN_SECRET, async (err, data) => {
        if (err) {
            res.status(401).send('Utilisateur non connecté');
        } else {

            const client = new MongoClient(MONGODB_URI, {useNewUrlParser: true});
            await client.connect();
            const db = client.db(dbName);
            const col = db.collection('notes');
            console.log('Connected\n');

            let content = req.body.content;

            let lastUpdatedAt = dateNow();

            if(content.length === 0){
                res.status(400).send({error: 'Aucun contenu n\'a été saisi'});
            } else {
                const note = await col.findOne({_id: ObjectId(req.params.id)});
                if (!note){
                    res.status(400).send({error: 'Aucune note n\'a été trouvee'});
                } else {
                    await col.updateOne(
                        {_id: ObjectId(req.params.id)},
                        {$set: {content: req.body.content, lastUpdatedAt: lastUpdatedAt}}
                    );
                    const newNote = await col.findOne({_id: ObjectId(req.params.id)});
                    res.status(200).send({
                        error: null,
                        note: newNote
                    });
                }
            }

            client.close();

        }
    });
});


/* Delete A NOTE */
router.delete('/:id', async function(req, res) {
    var token = req.get('Authorization');
    jwt.verify(token, JWT_SIGN_SECRET, async (err, data) => {
        if (err) {
            res.status(401).send('Utilisateur non connecté');
        } else {
            const client = new MongoClient(MONGODB_URI, {useNewUrlParser: true});
            try {
                await client.connect();
                const db = client.db(dbName);
                const col = db.collection('notes');
                //DELETE ONE DOCUMENT
                let id_note = req.params.id;
                let noteResults = await col.find().toArray();
                let resultForEach = 0;
                console.log("notes",noteResults);
                let noteToBeDeleted;
                noteResults.forEach(function (resForEach) {
                    if(resForEach._id.equals(id_note)){
                        resultForEach = 1;
                        noteToBeDeleted = resForEach;
                    }
                });
                if(resultForEach === 0) {
                    res.status(404).send({error: 'Cet identifiant est inconnu'});
                } else if(noteToBeDeleted.userID !== data.userId){
                    res.status(403).send({error: 'Accès non autorisé à cette note'})
                } else {
                    await col.deleteOne({_id: noteToBeDeleted._id});
                    res.send({
                        error: null
                    });
                }
            } catch (err) {
                res.send({
                    error: err
                });
            }
            client.close();
        }
    });
});


module.exports = {router};