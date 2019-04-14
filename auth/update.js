const admin = require('firebase-admin')
const express = require('express')
const bodyParser = require('body-parser')
const app = express.Router()

app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

// update user
app.put("/user", (req, res)=>{

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
    
    const email = req.body.email
    const emailVerified = req.body.emailVerified
    const phoneNumber = req.body.phoneNumber
    const password =  req.body.password
    const displayName = req.body.displayName
    const photoURL = req.body.photoURL
    const disabled = req.body.disabled 
    const nama_atasan = req.body.nama_atasan

    var deviceTokens=req.body.deviceTokens
    var imageUrl=""
    var jabatan=req.body.jabatan
    var jabatanLengkap=req.body.jabatanLengkap
    var kodeWilayah=req.body.kodeWilayah
    var nama=req.body.nama
    var nip=email.substring(0, email.indexOf("@"));

    const dbRef = admin.database().ref(`${kodeWilayah}`)
    dbRef.child("user").orderByChild('nama').equalTo(nama_atasan).on("value",((snapshot)=>{
    snapshot.forEach((data)=>{
        console.log(data.val())
        const uidAtasan = data.val().uid

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
              ref.once("value", function(snapshot){
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
                  nama_atasan,
                  uidAtasan
                })
                .then(function(data){
                  console.log("update user di user berhasil");
                  
                  ref1.set({
                    nip,
                    password
                  })
                  .then(function(value){
                      res.send("update berhasil")
                      console.log("update user di cekuser berhasil");
                      
                  })
                  .catch(function(error){
                    res.send("update user di cekuser gagal")
                    console.log("update user dicek user gagal :"+error);
                    
                  })
                
                })
                .catch(function(error){
                  res.send("update user di user gagal")
                  console.log("update user di user gagal :"+error);
                  
                })
              })
              // See the UserRecord reference doc for the contents of userRecord.
              console.log("Successfully updated user", uid);
            })
            .catch(function(error) {
              console.log("Error updating user:", error);
              res.send("update di auth: "+error)
            });
        // end database

          
    })
    .catch(function(error) {

        res.status(400).send(error)
        res.send("user tidak ditemukan atau lihat log untuk detail")
    });

   })
    }))
})
// end update user

module.exports = app