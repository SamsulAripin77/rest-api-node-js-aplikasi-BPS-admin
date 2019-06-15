const admin = require('firebase-admin')
const express = require('express')
const bodyParser = require('body-parser')
const app = express.Router()

app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

app.get('/login',(req,res)=>{
    let email = req.body.email;
    let pass = req.body.pass

    admin.auth().getUserByEmail(email)
    .then((userRecord)=>{
        console.log(userRecord)
        console.log('berhasil login')
    })
    .catch((error)=>{
        console.log('error terjadi di: ',error)
    })
})

const PORT = process.env.PORT || 5000
app.listen(PORT, () => {
    console.log('server berjalan di port ' + PORT)
})

module.exports = app