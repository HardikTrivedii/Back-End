import { Router } from "express";
import { ProductController } from "../controllers/product.controller";
import { Validator } from "../validate";
import { Middleware } from "../middleware";
import { ProductValidator } from "../validator/product.validater";

const router: Router = Router();
const productController: ProductController = new ProductController();
const v: Validator = new Validator();
const middleware: Middleware = new Middleware();
const productValidator: ProductValidator = new ProductValidator();

router.post(
  "/addProduct",
  v.validateRequest(productValidator.addProductSchema),
  middleware.authenticate,
  productController.addProducts
);

router.post(
  "/updateProduct",
  middleware.authenticate,
  productController.updateProduct
);

router.get(
  "/getAllProducts",
  // v.validateRequest(productValidator.getAllProducts),
  // middleware.authenticate,
  productController.getAllProducts
);
router.post(
  "/getProductById",
  v.validateRequest(productValidator.getSingleProduct),
  middleware.authenticate,
  productController.getProductById
);

router.patch(
  "/removeProductById",
  v.validateRequest(productValidator.removeSingleProduct),
  middleware.authenticate,
  productController.removeProduct
);
export const productRouter: Router = router;
