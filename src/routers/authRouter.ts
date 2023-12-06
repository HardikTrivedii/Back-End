import { Router } from "express";
import { AuthController } from "../controllers/authController";
import { AuthMiddleware } from "../middleware/authMiddleware";
import { Validator } from "../validate";
import { AuthValidator } from "../validator/authValidator";
const router: Router = Router();
const authController = new AuthController();
const authMiddleware = new AuthMiddleware();
const v: Validator = new Validator();
const authValidator = new AuthValidator();

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

export const authRouter: Router = router;
