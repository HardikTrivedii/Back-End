import { UserModel } from "../models/user.model";
import ResponseBuilder from "../helpher/responseBuilder";
import { User } from "../models/user.model";
import { PasswordHelper } from "../helpher/passwordHelper";
import { logMySqlError, logInfo } from "../helpher/logger";
const l10n = require("jm-ez-l10n");

export class AuthUtils {
  public async checkUserExists(email: string) {
    try {
      const status: any = await UserModel.findOne({
        where: { email: email.toLowerCase() },
        attributes: { exclude: ["password", "accessToken", "resetToken"] },
      });

      if (status) {
        logInfo("MySQL operation successfully completed");
        return ResponseBuilder.success(status, l10n.t("USER_ALREADY_EXIST"));
      } else {
        return ResponseBuilder.notFound();
      }
    } catch (error) {
      logMySqlError("Error in MySQL operation", error);
      console.error(error);
    }
  }

  public async registerUser(userData: User) {
    try {
      const result = await UserModel.create(userData);
      if (result) {
        logInfo("MySQL operation successfully completed");
        return ResponseBuilder.success(
          { ...result.get(), password: undefined },
          l10n.t("USER_SUCESSFULLY_REGISTER")
        );
      }
      return null;
    } catch (error) {
      logMySqlError("Error in MySQL operation", error);
      console.error(error);
    }
  }

  public async checkPassword(email: string, password: string) {
    try {
      const checkUser: any = await UserModel.findOne({
        where: {
          email: email.toLocaleLowerCase(),
        },
        attributes: ["password"],
      });
      if (checkUser) {
        logInfo("MySQL operation successfully completed");
        return await PasswordHelper.verifyPassword(
          password,
          checkUser?.password
        );
      }
    } catch (error) {
      logMySqlError("Error in MySQL operation", error);
      console.log(error);
    }
  }

  public async updateUser(payload: User | any, userId: string) {
    try {
      const getUser: any = await this.getUserDetails(userId);
      if (!getUser) {
        return ResponseBuilder.notFound();
      }
      const fieldsToUpdate = [
        "firstName",
        "lastName",
        "email",
        "password",
        "accessToken",
        "resetToken",
        "otp",
        "otpTimestamp",
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
          { userId: update.id },
          l10n.t("USER_UPDATED_SUCESSFULLY")
        );
      } else {
        return ResponseBuilder.error(update.message);
      }
    } catch (error) {
      logMySqlError("Error in MySQL operation", error);
      console.log(error);
    }
  }

  public async getUserDetails(id: string) {
    return await UserModel.findOne({ where: { id: id } });
  }

  public async getAllUsers(page: number, pageSize: number) {
    try {
      const offset = (page - 1) * pageSize;
      const { count, rows: products } = await UserModel.findAndCountAll({
        limit: pageSize,
        offset: offset,
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
        l10n.t("USER_LISTS_SUCESSFULLY")
      );
    } catch (error) {
      logMySqlError("Error in MySQL operation", error);
      console.log(error);
    }
  }
}
