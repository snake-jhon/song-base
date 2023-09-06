const util = require("util");
const multer = require("multer");

const maxSize = 10 * 1024 * 1024;
let storage = multer.diskStorage({
    destination: (req, file, cb) => {
        console.log(req,"my-req")
      cb(null, process.cwd()+'/uploads');
    },
    filename: (req, file, cb) => {
      console.log(file,"myFile");
      cb(null, file.originalname);
    },
  });
  
  let uploadFile = multer({
    storage: storage,
    limits: { fileSize: maxSize },
  }).single("file");
  
  let uploadFileMiddleware = util.promisify(uploadFile);
  module.exports = uploadFileMiddleware;