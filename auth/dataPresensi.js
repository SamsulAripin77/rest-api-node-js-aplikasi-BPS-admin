const admin = require('firebase-admin')
const express = require('express')
const bodyParser = require('body-parser')
const firebase = require('firebase')

const app = express.Router()

app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(bodyParser.json());

app.get('/ditolak', (req, res) => {
    const kode_wilayah = req.body.kode_wilayah || '3202'
    const email = req.body.email || 'adminSipp@email.com'

    admin.auth().getUserByEmail(email)
        .then((userRecord) => {
            const uid = userRecord.uid
            console.log('uid yang didapatkan adalah : ', uid)
            listdiizinkan()

        })
        .catch((error) => {
            console.log('error terjadi di mana-mana: ', error)
            res.status(404)
            res.send('eror')
        })

    function listdiizinkan() {
        const db = admin.database()
        const allValue = []
        const ref = db.ref(`/${kode_wilayah}/data_milik_admin/data_ditolak`)
        ref.once('value', (snapshot) => {
                data = snapshot.val()
                    // console.log(data)
                console.log('======================================================================================')
                snapshot.forEach((childSnapshot) => {
                    var kel = childSnapshot.key
                    var childData = childSnapshot.val()
                    allValue.push(childData)
                        // res.send('data')
                })
                console.log(allValue)
                res.send(allValue)
                ref.off('value')
            })
            .catch((error) => {
                console.log('error terjadi di :', error)
                res.status(404).send('data tidak terkirim')
            })

    }

})

//=====================================================================================

app.get('/diizinkan', (req, res) => {
    const kode_wilayah = req.body.kode_wilayah || '3202'
    const email = req.body.email || 'adminSippt@email.com'

    admin.auth().getUserByEmail(email)
        .then((userRecord) => {
            const uid = userRecord.uid
            console.log('uid yang didapatkan adalah : ', uid)
            listdiizinkan()

        })
        .catch((error) => {
            console.log('error terjadi di mana-mana: ', error)
            res.status(404)
            res.send('eror')
        })

    function listdiizinkan() {
        const db = admin.database()
        const allValue = []
        const ref = db.ref(`/${kode_wilayah}/data_milik_admin/data_diizinkan`)
        ref.once('value', (snapshot) => {
                data = snapshot.val()
                    // console.log(data)
                console.log('======================================================================================')
                snapshot.forEach((childSnapshot) => {
                    var kel = childSnapshot.key
                    var childData = childSnapshot.val()
                    allValue.push(childData)
                        // res.send('data')
                })
                console.log(allValue)
                res.send(allValue)
                ref.off('value')
            })
            .catch((error) => {
                console.log('error terjadi di :', error)
                res.status(404).send('data tidak terkirim')
            })

    }

})

module.exports = app