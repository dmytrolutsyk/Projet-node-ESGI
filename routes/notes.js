var express = require('express');
var router = express.Router();
const {MongoClient} = require('../config');
const {MONGODB_URI} = require('../config');
const {dbName} = require('../config');
const {dateNow} = require('../config');
var ObjectId = require('mongodb').ObjectID;


/* GET NOTES */
router.get('/', async function(req, res) {
        
    const client = new MongoClient(MONGODB_URI, {useNewUrlParser: true});
    try {
        await client.connect();
        const db = client.db(dbName);
        const col = db.collection('notes');console.log('Connected\n');
        //Display all datas of the collection
        console.log('Displaying datas\n');
        let results = await col.find().sort({ _id: -1}).toArray();
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
});

/* PUT A NOTE */
router.put('/', async function(req, res) {

    const client = new MongoClient(MONGODB_URI, {useNewUrlParser: true});

        await client.connect();
        const db = client.db(dbName);
        const col = db.collection('notes');
        console.log('Connected\n');
        
        //INSERT ONE DOCUMENT
        //let userID = data._id;

        let content = req.body.content;

        console.log(content);
        let createdAt = dateNow();
        let lastUpdatedAt = null;
        if(content.length === 0){
            res.status(400).send({error: 'Aucun contenu n\'a été saisi'});
        } else {
            let resInsert = await col.insertOne({
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
});

/* Patch A NOTE */
router.patch('/:id', async function(req, res) {

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

});

module.exports = {router};