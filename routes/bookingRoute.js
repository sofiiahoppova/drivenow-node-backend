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
import { authenticateToken } from "../middlewares/authenticateToken.js";

const router = Router();

router.get("/", authenticateToken, ctrlWrapper(getMyBookings));
router.get("/:id", authenticateToken, ctrlWrapper(getBooking));

router.post(
  "/",
  authenticateToken,
  validateBody(createBookingValidationSchema),
  ctrlWrapper(createBooking)
);

router.put(
  "/:id",
  authenticateToken,
  validateBody(updateBookingValidationSchema),
  ctrlWrapper(updateBooking)
);

router.delete("/:id", authenticateToken, ctrlWrapper(deleteBooking));

export default router;
