const admin = require('firebase-admin')
const express = require('express')
const app = express()
const get = require('./auth/get.js')
const update = require('./auth/update.js')
const post = require('./auth/post.js')
const delet = require('./auth/delete.js')
const newUserAdded = require('./auth/newUserAdded.js')
const listPegawai = require('./auth/listPegawai.js')
const diizinkan = require('./auth/dataPresensi')
const bodyParser = require('body-parser')
const login = require('./login.js')

app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(bodyParser.json());

app.use(newUserAdded)
app.use(login)
app.use(diizinkan)
app.use(get)
app.use(update)
app.use(post)
app.use(delet)
app.use(listPegawai)

app.get('/homealone', (req, res) => {
    res.send('alone in home')
    console.log('alone wae ah')
})

const serviceAccount = require("./sistempenggansipresensi-firebase-adminsdk-qryrr-23f42c2565.json");
admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "https://sistempenggansipresensi.firebaseio.com"
});

const PORT = process.env.PORT || 5000
app.listen(PORT, () => {
    console.log('server berjalan di port ' + PORT)
})