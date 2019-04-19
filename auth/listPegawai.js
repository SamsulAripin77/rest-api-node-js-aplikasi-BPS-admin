const admin = require('firebase-admin')
const express = require('express')
const bodyParser = require('body-parser')
const firebase = require('firebase')

const app = express.Router()

app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(bodyParser.json());

app.get('/usercheck', (req, res) => {

    // fungsi untuk mencari uid atasan berdasarkna nim atasan
    const nip = req.body.nip
    const kode = req.body.kode
    const cekAtasan = admin.database().ref(`/3202/user/`)
    cekAtasan.orderByChild("nip").equalTo(nip).once('value', function(snapshot) {
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
                    res.send('berhasil mendapat uid')
                })
            } else {
                console.log('nip atasanatasan invalid')
                res.status(404).send('nip atasan invalid')
            }
            //snapshot would have list of NODES that satisfies the condition


        })
        .catch((error) => {
            console.log('errror di pencarian atasan')
            res.status(404).send('error di pencarian atasan')
        })
})

// app.get('/users',(req,res)=>{
//     const db = admin.database()
//     const ref = db.ref('/users')
//     ref.once('value',(snapshot)=>{
//         snapshot.forEach(function(childSnapshot){
//             var childData = childSnapshot.val()
//             console.l...................database







//             og(childSnapshot.val())
//             res.send(childSnapshot.val())
//         })
//     })
// })

// app.get('/users',(req,res)=>{
//    const db = admin.database()
//     const ref = db.ref('/users')
//     ref.on('value',(snapshot)=>{
//       snapshot.forEach(function(data){
//           id = data.val()
//       })
//     })
// })

app.get('/getUser', (req, res) => {

    const email = req.body.email
    const kode_wilayah = req.body.kode_wilayah
    console.log(`email : ${email} dan kode wilayah ${kode_wilayah}`);
    const alluid = []
    const allvalue = []
        // read all data function
    function listAllUsers(nextPageToken) {
        // List batch of users, 1000 at a time.
        admin.auth().listUsers(1000, nextPageToken)
            .then(function(listUsersResult) {
                listUsersResult.users.forEach(function(userRecord) {
                    console.log('detektor 1')
                    console.log("user", userRecord.toJSON());
                    alluid.push(userRecord.uid)
                });
                if (listUsersResult.pageToken) {
                    // List next batch of users.
                    listAllUsers(listUsersResult.pageToken)
                        //   read database
                    const kodewilayah = []
                    const db = admin.database()
                    const ref1 = db.ref("/")
                    ref1.on("value", function(snapshot) {
                            snapshot.forEach(function(data) {
                                kodewilayah.push(data.key)
                                console.log('detektor 2')
                                console.log("kode wilayah :" + data.key);
                            })
                            var i;
                            var e;
                            for (i = 0; i < kodewilayah.length; i++) {
                                for (e = 0; e < alluid.length; e++) {
                                    const ref2 = db.ref(`/${kodewilayah[i]}/user/${alluid[e]}`)
                                    ref2.on("value", function(snapshot2) {
                                        const value = snapshot2.val()
                                        console.log('detektor 3')
                                        console.log(kodewilayah);

                                        if (value != null) {
                                            allvalue.push(value)
                                        }

                                    })
                                }
                            }
                            console.log('detektor 4')
                            console.log(allvalue)
                            res.send(allvalue)
                            ref.off('value');
                        })
                        // end read database

                }

            })
            .catch(function(error) {
                console.log("Error listing users:", error);
            });
    }

    //=======================================================================================================
    const id = []
    const db = admin.database()
    const ref = db.ref('/')
        // const email = req.body.email || '17184075@email.com'
        // const kode_wilayah = req.body.kode_wilayah || '3202'
    ref.once('value').then(snapshot => {
            if (!snapshot.hasChild(kode_wilayah)) {
                res.status(404).send('kode wilayah tidak ditemukan')
                console.log('kode wilayah tidak ditemukan')
            } else {
                admin.auth().getUserByEmail(email)
                    .then((userRecord) => {
                        listAllUsers()
                    })
                    .catch((error) => {
                        console.log('email invalid', error)
                        res.status(404).send('email invalid')
                    })
            }
        })
        .catch((error) => {
            res.status(404).send('tidak dapat terhubung ke database :', error)
            console.log(error)
        })
})

module.exports = app