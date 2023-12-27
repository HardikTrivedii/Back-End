import { Router } from "express";
import { OrderController } from "../controllers/order.controller";
import { Validator } from "../validate";
import { Middleware } from "../middleware";
import { OrderValidator } from "../validator/order.validator";

const router: Router = Router();
const orderController: OrderController = new OrderController();
const v: Validator = new Validator();
const middleware: Middleware = new Middleware();
const orderValidator: OrderValidator = new OrderValidator();

router.post(
  "/addOrder",
  v.validateRequest(orderValidator.addProductSchema),
  middleware.authenticate,
  orderController.addOrder
);

router.post(
  "/updateOrder",
  middleware.authenticate,
  orderController.updateProduct
);

router.post(
  "/getAllOrdera",
  v.validateRequest(orderValidator.getAllOrder),
  middleware.authenticate,
  orderController.getAllOrder
);

router.post(
  "/getOrderById",
  v.validateRequest(orderValidator.getSingleOrder),
  middleware.authenticate,
  orderController.getOrdertById
);

router.patch(
  "/removeProductById",
  v.validateRequest(orderValidator.removeSingleOrder),
  middleware.authenticate,
  orderController.removeOrder
);

router.post(
  "/getUserOrders",
  middleware.authenticate,
  orderController.getUserOrders
);

export const orderRouter: Router = router;
