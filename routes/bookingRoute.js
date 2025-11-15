import { Router } from "express";

import { validateBody } from "../middlewares/validateBody.js";
import {
  createBookingValidationSchema,
  updateBookingValidationSchema,
} from "../validation/bookingSchemas.js";
import { ctrlWrapper } from "../utils/ctrlWrapper.js";
import {
  getMyBookings,
  getBooking,
  createBooking,
  updateBooking,
  deleteBooking,
} from "../controllers/bookingController.js";

const router = Router();

router.get("/", ctrlWrapper(getMyBookings));
router.get("/:id", ctrlWrapper(getBooking));

router.post(
  "/",
  validateBody(createBookingValidationSchema),
  ctrlWrapper(createBooking)
);

router.put(
  "/:id",
  validateBody(updateBookingValidationSchema),
  ctrlWrapper(updateBooking)
);

router.delete("/:id", ctrlWrapper(deleteBooking));

export default router;
