import Joi from "joi";

export class AuthValidator {
  public registrationSchema = Joi.object({
    firstName: Joi.string()
      .required()
      .messages({ "string.empty": "First name is required" }),
    lastName: Joi.string()
      .required()
      .messages({ "string.empty": "First name is required" }),
    email: Joi.string().email().required().label("Email"),
    password: Joi.string().min(6).required().label("Password"),
  });

  public loginSchema = Joi.object({
    email: Joi.string().email().required().label("Email"),
    password: Joi.string().min(6).required().label("Password"),
  });
}
