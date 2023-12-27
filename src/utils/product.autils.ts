import { Product, ProductModel } from "../models/product.model";
import ResponseBuilder from "../helpher/responseBuilder";
import { logInfo, logMySqlError } from "../helpher/logger";
import cacheHelper from "../helpher/cacheHelper";
const l10n = require("jm-ez-l10n");

export class ProductUtils {
  public async addProduct(payload: Product) {
    try {
      const result = await ProductModel.create(payload);
      if (result) {
        logInfo("MySQL operation successfully completed");
        return ResponseBuilder.success(
          result,
          l10n.t("PRODUCT_ADDED_SUCESSFULLY")
        );
      }
      return;
    } catch (error) {
      logMySqlError("Error in MySQL operation", error);
      console.log(error);
    }
  }

  public async updateProduct(payload: Product | any, userId: string) {
    try {
      const getUser: any = await this.getProductDetails(userId);

      if (!getUser) {
        return ResponseBuilder.notFound();
      }

      const fieldsToUpdate = [
        "price",
        "name",
        "image",
        "description",
        "addedBy",
      ];

      fieldsToUpdate.forEach((field) => {
        if (payload[field] !== undefined) {
          getUser[field] = payload[field];
        }
      });
      const update: any = await getUser.save();
      if (update) {
        logInfo("MySQL operation successfully completed");
        return ResponseBuilder.success(
          { productId: update.id },
          l10n.t("PRODUCT_UPDATED_SUCESSFULLY")
        );
      } else {
        return ResponseBuilder.error(update.message);
      }
    } catch (error) {
      logMySqlError("Error in MySQL operation", error);
      console.log(error);
    }
  }

  public async getProductDetails(id: string) {
    return await ProductModel.findOne({ where: { id: id } });
  }

  public async removeProduct(id: string) {
    try {
      const result: any = await ProductModel.destroy({ where: { id: id } });

      if (result) {
        logInfo("MySQL operation successfully completed");
        return ResponseBuilder.success(
          result,
          l10n.t("PRODUCT_DELETED_SUCESSFULLY")
        );
      } else {
        return ResponseBuilder.error(result.message);
      }
    } catch (error) {
      logMySqlError("Error in MySQL operation", error);
      console.log(error);
    }
  }

  public async getAllProducts(page: number, pageSize: number) {
    try {
      const pageSize = 10; // Replace with your desired page size
      const offset = 0; // Replace with your desired offset
      // const offset = (page - 1) * pageSize;
      const { count, rows: products } = await ProductModel.findAndCountAll({
        limit: pageSize,
        offset: offset,
      });
      const cacheKey = cacheHelper.generateKey(`${process.env.CASH_KEY}`);
      await cacheHelper.getOrSet(cacheKey, async () => {
        return await products;
      });

      const totalProducts = count;
      const currentPage = page;
      const remainingProducts = totalProducts - offset - products.length;

      const response = {
        totalProducts,
        currentPage,
        pageSize,
        remainingProducts,
        products,
      };
      logInfo("MySQL operation successfully completed");
      return ResponseBuilder.success(
        response,
        l10n.t("PRODUCT_LISTS_GET_SUCCESSFULLY")
      );
    } catch (error) {
      logMySqlError("Error in MySQL operation", error);
      console.log(error);
    }
  }
}
