import { Router } from "express";

import { validateBody } from "../middlewares/validateBody.js";
import {
  createCarValidationSchema,
  updateCarValidationSchema,
} from "../validation/carSchemas.js";
import { ctrlWrapper } from "../utils/ctrlWrapper.js";
import {
  getAllCars,
  getCar,
  createCar,
  updateCar,
  deleteCar,
} from "../controllers/carController.js";

const router = Router();

router.get("/", ctrlWrapper(getAllCars));
router.get("/:id", ctrlWrapper(getCar));

router.post(
  "/",
  validateBody(createCarValidationSchema),
  ctrlWrapper(createCar)
);

router.put(
  "/:id",
  validateBody(updateCarValidationSchema),
  ctrlWrapper(updateCar)
);

router.delete("/:id", ctrlWrapper(deleteCar));

export default router;
