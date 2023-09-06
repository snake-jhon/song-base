var express = require('express');
const uploadFileMiddleware = require('../middleware/upload');
var router = express.Router();
const createCsvWriter = require('csv-writer').createObjectCsvWriter;
const csv = require('csv-parser');
const fs = require('fs');

const csvWriter = createCsvWriter({
  path:'db/data.csv',
  header:[{
    id:'name',title:'Name'
  },
  {
    id:'description',title:'Description'
  },
  {
    id:'url',title:'Url'
  }]
})

/* GET home page. */
router.get('/', function(req, res, next) {
 res.json('Hello').status(200);

 

});

router.post('/upload', async function(req, res, next) {
  try {
    await uploadFileMiddleware(req, res);

    if (req.file == undefined) {
      return res.status(400).send({ message: "Please upload a file!" });
    }
    ///
   const data = [{name:req.body.name,description:req.body.description,url:req.file.originalname}];
   csvWriter.writeRecords(data).then((response) =>{
    res.status(200).send({
      message: "Uploaded the file successfully: " + req.file.originalname,
    });
   }).catch((err) => {res.status(500).send({
    message: `errro saving data . ${err}`,
  });})
    ///
  } catch (err) {
    res.status(500).send({
      message: `Could not upload the file: . ${err}`,
    });
  }

});


router.get('/songs', async function(req, res, next) {
  

  const records = [];

  fs.createReadStream('db/data.csv').pipe(csv()).on('data',(data) =>{
    records.push(data);
  }).on('end',() =>{
    res.json(records).status(200);
  })

});





router.post('/download/:name', async function(req, res, next) {
  const fileName = req.params.name
  res.download(process.cwd()+'/uploads/' + fileName, fileName, (err) => {
    if (err) {
      res.status(500).send({
        message: "Could not download the file. " + err,
      });
    }
  });

});

module.exports = router;
