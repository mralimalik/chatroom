import mongoose from "mongoose";

const url = "mongodb://localhost:27017/realTimeChats";

const connectDatabase = async () => {
  try {
   const instance = await mongoose.connect(url);
    console.log(`Database Connected `);
  } catch (e) {
    console.log(`Error connecting to data base ${e}`);
  }
};

export default connectDatabase;