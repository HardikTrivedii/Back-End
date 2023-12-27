import Joi from "joi";

export class AuthValidator {
  public registrationSchema = Joi.object({
    firstName: Joi.string()
      .required()
      .messages({ "string.empty": "First name is required" }),
    lastName: Joi.string()
      .required()
      .messages({ "string.empty": "LastName name is required" }),
    email: Joi.string()
      .email()
      .required()
      .messages({ "string.empty": "Email is required" }),
    password: Joi.string()
      .min(6)
      .required()
      .messages({ "string.empty": "Password is required" }),
  });

  public loginSchema = Joi.object({
    email: Joi.string()
      .email()
      .required()
      .messages({ "string.empty": "Email is required" }),
    password: Joi.string()
      .min(6)
      .required()
      .messages({ "string.empty": "Password is required" }),
  });

  public forgotPasswordSchema = Joi.object({
    email: Joi.string()
      .email()
      .required()
      .messages({ "string.empty": "Email is required" }),
  });

  public resetPasswordSchema = Joi.object({
    email: Joi.string()
      .email()
      .required()
      .messages({ "string.empty": "Email is required" }),

    otp: Joi.number()
      .required()
      .messages({ "string.empty": "OTP is required" }),

    newPassword: Joi.string()
      .min(6)
      .required()
      .messages({ "string.empty": "New Password is required" }),
  });

  public updatesPasswordSchema = Joi.object({
    newPassword: Joi.string()
      .min(6)
      .required()
      .messages({ "string.empty": "New Password is required" }),

    oldPassword: Joi.string()
      .min(6)
      .required()
      .messages({ "string.empty": "New Password is required" }),
  });
}
