import { Router } from "express";

import { validateBody } from "../middlewares/validateBody.js";
import {
  createPriceValidationSchema,
  updatePriceValidationSchema,
} from "../validation/priceSchemas.js";
import { ctrlWrapper } from "../utils/ctrlWrapper.js";
import {
  getAllPrices,
  getPrice,
  createPrice,
  updatePrice,
  deletePrice,
} from "../controllers/priceController.js";

const router = Router();

router.get("/", ctrlWrapper(getAllPrices));
router.get("/:id", ctrlWrapper(getPrice));

router.post(
  "/",
  validateBody(createPriceValidationSchema),
  ctrlWrapper(createPrice)
);

router.put(
  "/:id",
  validateBody(updatePriceValidationSchema),
  ctrlWrapper(updatePrice)
);

router.delete("/:id", ctrlWrapper(deletePrice));

export default router;
