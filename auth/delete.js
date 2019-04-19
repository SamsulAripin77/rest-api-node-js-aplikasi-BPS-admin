const admin = require('firebase-admin')
const express = require('express')
const bodyParser = require('body-parser')
const app = express.Router()

app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(bodyParser.json());


// delete user

app.delete("/deleteUser", (req, res) => {

    const email = req.body.email
    const kodewilayah = req.body.kodewilayah
    const nip = email.substring(0, email.indexOf("@"));

    if (kodewilayah === undefined) {
        res.send("Kode wilayah harus diisi")
    } else {
        if (email != undefined) {
            admin.auth().getUserByEmail(email)
                .then(function(userRecord) {
                    // See the UserRecord reference doc for the contents of userRecord.

                    const uid = userRecord.uid
                    console.log("Successfully fetched user data:", uid);

                    //delete

                    admin.auth().deleteUser(uid)
                        .then(function() {
                            console.log("Successfully deleted user");

                            // database
                            const db = admin.database()
                            const ref = db.ref(`/${kodewilayah}/user/${uid}`)
                            ref.remove()
                                .then(function() {
                                    console.log("Remove succeeded.")
                                    const ref1 = db.ref(`/${kodewilayah}/${nip}`)
                                    ref1.remove()
                                        .then(function() {
                                            console.log("remove from cek user sukses")
                                            res.send("Remove user sukses")
                                        })
                                        .catch(function(error) {
                                            console.log("remove cek user failed :" + error);
                                            res.send("remove user gagal (cekuser)")
                                        })
                                })
                                .catch(function(error) {
                                    console.log("Remove failed: " + error.message)
                                    res.send("User tidak ditemukan dalam database")
                                });
                        })

                    // end database

                    .catch(function(error) {
                        console.log("Error deleting user:", error);
                        res.send("Deleting user failed with :" + error)
                    });

                })
                .catch(function(error) {
                    console.log("Error fetching user data:", error);
                    res.send(error)
                });
        } else {
            console.log("email tidak di isi");
            res.send("Email tidak diisi")
        }
    }
})

// end delete user

module.exports = app