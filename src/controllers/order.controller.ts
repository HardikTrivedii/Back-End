import { Request, Response } from "express";
import { Order } from "../models/order.model";
import { OrderUtils } from "../utils/order.utils";
import ResponseBuilder from "../helpher/responseBuilder";

export class OrderController {
  private orderUtils: OrderUtils;

  constructor() {
    this.orderUtils = new OrderUtils();
  }

  public addOrder = async (req: any, res: Response) => {
    try {
      const userId = req.user.id;
      const { productId, quantity, totalAmount } = req.body;

      await this.orderUtils.placeOrder(productId, quantity, totalAmount);

      const orderPayload: Order = {
        userId,
        productId,
        quantity,
        orderDate: new Date(),
        status: "pending",
        totalAmount,
      };

      const order: any = await this.orderUtils.createOrder(orderPayload);

      if (order) {
        return res.json(order);
      }
    } catch (error) {
      console.log(error);
    }
  };

  public getAllOrder = async (req: Request, res: Response) => {
    try {
      const { page, pageSize } = req.query;
      const result: any = await this.orderUtils.getAllOrder(
        Number(page),
        Number(pageSize)
      );

      if (result) {
        return res.json(result);
      } else {
        return res.json(ResponseBuilder.notFound());
      }
    } catch (error) {
      console.log(error);
    }
  };

  public getOrdertById = async (req: Request, res: Response) => {
    try {
      const { id } = req.query;
      const result = await this.orderUtils.getOrderDetails(id as any);
      if (result) {
        return res.json(result);
      } else {
        return res.json(ResponseBuilder.notFound());
      }
    } catch (error) {
      console.log(error);
    }
  };

  public getUserOrders = async (req: any, res: Response) => {
    try {
      const userId = req.user.id;
      const result = await this.orderUtils.getUserOrderDetails(userId);
      if (result) {
        return res.json(result);
      } else {
        return res.json(ResponseBuilder.notFound());
      }
    } catch (error) {
      console.log(error);
    }
  };

  public removeOrder = async (req: Request, res: Response) => {
    try {
      const { id } = req.query;
      if (!id || Array.isArray(id)) {
        return res.json(ResponseBuilder.notFound());
      }
      const result: any = await this.orderUtils.removeOrder(id as any);
      if (result) {
        return res.json(result);
      } else {
        return res.json(ResponseBuilder.notFound());
      }
    } catch (error) {}
  };

  public updateProduct = async (req: any, res: Response) => {
    try {
      const userDetails = req.user;
      const { quantity, orderDate } = req.body;
      const orderPayload: Order = {
        quantity,
        orderDate,
      };
      const updateOrder: any = await this.orderUtils.updateOrder(
        orderPayload,
        userDetails.id
      );
      if (updateOrder && updateOrder.statusCode === 200) {
        res.json(updateOrder);
      } else {
        return res.json(ResponseBuilder.notFound());
      }
    } catch (error) {
      console.log(error);
    }
  };
}
