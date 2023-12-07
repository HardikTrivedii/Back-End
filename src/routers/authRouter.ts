import { Router } from "express";
import { AuthController } from "../controllers/authController";
import { AuthMiddleware } from "../middleware/authMiddleware";
import { Validator } from "../validate";
import { AuthValidator } from "../validator/authValidator";
import { Middleware } from "../middleware";
const router: Router = Router();
const authController: AuthController = new AuthController();
const authMiddleware: AuthMiddleware = new AuthMiddleware();
const v: Validator = new Validator();
const authValidator: AuthValidator = new AuthValidator();
const middleware: Middleware = new Middleware();

router.post(
  "/register",
  v.validateRequest(authValidator.registrationSchema),
  authMiddleware.checkForUniqueEmail,
  authController.registerUser
);

router.post(
  "/login",
  v.validateRequest(authValidator.loginSchema),
  authMiddleware.checkForValidEmail,
  authMiddleware.checkPassword,
  authController.login
);

router.post(
  "/forgot-password",
  v.validateRequest(authValidator.forgotPasswordSchema),
  authMiddleware.checkForValidEmail,
  authController.forgotPassword
);

router.post(
  "/reset-password",
  v.validateRequest(authValidator.resetPasswordSchema),
  authMiddleware.checkForValidEmail,
  authController.resetPassword
);

router.post(
  "/update-password",
  v.validateRequest(authValidator.updatesPasswordSchema),
  middleware.authenticate,
  authController.updatePassword
);

export const authRouter: Router = router;
