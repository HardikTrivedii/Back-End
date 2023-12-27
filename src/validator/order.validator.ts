import Joi from "joi";

export class OrderValidator {
  public addProductSchema = Joi.object({
    productId: Joi.number()
      .required()
      .messages({ "string.empty": "Order Id is required" }),
    quantity: Joi.number()
      .required()
      .messages({ "string.empty": "Order quantity is required" }),
    totalAmount: Joi.number()
      .required()
      .messages({ "string.empty": "Order totalAmount is required" }),
  });

  public getAllOrder = Joi.object({
    page: Joi.string()
      .required()
      .messages({ "string.empty": "Page is required" }),
    pageSize: Joi.string()
      .required()
      .messages({ "string.empty": "Page-Size is required" }),
  });

  public getSingleOrder = Joi.object({
    id: Joi.string()
      .required()
      .messages({ "string.empty": "Product ID is required" }),
  });

  public removeSingleOrder = Joi.object({
    id: Joi.string()
      .required()
      .messages({ "string.empty": "Product ID is required" }),
  });
}
