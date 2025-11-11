import { Router } from "express";

import { validateBody } from "../middlewares/validateBody.js";
import {
  createUserValidationSchema,
  updateUserValidationSchema,
} from "../validation/userSchemas.js";
import { ctrlWrapper } from "../utils/ctrlWrapper.js";
import {
  createUser,
  deleteUser,
  getUser,
  getUsers,
  updateUser,
} from "../controllers/userController.js";

const router = Router();

router.get("/", ctrlWrapper(getUsers));

router.get("/:id", ctrlWrapper(getUser));

router.post(
  "/",
  validateBody(createUserValidationSchema),
  ctrlWrapper(createUser)
);

router.put(
  "/:id",
  validateBody(updateUserValidationSchema),
  ctrlWrapper(updateUser)
);

router.delete("/:id", ctrlWrapper(deleteUser));

export default router;
