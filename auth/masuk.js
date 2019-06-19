const admin = require('firebase-admin')
const express = require('express')
const bodyParser = require('body-parser')
const app = express.Router()

app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

app.get('/login', (req, res) => {
    const email = req.body.email

    const kodeWilayah = req.body.kodeWilayah
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


app.get('/listadmin', (req, res) => {
    const kode_wilayah = req.body.kode_wilayah || '3202'
    const email = req.body.email || 'adminSipp@email.com'

    admin.auth().getUserByEmail(email)
        .then((userRecord) => {
            const uid = userRecord.uid
            
             console.log('uid yang didapatkan adalah : ', uid)
             listadmin()

        })
        .catch((error) => {
            console.log('error terjadi di mana-mana: ', error)
            res.status(404)
            res.send('eror')
        })

    function listadmin() {
        const db = admin.database()
        const allValue = []
        const ref = db.ref('/admin')
        ref.once('value', (snapshot) => {
                data = snapshot.val()
                    // console.log(data)
                console.log('======================================================================================')
                snapshot.forEach((childSnapshot) => {
                    var kel = childSnapshot.key
                    var childData = childSnapshot.val()
                    allValue.push(childData)
                })
                console.log(allValue)
                res.send(allValue)
                ref.off('value')
            })
            .catch((error) => {
                console.log('error terjadi di :', error)
                res.status(404)
                res.json({error : "gagal mendapatkan data admin"})
            })

    }

})

//==========================================================================================
app.post("/postHero", (req, res) => {

    const email = req.body.email || '4234324242r5453@email.com'
    const password = req.body.password || '58409584950'
    const kodeWilayah = req.body.kodeWilayah || '3203'
    const nip = email.substring(0, email.indexOf("@"))
    const errorJson = {
        KodeWilayahAtasan: "error",
        deviceTokens: "error",
        imageUrl: "error",
        jabatan: "error",
        jabatanLengkap: "error",
        KodeWilayah: "error",
        nama: "error",
        nip: "error",
        password: "error",
        uid: "error",
        uidAtasan: "error"
    }
 // ====================================================
                    console.log('kode wilayah ada')
                    const cekAtasan = admin.database()
                    .ref('/admin/')
                    .orderByChild("username")
                    .equalTo(username).once('value', function (snapshot) {
                        if (snapshot.exists()) {
                            console.log(nip)
                            console.log(snapshot.val())
                            console.log('------------------------------------------------------------------------------' + '-');
                        // referensi = https://github.com/firebase/functions-samples/issues/265 go
                            snapshot.forEach(function (childSnapshot) {
                                var key = childSnapshot.key;
                                var childData = childSnapshot.val();
                                // this will be the actual email value found
                                const uidAtasan = childData.uid
                                const nama_atasan = childData.nama
                                console.log(childData.uid);
                                console.log(childData.nama);
                                // res.send('berhasil mendapat uid')
                                // =====================================================
                                if (kodeWilayah === undefined) {
                                    res.send("isi kode wilayah")
                                    console.log("kode wilayah kosong");
                                } else if (email === undefined) {
                                    res.send("isi email")
                                    console.log("email kosong");
                                } else { // ===================================================== create user
                                    admin.auth().createUser({
                                        email: email,
                                        password: password,
                                    }).then(function (userRecord) { // See the UserRecord reference doc for the contents of userRecord.
                                        console.log("Successfully created new user:", userRecord.uid);
                                        uid = userRecord.uid
                                        const db = admin.database()
                                        const ref = db.ref(`/admin/${uid}`)
                                        ref.set({
                                            kodeWilayah,
                                            nip,
                                            password,
                                            uid
                                        })
                                    }).catch(function (error) {
                                        res.status(405)
                                        res.json(errorJson)
                                        console.log("Error creating new user:", error);
                                    });
                                }
                            })

                        } else {
                            console.log('nip atasan tidak ditemukan')
                            res.status(444)
                            res.json(errorJson)
                        }
                    }).catch((error) => {
                        console.log.json("eror di pencarian uid atasan l:", error)
                        res.status(407)
                        res.json(errorJson)
                    })
                  
})

//==========================================================================================
module.exports = app
