// import mongoose from "mongoose";

// const connectToDB = async () => {
//   try {
//     await mongoose.connect(`${process.env.MONGODB_URI}`);
//     console.log("Connection to db established");
//   } catch (error) {
//     console.log("Error while connecting to database: ", error);
//     process.exit(1);
//   }
// };

// export default connectToDB;
import mongoose from "mongoose";

const connectToDB = async () => {
  try {
    console.log(process.env.MONGODB_URI)
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("Connection to MongoDB established");
  } catch (error) {
    console.error("Error while connecting to MongoDB: ", error);
    process.exit(1); // Exit the process with an error code
  }
};

export default connectToDB;
