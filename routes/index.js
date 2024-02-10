var express = require('express');
var router = express.Router();

const { v4: uuidv4 } = require('uuid');
const azure = require('azure-storage');
/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' 
  });
});

router.post('/', (req, res, next)=>{

  const blobSvc = azure.createBlobService("connectionString");
  let filename = uuidv4().toString() + '.jpg';

  let rawdata = req.body.image;
  let matches = rawdata.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/);
  let type = matches[1]
  let buffer = Buffer.from(matches[2], 'base64');

   blobSvc.createBlockBlobFromText('containerdemo', filename, buffer, {
    contentType: type
  }, function (error, result, response) {
    if (error) {
      filename = 'default.png'
      console.log(error, "teste")
    }
  });
const fileURL = `https://demostoragetiago.blob.core.windows.net/containerdemo/${filename}`

  res.status(201).json({
    url: fileURL
  });
});
module.exports = router;
