const admin = require('firebase-admin')
const express = require('express')
const bodyParser = require('body-parser')
const app = express.Router()

app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(bodyParser.json());

// add user 

app.post("/postUser", (req, res) => {

    /**
     * request body wajib
     * 
     * contoh
     * 
     * "deviceTokens": "",
      "jabatan": "Kepala Seksi Statistik",
      "jabatanLengkap": "Kepala Seksi Statistik Surade",
      "kodeWilayah": "3202",
      "nama": "Anwar Hidayat, S.Si",
      "email": "17184071@email.com",
      "password": "123456",
      "nip_atasan": "fjkdslf"


      sunnah

      emailVerified
      phoneNumber
      password
      displayName
      photoURL
      disabled = req.body.disabled

     */

    const email = req.body.email
    const emailVerified = req.body.emailVerified
    const phoneNumber = req.body.phoneNumber
    const password = req.body.password
    const displayName = req.body.displayName
    const photoURL = req.body.photoURL
    const disabled = req.body.disabled
    const nip_atasan = req.body.nip_atasan
        //=====================================================
    const deviceTokens = req.body.deviceTokens
    var imageUrl = ""
    const jabatan = req.body.jabatan
    const jabatanLengkap = req.body.jabatanLengkap
    const kodeWilayah = req.body.kodeWilayah
    const nama = req.body.nama
    const nip = email.substring(0, email.indexOf("@"));
    const username = nip;
    var uid = ""
        //=====================================================
    let kode = kodeWilayah
        // const name = 'juhdi rosadi'
    const cekAtasan = admin.database().ref(`/${kode}/user/`).orderByChild("nip").equalTo(nip_atasan).once('value', function(snapshot) {
            if (snapshot.exists()) {
                console.log(nip)
                console.log(snapshot.val())
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

                    if (deviceTokens === undefined) {
                        res.send("isi device token atau sembarang text ")
                        console.log("device token kosong");
                    } else if (imageUrl == undefined) {
                        res.send("imageUrl harus diisi, atau lihat log untuk detail")
                        console.log("image default: https://firebasestorage.googleapis.com/v0/b/sistempenggansipresensi.appspot.com/o/Profile%2Fusers.png?alt=media&token=4fb53426-9874-464f-b814-ec4e3177d677")
                    } else if (jabatan === undefined) {
                        res.send("Isi jabatan/level")
                        console.log("jabatan kosong");
                    } else if (jabatanLengkap === undefined) {
                        res.send("Isi jabatan lengkap")
                        console.log("jabatan lengkap kosong");
                    } else if (kodeWilayah === undefined) {
                        res.send("isi kode wilayah")
                        console.log("kode wilayah kosong");
                    } else if (nama === undefined) {
                        res.send("Isi nama")
                        console.log("nama kosong");
                    } else if (email === undefined) {
                        res.send("isi email")
                        console.log("email kosong");
                    } else if (uidAtasan === undefined) {
                        res.send("isi uid atasan atau kosongkan dengan spasi")
                        console.log("uid atasan kosong");
                    } else {
                        //=====================================================
                        // create user
                        admin.auth().createUser({
                                email: email,
                                emailVerified: emailVerified,
                                phoneNumber: phoneNumber,
                                password: password,
                                displayName: displayName,
                                photoURL: photoURL,
                                disabled: disabled
                            })
                            .then(function(userRecord) {
                                // See the UserRecord reference doc for the contents of userRecord.
                                console.log("Successfully created new user:", userRecord.uid);
                                uid = userRecord.uid
                                imageUrl = "https://firebasestorage.googleapis.com/v0/b/sistempenggansipresensi.appspot.com/o/Profile%2Fusers.png?alt=media&token=4fb53426-9874-464f-b814-ec4e3177d677"

                                const db = admin.database()
                                const ref1 = db.ref(`/${kodeWilayah}/cekuser/${nip}`)
                                const ref = db.ref(`/${kodeWilayah}/user/${uid}`)
                                    // add user ke user
                                ref.set({
                                        deviceTokens,
                                        imageUrl,
                                        jabatan,
                                        jabatanLengkap,
                                        kodeWilayah,
                                        nama,
                                        nip,
                                        password,
                                        uid,
                                        nip_atasan,
                                        nama_atasan,
                                        uidAtasan
                                    })
                                    .then(function(value) {

                                        // add user ke cek user
                                        ref1.set({
                                                username,
                                                password
                                            })
                                            .then(function(value) {
                                                res.send("Add data berhasil")
                                            })
                                            .catch(function(error) {
                                                res.send("gagal save user ke cekuser" + error)
                                                res.status(404)
                                                res.send('error terjadi di ' + error)

                                                // delete user yang sudah dibuat
                                                admin.auth().deleteUser(uid)
                                                    .then(function() {
                                                        console.log("Successfully deleted user");
                                                    })
                                                    .catch(function(error) {
                                                        console.log("Error deleting user:", error);
                                                    });
                                            })
                                    })
                                    .catch(function(error) {
                                        res.send("gagal save user ke user" + error)
                                        res.status(404)
                                        res.send('error terjadi di ' + error)
                                            // delete user yang sudah dibuat
                                        admin.auth().deleteUser(uid)
                                            .then(function() {
                                                console.log("Successfully deleted user");
                                            })
                                            .catch(function(error) {
                                                console.log("Error deleting user:", error);
                                                res.status(404)
                                                res.send('error terjadi di ' + error)
                                            });
                                    })
                            })
                            .catch(function(error) {

                                res.status(404)
                                res.send('error terjadi di ' + error)
                                console.log("Error creating new user:", error);
                            });
                        // end create user
                    }
                })


            } else {
                console.log('nip atasan tidak ditemukan')
                res.status(400)
                res.send("error nip tidak ditemukan")

                // res.send('error terjadi di ' + error)
            }
        })
        .catch((error) => {
            console.log("eror di pencarian uid atasan")
            res.status(404)
            res.send('error terjadi di ' + error)
        })
})

// end add user

module.exports = app