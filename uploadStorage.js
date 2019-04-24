  const keyFilename = "./sistempenggansipresensi-firebase-adminsdk-qryrr-23f42c2565.json"; //replace this with api key file
  const projectId = "sistempenggansipresensi" //replace with your project id
  const bucketName = "gs://sistempenggansipresensi.appspot.com"; //Add your bucket name
  var mime = require('mime-types');
  const uuidv1 = require('uuid/v1'); //this for unique id generation
  const express = require('express')
  const bodyParser = require('body-parser')
  const app = express()

  app.use(bodyParser.urlencoded({
      extended: true
  }));
  app.use(bodyParser.json());

  //const mime = require('mime');
  const {
      Storage
  } = require('@google-cloud/storage');


  const gcs = new Storage();


  // const gcs = new storage({
  //     projectId,
  //     keyFilename
  // });

  const bucket = gcs.bucket(bucketName);

  // const filePath = "./imge/1 (2).png";



  //we need to pass those parameters for this function
  app.post('/upload', (req, res) => {

      const filePath = "./index.js";
      const remotePath = "/XXXX";
      const fileMime = mime.lookup(filePath);
      var upload = (filePath, remoteFile, fileMime) => {

          let uuid = uuidv1();

          return bucket.upload(filePath, {
                  destination: remoteFile,
                  uploadType: "media",
                  metadata: {
                      contentType: fileMime,
                      metadata: {
                          firebaseStorageDownloadTokens: uuid
                      }
                  }

              })
              .then((data) => {

                  let file = data[0];

                  return Promise.resolve("https://firebasestorage.googleapis.com/v0/b/" + bucket.name + "/o/" + encodeURIComponent(file.name) + "?alt=media&token=" + uuid);
                  upload(filePath, remotePath, fileMime).then(downloadURL => {
                      console.log(downloadURL);
                  }).catch((error) => {
                      console.log('terjadi error di :', error)
                      res.status(404).send('data tidak terkirim')
                  })

                  //This function is for generation download url    


              })
      }
  })
  const port = process.env.port || 5000
  app.listen(port, () => {
          console.log('server berjalan di port ' + port)
      })
      // var upload = (filePath, remoteFile, fileMime) => {

  //         let uuid = uuidv1();

  //         return bucket.upload(filePath, {
  //                 destination: remoteFile,
  //                 uploadType: "media",
  //                 metadata: {
  //                     contentType: fileMime,
  //                     metadata: {
  //                         firebaseStorageDownloadTokens: uuid
  //                     }
  //                 }
  //             })
  //             .then((data) => {

  //                 let file = data[0];

  //                 return Promise.resolve("https://firebasestorage.googleapis.com/v0/b/" + bucket.name + "/o/" + encodeURIComponent(file.name) + "?alt=media&token=" + uuid);
  //             });
  //     }
  //     //This function is for generation download url    
  // upload(filePath, remotePath, fileMime).then(downloadURL => {
  //     console.log(downloadURL);

  // });
  //========================================================================================

  // const path = require("path");
  // // const spawn = require("child-process-promise").spawn;
  // const cors = require("cors")({
  //     origin: true
  // });
  // const Busboy = require("busboy");
  // const fs = require("fs");

  // // const gcconfig = {
  // //     projectId: "sistempenggansipresensi",
  // //     keyFilename: "./sistempenggansipresensi-firebase-adminsdk-qryrr-23f42c2565.json"
  // // };

  // // const gcs = require("@google-cloud/storage")(gcconfig);
  // app.post('/upimage', (req, res) => {
  //     cors(req, res, () => {
  //         if (req.method !== "POST") {
  //             return res.status(500).json({
  //                 message: "Not allowed"
  //             });
  //         }
  //         const busboy = new Busboy({
  //             headers: req.headers
  //         });
  //         let uploadData = null;

  //         busboy.on("file", (fieldname, file, filename, encoding, mimetype) => {
  //             const filepath = path.join(os.tmpdir(), filename);
  //             uploadData = {
  //                 file: filepath,
  //                 type: mimetype
  //             };
  //             file.pipe(fs.createWriteStream(filepath));
  //         });

  //         busboy.on("finish", () => {
  //             const bucket = gcs.bucket("fb-cloud-functions-demo.appspot.com");
  //             bucket
  //                 .upload(uploadData.file, {
  //                     uploadType: "media",
  //                     metadata: {
  //                         metadata: {
  //                             contentType: uploadData.type
  //                         }
  //                     }
  //                 })
  //                 .then(() => {
  //                     res.status(200).json({
  //                         message: "It worked!"
  //                     });
  //                 })
  //                 .catch(err => {
  //                     res.status(500).json({
  //                         error: err
  //                     });
  //                 });
  //         });
  //         busboy.end(req.rawBody);
  //     });
  // });