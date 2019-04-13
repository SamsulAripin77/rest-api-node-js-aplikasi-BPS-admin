const admin = require('firebase-admin')
const express = require('express')
const bodyParser = require('body-parser')
const app = express.Router()

app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());


// get user
app.get("/allow", (req, res)=>{
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
                ref1.on("value", function(snapshot){
                    
                    snapshot.forEach(function(data){
                        kodewilayah.push(data.key)
                        console.log("kode wilayah :"+data.key);
                    })
                    
                    var i;
                    var e;
                    for(i = 0; i<kodewilayah.length; i++){
                        for(e=0;e<alluid.length;e++){
                            const ref2 = db.ref(`/${kodewilayah[i]}/user/${alluid[e]}`)
                            ref2.on("value", function(snapshot2){
                                const value = snapshot2.val()
                                console.log(kodewilayah);
                                
                                if(value != null){
                                    allvalue.push(value)
                                }

                            })
                        }   
                    }

                    console.log(allvalue) 
                    res.send(allvalue)                
                })
                // end read database
             
            }
          
        })
        .catch(function(error) {
            console.log("Error listing users:", error);
        });
    }      

    // if kode wilayah have a value
    if(kode_wilayah === undefined){

        // if email have n a value
        if(email != undefined){
            
            admin.auth().getUserByEmail(email)
            .then(function(userRecord) {
            
                // See the UserRecord reference doc for the contents of userRecord.
            
                const uid = userRecord.uid
                console.log("user uid:", uid);
                
                // database

                const kodewilayah = []
                const db = admin.database()
                const ref1 = db.ref("/")
                ref1.on("value", function(snapshot){
                    
                    snapshot.forEach(function(data){
                        kodewilayah.push(data.key)
                        console.log("kode wilayah :"+data.key);
                    })
                    
                    var i;
                    for(i = 0; i<kodewilayah.length; i++){
                        const ref2 = db.ref(`/${kodewilayah[i]}/user/${uid}`)
                        ref2.on("value", function(snapshot2){
                            const value = snapshot2.val()
                            console.log(kodewilayah);
                            
                            if(value != null){
                                res.send(value)
                                console.log(value);
                            }

                            /** kode ini apabila di berikan else maka akan error
                             * apabila tidak diberikan else maka apabila user tidak
                             * terdaftar didatabase realtime maka tidak akan ada respond apapun
                             * solusinya adalah harus menyertakan kode wilayah kedalam body request
                             */
                        })   
                    }
                })

                // end database
            
            })
            .catch(function(error) {
            
                console.log("Error get data", error);
                res.send("User tidak ditemukan di authentication")
            
            });
        }else{    
        // Start listing users from the beginning, 1000 at a time.
        listAllUsers();
        }

        // end if email have email

    }else{
        
        
        // read
        if(email != undefined){
            admin.auth().getUserByEmail(email)
            .then(function(userRecord) {
            
                // See the UserRecord reference doc for the contents of userRecord.
            
                const uid = userRecord.uid
                console.log("user uid:", uid);
                
                // database
                const db = admin.database()
                const ref = db.ref(`/${kode_wilayah}/user/${uid}`)
                ref.on("value", function(snapshot){
                    
                    
                    const value = snapshot.val()
                    console.log(kode_wilayah);
                    
                    if(value != null){
                        res.send(value)
                        console.log(value);
                    }else{
                        res.send("data tidak ditemukan dalam database")
                        console.log("data tidak ditemukan dalam database");
                        
                    }

                

                // end database
            
                })

            })    
            .catch(function(error) {
                
                console.log("Error get data", error);
                res.send("User tidak ditemukan dalam authentication")
            
            });    // end read
        }else{
            listAllUsers();
        }
        
    }
    // end if kode wilayah have a value
})
// end get user

module.exports = app