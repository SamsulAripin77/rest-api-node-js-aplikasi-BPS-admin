const admin = require('firebase-admin')
const firebase = require('firebase')
const express = require('express')
const bodyParser = require('body-parser')
const app = express.Router()

app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

app.get('/login', (req, res) => {
    const email = req.body.email

    const kodeWilayah = req.body.kodeWilayah
    // ".indexOn": ["nip","nipAtasan",".value","KodeWilayahAtasan"]
    admin.auth().getUserByEmail(email).then((userRecord) => {
        const uid = userRecord.uid
        const cekKodeWilayah = admin.database().ref('/').orderByKey().equalTo(kodeWilayah).once('value', (snapshot) => {
            if (snapshot.exists()) {
                snapshot.forEach((data)=>{
                    console.log('berhasil login')
                    res.json({uuid: uid, wilayah: data.key})
                })
            } else {
                console.log('error terjadi di bawah: ')
                res.status(444)
                res.json({err: "error"})
            }
        }).catch((error) => {
            console.log('error terjadi di kode wilayah: ', error)
            rest.status(404)
            res.json({err: error})
        })
    }).catch((error) => {
        console.log('error terjadi di email: ', error)
        res.json({err: error})
    })
})

module.exports = app
