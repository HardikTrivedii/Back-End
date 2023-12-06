import mongoose from "mongoose";
export async function connectDB() {
  try {
    await mongoose
      .connect(`${process.env.DB_HOST}`)
      .then((x) => {
        console.log(
          `Connected to Mongo! Database name: "${x.connections[0].name}"`
        );
      })
      .catch((err) => {
        console.error("Error connecting to mongo", err.reason);
      });
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
  }
}
