import { User } from "../models/user.model";
import { Request, Response, response } from "express";
import { AuthUtils } from "../utils/auth.utils";
import { PasswordHelper } from "../helpher/passwordHelper";
import JwtHelper from "../helpher/twtAuthToken";
import ResponseBuilder from "../helpher/responseBuilder";
import generateOTP from "../helpher/optGenerate";
import { SendEmail } from "../helpher/nodemailer";
const l10n = require("jm-ez-l10n");

export class AuthController {
  private authUtils: AuthUtils;
  private sendEmail: SendEmail;

  constructor() {
    this.authUtils = new AuthUtils();
    this.sendEmail = new SendEmail();
  }
  public registerUser = async (req: Request, res: Response) => {
    try {
      const { firstName, lastName, email, password } = req.body;
      const userData: User = {
        firstName,
        lastName,
        email,
        password: await PasswordHelper.hashPassword(password),
      };
      const result = await this.authUtils.registerUser(userData);
      if (result) {
        await this.sendEmail.sendLoginEmail(firstName, email, password);
        return res.json(result);
      }
    } catch (error: any) {
      console.error(error);
    }
  };

  public login = async (req: any, res: Response) => {
    try {
      const userDetails: any = req.user;
      const jwtExp: any = Math.floor(Date.now() / 1000) + 60 * 60;
      const payload: Record<string, any> = {
        accessToken: await JwtHelper.generateToken(userDetails, jwtExp),
      };
      const updateUser: any = await this.authUtils.updateUser(
        payload,
        userDetails.id
      );
      if (updateUser && updateUser.statusCode === 200) {
        return res.json(
          ResponseBuilder.success(
            {
              accessToken: payload.accessToken,
              userDetails,
            },
            l10n.t("USER_LOGIN_SUCESSFULLY")
          )
        );
      } else {
        return res.json(ResponseBuilder.notFound());
      }
    } catch (error) {
      console.log(error);
    }
  };

  public forgotPassword = async (req: any, res: Response) => {
    try {
      const userDetails = req.user;
      const otp = await generateOTP();
      const payload: User = {
        otp: Number(otp),
        otpTimestamp: Date.now(),
      };
      console.log("payload", payload);
      await this.authUtils.updateUser(payload, userDetails.id);
      await this.sendEmail.forgotPasswordEmail(
        userDetails.email,
        otp,
        userDetails.firstName
      );

      return res.json(
        ResponseBuilder.success(userDetails.email, l10n.t("OTP_SET"))
      );
    } catch (error) {
      console.log(error);
    }
  };

  public resetPassword = async (req: any, res: Response) => {
    try {
      const userDetails: any = req.user;
      const { email, otp, newPassword } = req.body;
      if (email === userDetails.email && Number(otp) === userDetails.otp) {
        const currentTime = Date.now();
        const otpTimestamp = userDetails.otpTimestamp || 0;
        const timeElapsed = currentTime - otpTimestamp;

        if (timeElapsed <= 120000) {
          // Reset the password (for simplicity, updating in-memory database)
          const payload: User = {
            password: await PasswordHelper.hashPassword(newPassword),
            otp: 0,
            otpTimestamp: 0,
          };
          await this.authUtils.updateUser(payload, userDetails.id);
          await this.sendEmail.updatePasswordEmail(
            newPassword,
            email,
            userDetails.firstName
          );
          res.json(ResponseBuilder.success(email, l10n.t("PASSWORD_RESET")));
        } else {
          res
            .status(401)
            .json(ResponseBuilder.invalidOTP(l10n.t("OTP_EXPRIED")));
        }
      } else {
        res.status(401).json(ResponseBuilder.invalidOTP(l10n.t("INVALID_OTP")));
      }
    } catch (error) {
      console.log(error);
    }
  };

  public updatePassword = async (req: any, res: Response) => {
    try {
      const userDetails = req.user;
      const { newPassword, oldPassword } = req.body;
      const checkOldPassword = await this.authUtils.checkPassword(
        userDetails.email,
        oldPassword
      );
      if (!checkOldPassword) {
        return res.json(ResponseBuilder.invalidPassword());
      }
      const payload: User = {
        password: await PasswordHelper.hashPassword(newPassword),
      };
      const updateUser: any = await this.authUtils.updateUser(
        payload,
        userDetails.id
      );
      if (updateUser && updateUser.statusCode === 200) {
        await this.sendEmail.updatePasswordEmail(
          newPassword,
          userDetails.email,
          userDetails.firstName
        );
        return res.json(
          ResponseBuilder.success(userDetails, l10n.t("PASSWORD_UPDATE"))
        );
      } else {
        return res.json(ResponseBuilder.notFound());
      }
    } catch (error) {
      console.log(error);
    }
  };
}
