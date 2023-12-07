import { Request, Response, NextFunction } from "express";
import ResponseBuilder from "./helpher/responseBuilder";
import JwtHelper from "./helpher/twtAuthToken";
export class Middleware {
  public authenticate = async (req: any, res: Response, next: NextFunction) => {
    try {
      const authHeader = req.headers.authorization;
      if (authHeader && authHeader !== null) {
        const [bearer, accessToken] = authHeader.split(" ");
        if (bearer !== "Bearer") {
          return res.json(ResponseBuilder.unauthorized());
        }
        const decoded = await JwtHelper.verifyToken(accessToken);
        if (!decoded) {
          return res.json(ResponseBuilder.unauthorized());
        }
        req.user = decoded;
        next();
      } else {
        return res.json(ResponseBuilder.unauthorized);
      }
    } catch (error) {
      console.log(error);
    }
  };
}
