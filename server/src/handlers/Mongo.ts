import mongoose from "mongoose";
import { color } from "../functions";

module.exports = () => {
  const MONGO_URI = process.env.MONGO_URI;

  if (!MONGO_URI) {
    console.log(
      color("text", `🍃 Mongo URI not found, ${color("error", "failed")}`)
    );
    process.exit(1);
  }

  mongoose.set("strictQuery", false);

  mongoose
    .connect(MONGO_URI)
    .then(() =>
      console.log(
        color(
          "text",
          `🍃 MongoDB connection has been ${color("variable", "established.")}`
        )
      )
    )
    .catch(() =>
      console.log(
        color(
          "text",
          `🍃 MongoDB connection has been ${color("error", "failed.")}`
        )
      )
    );
};
