import mongoose from "mongoose";

mongoose.connect(process.env.DB_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const db = mongoose.connection;

db.once("open", () => console.log("Connected to DB!"));
db.on("error", (error) => console.log("DB Error", error));
