import { Order, OrderModel } from "../models/order.model";
import ResponseBuilder from "../helpher/responseBuilder";
import { logInfo, logMySqlError } from "../helpher/logger";
import { sequelize } from "../config/db";
import { UserModel } from "../models/user.model";
import { ProductModel } from "../models/product.model";
const l10n = require("jm-ez-l10n");

export class OrderUtils {
  public async createOrder(payload: Order) {
    try {
      const result = await OrderModel.create(payload);
      if (result) {
        logInfo("MySQL operation successfully completed");
        return ResponseBuilder.success(
          result,
          l10n.t("ORDER_ADDED_SUCESSFULLY")
        );
      }
      return;
    } catch (error) {
      logMySqlError("Error in MySQL operation", error);
      console.log(error);
    }
  }
  public async getAllOrder(page: number, pageSize: number) {
    try {
      const offset = (page - 1) * pageSize;
      const { count, rows: order } = await OrderModel.findAndCountAll({
        limit: pageSize,
        offset: offset,
      });
      const totalOrder = count;
      const currentPage = page;
      const remainingOrders = totalOrder - offset - order.length;

      const response = {
        totalOrder,
        currentPage,
        pageSize,
        remainingOrders,
        order,
      };
      logInfo("MySQL operation successfully completed");
      return ResponseBuilder.success(
        response,
        l10n.t("ORDER_LISTS_GET_SUCCESSFULLY")
      );
    } catch (error) {
      logMySqlError("Error in MySQL operation", error);
      console.log(error);
    }
  }

  public async getOrderDetails(id: string) {
    return await OrderModel.findOne({ where: { id: id } });
  }
  public async getUserOrderDetails(id: string) {
    return await OrderModel.findOne({ where: { userId: id } });
  }

  public async updateOrder(payload: Order | any, userId: string) {
    try {
      const getOrder: any = await this.getOrderDetails(userId);

      if (!getOrder) {
        return ResponseBuilder.notFound();
      }

      const fieldsToUpdate = ["quantity", "orderDate"];

      fieldsToUpdate.forEach((field) => {
        if (payload[field] !== undefined) {
          getOrder[field] = payload[field];
        }
      });
      const update: any = await getOrder.save();
      if (update) {
        logInfo("MySQL operation successfully completed");
        return ResponseBuilder.success(
          { orderId: update.id },
          l10n.t("ORDER_UPDATED_SUCESSFULLY")
        );
      } else {
        return ResponseBuilder.error(update.message);
      }
    } catch (error) {
      logMySqlError("Error in MySQL operation", error);
      console.log(error);
    }
  }

  public async removeOrder(id: string) {
    try {
      const result: any = await OrderModel.destroy({ where: { id: id } });

      if (result) {
        logInfo("MySQL operation successfully completed");
        return ResponseBuilder.success(
          result,
          l10n.t("ORDER_DELETED_SUCESSFULLY")
        );
      } else {
        return ResponseBuilder.error(result.message);
      }
    } catch (error) {
      logMySqlError("Error in MySQL operation", error);
      console.log(error);
    }
  }

  public async placeOrder(userId: number, productId: number, quantity: number) {
    const transaction = await sequelize.transaction();

    try {
      // Step 1: Deduct the amount from the user's balance
      await UserModel.update(
        {
          balance: sequelize.literal(`balance - (${quantity} * product.price)`),
        },
        { where: { id: userId }, transaction }
      );

      // Step 2: Record the order
      const product: any = await ProductModel.findByPk(productId);
      const order = {
        userId,
        productId,
        quantity,
        price: product?.price,
        totalAmount: quantity * product.price,
      };
      await OrderModel.create(order, { transaction });

      // Step 3: Update the product quantity
      await ProductModel.update(
        { quantity: sequelize.literal(`quantity - ${quantity}`) },
        { where: { id: productId }, transaction }
      );

      // Commit the transaction
      await transaction.commit();

      console.log("Order placed successfully!");
    } catch (error) {
      // If any part of the transaction fails, roll back the entire transaction
      await transaction.rollback();
      console.error("Order placement failed:", error);
    }
  }

  // Example usage
  // placeOrder(userId, productId, quantity);
}
