import { Request, Response, NextFunction } from "express";
import { AuthUtils } from "../utils/auth.utils";
import ResponseBuilder from "../helpher/responseBuilder";
export class AuthMiddleware {
  private authUtils: AuthUtils;

  constructor() {
    this.authUtils = new AuthUtils();
  }
  public checkForUniqueEmail = async (
    req: any,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const { email } = req.body;
      const result: any = await this.authUtils.checkUserExists(email);
      if (result.statusCode === 200) {
        return res.json(result);
      } else {
        next();
      }
    } catch (error: any) {
      console.log(error.message);
    }
  };

  public checkForValidEmail = async (
    req: any,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const { email } = req.body;
      const checkEmailExists: any = await this.authUtils.checkUserExists(email);
      if (checkEmailExists.statusCode == 404) {
        return res.json(checkEmailExists);
      } else {
        req.user = checkEmailExists.responseBody.data.get({ plain: true });
        next();
      }
    } catch (error) {
      console.error(error);
    }
  };

  public checkPassword = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    const { email, password } = req.body;
    const checkPassword = await this.authUtils.checkPassword(email, password);
    if (!checkPassword) {
      return res.json(ResponseBuilder.invalidPassword());
    } else {
      next();
    }
  };
}
