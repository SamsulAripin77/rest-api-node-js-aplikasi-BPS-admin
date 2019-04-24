const admin = require('firebase-admin')
const express = require('express')
const app = express()
const get = require('./auth/get.js')
const update = require('./auth/update.js')
const post = require('./auth/post.js')
const delet = require('./auth/delete.js')
const listPegawai = require('./auth/listPegawai.js')
const diizinkan = require('./auth/getDataDiterima')
const bodyParser = require('body-parser')

app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(bodyParser.json());

app.use(diizinkan)
app.use(get)
app.use(update)
app.use(post)
app.use(delet)
app.use(listPegawai)



const serviceAccount = require("./sistempenggansipresensi-firebase-adminsdk-qryrr-23f42c2565.json");
admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "https://sistempenggansipresensi.firebaseio.com"
});

// var dbRef = admin.database().ref("3202")
// app.get('/getAtasan', (req,res)=>{
// 	nama_atasan = req.body.nama_atasan
// 	dbRef.child("user").orderByChild('nama').equalTo(nama_atasan).once("value", function(snapshot){
// 			snapshot.forEach( function(data){
// 				console.log('subagya')
// 					 res.send('ok')
// 				     res.send(data.val())
// 			})
// 		})
// 		})
const port = process.env.port || 5000
app.listen(port, () => {
    console.log('server berjalan di port ' + port)
})