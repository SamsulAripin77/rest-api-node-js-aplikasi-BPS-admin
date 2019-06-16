const admin = require('firebase-admin')
const express = require('express')
const bodyParser = require('body-parser')
const app = express.Router()

app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

app.get('/login',(req,res)=>{
    let email = '8947283947389@email.com';
    let pass = req.body.pass

    admin.auth().getUserByEmail(email)
    .then((userRecord)=>{
        uid = userRecord.uid
        console.log(uid)
        res.json(uid)
        console.log('berhasil login')
    })
    .catch((error)=>{
        console.log('error terjadi di: ',error)
    })
})
module.exports = app