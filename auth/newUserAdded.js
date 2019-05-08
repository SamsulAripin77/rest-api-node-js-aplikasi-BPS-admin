const admin = require('firebase-admin')
const express = require('express')
const bodyParser = require('body-parser')
const app = express.Router()

app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(bodyParser.json());

app.get('/newUser', (req, res) => {
    const kodeWilayah = req.body.kodeWilayah;
    const db = admin.database()
    const ref = db.ref(`/3202/user`)
    ref.once('child_added', function(snapshot, prevChildkey) {
        var newPost = snapshot.val()
        console.log(newPost.nama)
        res.send(newPost.nama)
    })

})

app.get('/getDeleteUser', (req, res) => {
    const kodeWilayah = req.body.kodeWilayah;
    const db = admin.database()
    const ref = db.ref(`/3202/user`)
    ref.on('child_removed', function(snapshot, prevChildkey) {
        var newPost = snapshot.val()
        console.log(newPost.nama)
            // res.send(newPost.nama)
    })

})

app.get('/getUpdateUser', (req, res) => {
    const kodeWilayah = req.body.kodeWilayah;
    const db = admin.database()
    const ref = db.ref(`/3202/user`)
    ref.once('child_changed', function(snapshot, prevChildkey) {
        var newPost = snapshot.val()
        console.log(newPost.nama)
        res.send(newPost)
    })
})



module.exports = app