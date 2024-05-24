const express = require('express');
const { ObjectId } = require('mongodb')
const { connectToDb, getDb } = require('./db')

//init app & middleware
const app = express();
app.use(express.json())
let db

//db connection
connectToDb((err) => {
    if(!err) {
        app.listen(3000, () => {
            console.log('app listening on port 3000');
        })
        db = getDb()
    }

})



// routes
app.get('/qdbcrudapi', (req, res) => {

    const page = req.query.p || 0
    const booksPerPage = 3

    let qurandbs = []

    db.collection('qurandb')
    .find()
    // .sort({author: 1})
    .skip(page * booksPerPage)
    .limit(booksPerPage)
    .forEach(qurandb => qurandbs.push(qurandb))
    .then(() => {
        res.status(200).json(qurandbs)
    })
    .catch(() => {
        res.status(500).json({error: 'could not fetch the document man'})
    })


    // res.json({msg: 'welcome to the api!'})
});

app.get('/qdbcrudapi/:id', (req, res) => {

    if (ObjectId.isValid(req.params.id)) {
    db.collection('qurandb')
    .findOne({_id: new ObjectId(req.params.id)})
    .then((doc) => {
        res.status(200).json(doc)
    })
    .catch(() => {
        res.status(500).json({error: 'Could not fetch the document'})
    })
    }
    else {
        res.status(500).json({error: 'Not a valid document ID'})
    }
})

app.post('/qdbcrudapi', (req, res) => {
    const qurandb = req.body

    db.collection('qurandb')
    .insertOne(qurandb)
    .then(result => {
        res.status(201).json(result)
    })
    .catch(err => {
        res.status(500).json({err: 'Could not create a new document'})
    })
})

app.delete('/qdbcrudapi/:id', (req, res) => {
    if (ObjectId.isValid(req.params.id)) {
        db.collection('qurandb')
        .deleteOne({_id: new ObjectId(req.params.id)})
        .then((result) => {
            res.status(200).json(result)
        })
        .catch(() => {
            res.status(500).json({error: 'Could not delete the document'})
        })
        }
        else {
            res.status(500).json({error: 'Not a valid document ID'})
        }
})

app.patch('/qdbcrudapi/:id', (req, res) => {
    const updates = req.body

    if (ObjectId.isValid(req.params.id)) {
        db.collection('qurandb')
        .updateOne({_id: new ObjectId(req.params.id)}, {$set: updates })
        .then((result) => {
            res.status(200).json(result)
        })
        .catch(() => {
            res.status(500).json({error: 'Could not update the document'})
        })
        }
        else {
            res.status(500).json({error: 'Not a valid document ID'})
        }

})