import { Router } from "express";

import {
  createUser,
  deleteUser,
  getUsers,
  updateUser,
} from "../controllers/userController.js";
import { ctrlWrapper } from "../utils/ctrlWrapper.js";

const router = Router();

router.post("/", ctrlWrapper(createUser));

router.get("/", ctrlWrapper(getUsers));

router.put("/:id", ctrlWrapper(updateUser));

router.delete("/:id", ctrlWrapper(deleteUser));

export default router;
