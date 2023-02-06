import mongoose from "mongoose";

mongoose.connect(
  process.env.NODE_ENV === "production"
    ? process.env.DEPLOY_DB_URL
    : process.env.LOCAL_DB_URL,
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  }
);

const db = mongoose.connection;

db.once("open", () => console.log("Connected to DB!"));
db.on("error", (error) => console.log("DB Error", error));
