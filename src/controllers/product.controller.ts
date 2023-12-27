import { Request, Response } from "express";
// import { Product } from "../models/product.model";
import { ProductUtils } from "../utils/product.autils";
import ResponseBuilder from "../helpher/responseBuilder";
import cacheHelper from "../helpher/cacheHelper";

export class ProductController {
  private productUtils: ProductUtils;

  constructor() {
    this.productUtils = new ProductUtils();
  }
  public addProducts = async (req: any, res: Response) => {
    try {
      const userDetails = req.user;
      const { name, price, description, image, quantity } = req.body;
      const productData = {
        name,
        price,
        description,
        image,
        quantity,
        addedBy: userDetails.id,
      };
      const result: any = await this.productUtils.addProduct(productData);
      if (result) {
        return res.json(result);
      }
    } catch (error) {
      console.log(error);
    }
  };

  public updateProduct = async (req: any, res: Response) => {
    try {
      const userDetails = req.user;
      const { name, price, description, image } = req.body;
      const productPayload = {
        name,
        price,
        description,
        image,
      };
      const updateProduct: any = await this.productUtils.updateProduct(
        productPayload,
        userDetails.id
      );
      if (updateProduct && updateProduct.statusCode === 200) {
        res.json(updateProduct);
      } else {
        return res.json(ResponseBuilder.notFound());
      }
    } catch (error) {
      console.log(error);
    }
  };

  public getAllProducts = async (req: Request, res: Response) => {
    try {
      const { page, pageSize } = req.query;
      const result: any = await this.productUtils.getAllProducts(
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

  public getProductById = async (req: Request, res: Response) => {
    try {
      const { id } = req.query;
      const result = await this.productUtils.getProductDetails(id as any);
      if (result) {
        return res.json(result);
      } else {
        return res.json(ResponseBuilder.notFound());
      }
    } catch (error) {
      console.log(error);
    }
  };

  public removeProduct = async (req: Request, res: Response) => {
    try {
      const { id } = req.query;
      if (!id || Array.isArray(id)) {
        return res.json(ResponseBuilder.notFound());
      }
      const result: any = await this.productUtils.removeProduct(id as any);
      if (result) {
        return res.json(result);
      } else {
        return res.json(ResponseBuilder.notFound());
      }
    } catch (error) {}
  };
}
