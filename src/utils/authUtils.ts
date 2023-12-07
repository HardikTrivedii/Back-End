import UserModel from "../models/userModel";
import ResponseBuilder from "../helpher/responseBuilder";
import { User } from "../models/userModel";
import { PasswordHelper } from "../helpher/passwordHelper";
const l10n = require("jm-ez-l10n");

export class AuthUtils {
  public async checkUserExists(email: string) {
    try {
      const status: any = await UserModel.findOne(
        { email: email.toLowerCase() },
        { password: 0, accessToken: 0 }
      ).exec();
      if (status) {
        return ResponseBuilder.success(status, l10n.t("USER_ALREADY_EXIST"));
      } else {
        return ResponseBuilder.notFound();
      }
    } catch (error) {
      console.error(error);
    }
  }

  public async registerUser(userData: User) {
    try {
      const result = await UserModel.create(userData);
      if (result) {
        return ResponseBuilder.success(
          { ...result.toObject(), password: undefined },
          l10n.t("USER_SUCESSFULLY_REGISTER")
        );
      }
      return null;
    } catch (error) {
      console.error(error);
    }
  }

  public async checkPassword(email: string, password: string) {
    const checkUser: any = await UserModel.findOne(
      { email: email.toLocaleLowerCase() },
      { password: 1 }
    );
    if (checkUser) {
      return await PasswordHelper.verifyPassword(password, checkUser?.password);
    }
  }

  public async updateUser(payload: User | any, userId: string) {
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
      return ResponseBuilder.success(
        { userId: update._id },
        l10n.t("USER_UPDATED_SUCESSFULLY")
      );
    } else {
      return ResponseBuilder.error(update.message);
    }
  }

  private async getUserDetails(id: string) {
    return await UserModel.findById(id).exec();
  }
}
