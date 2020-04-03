var express = require('express');
var router = express.Router();
const {MongoClient} = require('../config');
const {MONGODB_URI} = require('../config');
const {dbName} = require('../config');
const {dateNow} = require('../config');


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

module.exports = {router};