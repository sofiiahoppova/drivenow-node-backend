import { Router } from "express";

import { validateBody } from "../middlewares/validateBody.js";
import {
  createReviewValidationSchema,
  updateReviewValidationSchema,
} from "../validation/reviewSchemas.js";
import { ctrlWrapper } from "../utils/ctrlWrapper.js";
import {
  getAllReviews,
  getReview,
  createReview,
  updateReview,
  deleteReview,
} from "../controllers/reviewController.js";

const router = Router();

router.get("/", ctrlWrapper(getAllReviews));
router.get("/:id", ctrlWrapper(getReview));

router.post(
  "/",
  validateBody(createReviewValidationSchema),
  ctrlWrapper(createReview)
);

router.put(
  "/:id",
  validateBody(updateReviewValidationSchema),
  ctrlWrapper(updateReview)
);

router.delete("/:id", ctrlWrapper(deleteReview));

export default router;
