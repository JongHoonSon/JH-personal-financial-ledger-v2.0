import multer from "multer";
import multerS3 from "multer-s3";
import { S3Client } from "@aws-sdk/client-s3";

const s3_client = new S3Client({
  credentials: {
    accessKeyId: process.env.AWS_S3_ACCESS_ID,
    secretAccessKey: process.env.AWS_S3_ACCESS_KEY,
  },
});

const s3_multer = multerS3({
  s3: s3_client,
  bucket: "pflv2.0/images",
});

const imageUploader = multer({
  dest: __dirname + "/../../../assets/img/user-upload-images/",
  storage: process.env.NODE_ENV === "production" ? s3_multer : undefined,
  // storage: s3_multer,
});

export default imageUploader;
