import { sequelize } from "../config/db";
import { DataTypes, Model } from "sequelize";
import { UserModel } from "./user.model";
import { OrderModel } from "./order.model";

export interface Product {
  id?: number;
  name?: string;
  price?: number;
  quantity?: number;
  description?: string;
  image?: string;
  addedBy?: number;
}

class ProductModel extends Model<Product> implements Product {
  public id?: number | undefined;
  public name?: string | undefined;
  public price?: number | undefined;
  public quantity?: number | undefined;
  public description?: string | undefined;
  public image?: string | undefined;
  public addedBy?: number | undefined;

  public static associate() {
    UserModel.hasMany(ProductModel, { foreignKey: "userId", as: "products" });
    ProductModel.hasMany(OrderModel, { foreignKey: "productId", as: "orders" });
  }
}

ProductModel.init(
  {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      autoIncrement: true,
      primaryKey: true,
    },
    name: {
      type: new DataTypes.STRING(50),
      allowNull: false,
    },
    price: {
      type: DataTypes.DECIMAL(10, 2), // Example: up to 10 digits, 2 decimal places
      allowNull: false,
    },
    quantity: {
      type: DataTypes.INTEGER(),
      defaultValue: 0,
      allowNull: false,
    },
    description: {
      type: new DataTypes.TEXT(),
      allowNull: true,
    },
    image: {
      type: new DataTypes.STRING(200),
      allowNull: false,
    },
    addedBy: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
    },
  },

  {
    tableName: "products",
    sequelize,
  }
);

export { ProductModel };
