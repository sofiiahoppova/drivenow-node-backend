import { Router } from "express";

import { validateBody } from "../middlewares/validateBody.js";
import { updateUserValidationSchema } from "../validation/userSchemas.js";
import { ctrlWrapper } from "../utils/ctrlWrapper.js";
import {
  getAllUsers,
  getUser,
  updateUser,
  deleteUser,
} from "../controllers/userController.js";
import { authenticateToken } from "../middlewares/authenticateToken.js";

const router = Router();

router.get("/", ctrlWrapper(getAllUsers));

router.get("/me", authenticateToken, ctrlWrapper(getUser));

router.put(
  "/me",
  authenticateToken,
  validateBody(updateUserValidationSchema),
  ctrlWrapper(updateUser)
);

router.delete("/me", authenticateToken, ctrlWrapper(deleteUser));

export default router;
