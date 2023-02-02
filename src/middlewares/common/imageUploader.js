import multer from "multer";

const imageUploader = multer({
  dest: __dirname + "/../../../assets/img/user-upload-images/",
});

export default imageUploader;
