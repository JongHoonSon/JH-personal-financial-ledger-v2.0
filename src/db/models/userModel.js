import mongoose from "mongoose";
import { userSchema } from "../schemas";

const userModel = mongoose.model("User", userSchema);

export default userModel;
