import { User } from "../models/userModel";
import { Request, Response, response } from "express";
import { AuthUtils } from "../utils/authUtils";
import { PasswordHelper } from "../helpher/passwordHelper";
import JwtHelper from "../helpher/twtAuthToken";
import ResponseBuilder from "../helpher/responseBuilder";
import sendEmail from "../helpher/nodemailer";
// import { sendMail } from "../helpher/nodemailer";
const l10n = require("jm-ez-l10n");

export class AuthController {
  private authUtils: AuthUtils;

  constructor() {
    this.authUtils = new AuthUtils();
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
        await sendEmail(firstName, email, password);
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
      const payload: User = {
        accessToken: await JwtHelper.generateToken(
          { userId: userDetails._id },
          jwtExp
        ),
      };
      const updateUser: any = await this.authUtils.updateUser(
        payload,
        userDetails._id
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
}
