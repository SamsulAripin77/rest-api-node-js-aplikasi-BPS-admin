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
                .then((userRecord) => {
                    // See the UserRecord reference doc for the contents of userRecord.

                    const uid = userRecord.uid
                    console.log("Successfully fetched user data:", uid);

                    //delete
                    admin.auth().deleteUser(uid)
                        .then(() => {
                            // database
                            const db = admin.database()
                            const ref = db.ref(`/${kodewilayah}/user/${uid}`)
                            ref.remove()
                            console.log("Successfully deleted user");
                        })
                        .then(() => {
                            console.log("Remove succeeded.")
                            const ref1 = db.ref(`/${kodewilayah}/${nip}`)
                            ref1.remove()

                        })

                    // end database

                    .catch((error) => {
                        console.log("Error deleting user:", error);
                        res.send("Deleting user failed with :" + error)
                    });

                })
                .catch((error) => {
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