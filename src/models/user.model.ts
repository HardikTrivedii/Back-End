import { sequelize } from "../config/db";
import { DataTypes, Model } from "sequelize";
import { OrderModel } from "./order.model";

export interface User {
  id?: number;
  firstName?: string;
  lastName?: string;
  email?: string;
  password?: string;
  otp?: number;
  balance?: number;
  otpTimestamp?: number;
  accessToken?: string;
  resetToken?: string;
}

class UserModel extends Model<User> implements User {
  public id?: number | undefined;
  public firstName?: string | undefined;
  public lastName?: string | undefined;
  public email?: string | undefined;
  public password?: string | undefined;
  public otp?: number | undefined;
  public otpTimestamp?: number | undefined;
  public accessToken?: string | undefined;
  public resetToken?: string | undefined;
  public balance?: number | undefined;

  public static associate() {
    UserModel.hasMany(OrderModel, { foreignKey: "userId", as: "orders" });
  }
}

UserModel.init(
  {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      autoIncrement: true,
      primaryKey: true,
    },
    firstName: {
      type: new DataTypes.STRING(15),
      allowNull: false,
    },
    lastName: {
      type: new DataTypes.STRING(15),
      allowNull: false,
    },
    email: {
      type: new DataTypes.STRING(50),
      allowNull: false,
      unique: true,
    },
    password: {
      type: new DataTypes.STRING(60),
      allowNull: false,
    },
    balance: {
      type: new DataTypes.INTEGER(),
      allowNull: true,
    },
    otp: {
      type: DataTypes.INTEGER, // Change from new DataTypes.NUMBER()
      allowNull: true,
      defaultValue: null,
    },
    otpTimestamp: {
      type: DataTypes.BIGINT, // Change from new DataTypes.NUMBER()
      allowNull: true,
      defaultValue: null,
    },
    accessToken: {
      type: new DataTypes.STRING(500),
      allowNull: true,
      defaultValue: null,
    },
  },
  {
    tableName: "users",
    sequelize,
  }
);

export { UserModel };
