// models/orderCombined.ts

import { sequelize } from "../config/db";
import { DataTypes, Model } from "sequelize";
import { ProductModel } from "./product.model";
import { UserModel } from "./user.model";

export interface Order {
  id?: number;
  userId?: number;
  productId?: number;
  quantity?: number;
  price?: number;
  orderDate?: Date;
  status?: string;
  totalAmount?: number;
}

class OrderModel extends Model<Order> implements Order {
  public id?: number;
  public userId?: number;
  public productId?: number;
  public quantity?: number;
  public price?: number;
  public orderDate?: Date;
  public status?: string;
  public totalAmount?: number;
  public user?: UserModel;
  public product?: ProductModel;

  public static associate() {
    OrderModel.belongsTo(UserModel, { foreignKey: "userId", as: "user" });
    OrderModel.belongsTo(ProductModel, {
      foreignKey: "productId",
      as: "product",
    });
  }
}

OrderModel.init(
  {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      autoIncrement: true,
      primaryKey: true,
    },
    userId: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
      references: {
        model: UserModel,
        key: "id",
      },
    },
    productId: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
      references: {
        model: ProductModel,
        key: "id",
      },
    },
    quantity: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    price: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
    orderDate: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
    status: {
      type: DataTypes.STRING,
      allowNull: true,
      defaultValue: "pending",
    },
    totalAmount: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
  },
  {
    tableName: "orders_combined",
    sequelize,
  }
);

export { OrderModel };
