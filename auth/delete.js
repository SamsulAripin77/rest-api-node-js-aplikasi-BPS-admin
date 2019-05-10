const admin = require('firebase-admin')
const express = require('express')
const bodyParser = require('body-parser')
const app = express.Router()

app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(bodyParser.json());
app.delete('/deleteUser', (req, res) => {
    const email = req.body.email || '83497289347@email.com'
    const kode_wilayah = req.body.kode_wilayah || '3202'
    const db = admin.database()
    const nip = email.substring(0, email.indexOf("@"));

    admin.auth().getUserByEmail(email)
        .then((userRecord) => {
            function deleteUser() {
                const uid = userRecord.uid
                admin.auth().deleteUser(uid)
                const ref1 = db.ref(`/${kode_wilayah}/user/${uid}`)
                ref1.remove()
                console.log('data yang dihapus', uid)
                const uuid = []
                uuid.push(uid)
                res.send.JSON.stringify(uuid)
            }

            function deleteCekUser() {
                const ref = db.ref(`/${kode_wilayah}/cekuser/${nip}`)
                ref.remove()
                console.log('sukses menghapus data di cek user')
            }

            function deleteBoth() {

                deleteUser();
                deleteCekUser();
                console.log('berhaisl meghapus data di kedua node')
                    // res.send('berhasil menghapus data dikedua node')
            }
            deleteBoth()

        })
        .catch((error) => {
            console.log('terjadi error', error)
            res.status(404)
            res.send('error terjadi di ' + error)
        })
})

module.exports = app