import Joi from "joi";
import { Request, Response, NextFunction } from "express";

export class Validator {
  public validateRequest = (schema: Joi.ObjectSchema<any>) => {
    return (req: Request, res: Response, next: NextFunction) => {
      const { error, value } = schema.validate(req.body, {
        abortEarly: false,
      });

      if (error) {
        const validationErrors = error.details.map((detail) => ({
          field: detail.context?.key,
          message: detail.message,
        }));

        return res.status(400).json({ errors: validationErrors });
      }

      req.body = value; // Replace the original request body with the validated data
      next();
    };
  };
}
