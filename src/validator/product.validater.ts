import Joi from "joi";

export class ProductValidator {
  public addProductSchema = Joi.object({
    name: Joi.string()
      .required()
      .messages({ "string.empty": "Product name is required" }),
    price: Joi.number()
      .required()
      .messages({ "string.empty": "Product price is required" }),
    description: Joi.string()
      .required()
      .messages({ "string.empty": "Product description is required" }),
    image: Joi.string()
      .required()
      .messages({ "string.empty": "Product image is required" }),
  });

  public getAllProducts = Joi.object({
    page: Joi.string()
      .required()
      .messages({ "string.empty": "Page is required" }),
    pageSize: Joi.string()
      .required()
      .messages({ "string.empty": "Page-Size is required" }),
  });

  public getSingleProduct = Joi.object({
    id: Joi.string()
      .required()
      .messages({ "string.empty": "Product ID is required" }),
  });

  public removeSingleProduct = Joi.object({
    id: Joi.string()
      .required()
      .messages({ "string.empty": "Product ID is required" }),
  });
}
