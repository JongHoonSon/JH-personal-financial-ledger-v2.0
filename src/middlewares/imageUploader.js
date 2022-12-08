import multer from "multer";

const imageUploader = multer({
  dest: __dirname + "/../client/img/user-upload-images/",
});

export default imageUploader;
