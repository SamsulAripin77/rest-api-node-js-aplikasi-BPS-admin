const admin = require('firebase-admin')
const express = require('express')
const bodyParser = require('body-parser')
const app = express.Router()

app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(bodyParser.json());

// update user
app.put("/updateUser", (req, res) => {

    /**
   * contoh request
   * {
  	"deviceTokens": "12313;",
    "jabatan": "Koordinator Statistik Kecamatan",
    "jabatanLengkap": "Koordinator Statistik Kecamatan",
    "kodeWilayah": "3202",
    "nama": "DR. Rizki Rakasiwi, S.Kom.,MM",
    "email": "17184069@email.com",
    "password": "123456",
    "nama_atasan": "pilih salah-satu"
}
   */
    // {
    // "deviceTokens": "kdjflkdffklsdfjlkdsfjlskf",
    // "jabatan": "SKS",
    // "jabatanLengkap": "kepala Bps",
    // "kodeWilayah": "3202",
    // "nama": "subagya sahrudin",
    // "email": "sunarto@email.com",
    // "password": "sunarkdlkjt",
    // "nip_atasan": "adminSipp",
    // "KodeWilayahAtasan": "3202" 
    // }


    const email = req.body.email || '3847893247894@email.com'
    const emailVerified = req.body.emailVerified
    const phoneNumber = req.body.phoneNumber
    const password = req.body.password || 'sukabumi888'
    const displayName = req.body.displayName
    const photoURL = req.body.photoURL
    const disabled = req.body.disabled
    const nip_atasan = req.body.nip_atasan || 'adminSipp'
    const KodeWilayahAtasan = req.body.KodeWilayahAtasan || '3202'

    var deviceTokens = req.body.deviceTokens || 'dfjkldsfjskldfkdlsf'
    var imageUrl = ""
    var jabatan = req.body.jabatan || 'SSS'
    var jabatanLengkap = req.body.jabatanLengkap || 'SSS'
    var kodeWilayah = req.body.kodeWilayah || '3202'
    var nama = req.body.nama || 'nama nama ok'
    var nip = email.substring(0, email.indexOf("@"));
    var username = nip
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

    const cekAtasan = admin.database().ref(`/${kodeWilayah}/user/`).orderByChild("nip").equalTo(nip_atasan).once('value', function(snapshot) {
            if (snapshot.exists()) {
                console.log(nip)
                console.log(snapshot.val())
                console.log('data di atasa adalah data atasan akaun yang baru saja diedit')
                console.log('-------------------------------------------------------------------------------');
                //referensi = https://github.com/firebase/functions-samples/issues/265
                //go through each item found and print out the emails
                snapshot.forEach(function(childSnapshot) {
                    var key = childSnapshot.key;
                    var childData = childSnapshot.val();
                    //this will be the actual email value found
                    const uidAtasan = childData.uid
                    const nama_atasan = childData.nama
                    console.log(childData.uid);
                    console.log(childData.nama);
                    // res.send('berhasil mendapat uid')
                    //=====================================================

                    // get user uid
                    admin.auth().getUserByEmail(email)
                        .then(function(userRecord) {


                            // See the UserRecord reference doc for the contents of userRecord.
                            const uid = userRecord.uid
                            console.log("Successfully fetched user data:", uid);


                            // database

                            const db = admin.database()

                            //update
                            admin.auth().updateUser(uid, {

                                    email: email,
                                    emailVerified: emailVerified,
                                    phoneNumber: phoneNumber,
                                    password: password,
                                    displayName: displayName,
                                    photoURL: photoURL,
                                    disabled: disabled

                                })
                                .then(function(userRecord) {
                                    const ref1 = db.ref(`/${kodeWilayah}/cekuser/${nip}`)
                                    const ref2 = db.ref(`/${kodeWilayah}/user/${uid}`)

                                    const ref = db.ref(`/${kodeWilayah}/user/${uid}`)
                                    ref.once("value", function(snapshot) {
                                            const data = snapshot.val()
                                            imageUrl = data.imageUrl

                                            // add user ke user
                                            ref2.set({
                                                    deviceTokens,
                                                    imageUrl,
                                                    jabatan,
                                                    jabatanLengkap,
                                                    kodeWilayah,
                                                    nama,
                                                    nip,
                                                    password,
                                                    uid,
                                                    KodeWilayahAtasan,
                                                    // nip_atasan,
                                                    // nama_atasan,
                                                    uidAtasan
                                                })
                                                .then(function(data) {
                                                    console.log("update user di user berhasil");

                                                    ref1.set({
                                                            username,
                                                            password
                                                        })
                                                        .then(function() {
                                                            const db = admin.database()
                                                            const ref = db.ref(`/${kodeWilayah}/user/${uid}`)
                                                            ref.once('value', function(snapshot) {
                                                                    const data = snapshot.val()
                                                                    console.log('=================data yang baru saja diedit adalah==================')
                                                                    console.log(data)
                                                                    res.send(data)
                                                                })
                                                                .catch((error) => {
                                                                    console.log('error terjadi di ', error)
                                                                    res.status(405)
                                                                    res.send('error terjadi di : ', error)
                                                                })
                                                            console.log("update user di cekuser berhasil");
                                                        })
                                                        .catch(function(error) {
                                                            res.status(405)
                                                            res.send('error terjadi di ' + error)
                                                            console.log("update user dicek user gagal :" + error);
                                                        })

                                                })
                                                .catch(function(error) {
                                                    res.status(405)
                                                    res.send('error terjadi di ' + error)
                                                    console.log("update user di user gagal :" + error);

                                                })
                                        })
                                        // See the UserRecord reference doc for the contents of userRecord.
                                    console.log("Successfully updated user", uid);
                                })
                                .catch(function(error) {
                                    console.log("Error updating user:", error);
                                    res.status(405)
                                    res.send('error terjadi di ' + error)
                                });
                            // end database


                        })
                        .catch(function(error) {
                            res.status(405)
                            res.send('error terjadi di ' + error)
                        });
                });

            } else {
                console.log('nip atasan tidak ditemukan')
                res.json(errorJson)
                res.send('data atasan tidak ditemukan')
            }
        })
        .catch((error) => {
            console.log("eror di pencarian uid atasan")
            res.status(405)
            res.send('error terjadi di ' + error)
        })


})

// end update user

module.exports = app