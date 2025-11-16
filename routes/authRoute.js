import { Router } from "express";

import { validateBody } from "../middlewares/validateBody.js";
import { createUserValidationSchema } from "../validation/userSchemas.js";
import { ctrlWrapper } from "../utils/ctrlWrapper.js";
import {
  loginUser,
  loguotUser,
  refreshUser,
  registerUser,
} from "../controllers/authController.js";

const router = Router();

router.post(
  "/register",
  validateBody(createUserValidationSchema),
  ctrlWrapper(registerUser)
);

router.post("/login", ctrlWrapper(loginUser));

router.post("/refresh", ctrlWrapper(refreshUser));

router.delete("/logout", ctrlWrapper(loguotUser));

export default router;
