import mongoose from "mongoose";
import config from "config";

const url = config.get<string>("dbURI");
export default async function connect() {
  try {
    await mongoose.connect(url || "");
    console.log("MongoDb is connected");
  } catch (error) {
    console.log(`could not connect to db ${error}`);
    process.exit(1);
  }
}
