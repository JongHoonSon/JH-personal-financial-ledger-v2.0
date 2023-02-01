import multer from "multer";

export const imageUploader = multer({
  dest: __dirname + "/../../assets/img/user-upload-images/",
});
