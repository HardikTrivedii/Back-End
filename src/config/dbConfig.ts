import { sequelize } from "./db";
import { UserModel } from "../models/user.model";
import { ProductModel } from "../models/product.model";
import { OrderModel } from "../models/order.model";
export async function connectDB() {
  try {
    // Define associations
    UserModel.associate();
    ProductModel.associate();
    OrderModel.associate();

    // await UserModel.sync({ alter: true });
    // await ProductModel.sync({ alter: true });
    // await OrderModel.sync({ alter: true });

    await UserModel.sync();
    await ProductModel.sync();
    await OrderModel.sync();
    sequelize
      .authenticate()
      .then(() => {
        console.log("Database connection has been established successfully.");
      })
      .catch((err) => {
        console.error("Unable to connect to the database:", err);
      });
  } catch (error) {
    console.error("Error connecting to DB:", error);
  }
}
