import { PrismaClient } from "@prisma/client";
import createHttpError from "http-errors";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

import {
  generateAccessToken,
  generateRefreshToken,
} from "../utils/generateToken.js";

const prisma = new PrismaClient();

export const registerUser = async (req, res) => {
  if (await prisma.user.findUnique({ where: { email: req.body.email } })) {
    throw createHttpError(409, `${req.body.email} user already exists`);
  }

  const hashedPassword = await bcrypt.hash(req.body.password, 10);

  const newUser = await prisma.user.create({
    data: { ...req.body, password: hashedPassword },
  });

  return res.status(201).json({
    status: 200,
    message: "User registered successfully",
    data: newUser,
  });
};

export const loginUser = async (req, res) => {
  const user = await prisma.user.findUnique({
    where: { email: req.body.email },
  });

  if (!user) {
    throw createHttpError(404, "User not found");
  }

  if (!(await bcrypt.compare(req.body.password, user.password))) {
    throw createHttpError(401, "Wrong password. Unauthorised");
  }

  const accessToken = generateAccessToken(user.id);
  const refreshToken = generateRefreshToken(user.id);

  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    secure: true,
    sameSite: "strict",
  });

  return res.status(200).json({
    status: 200,
    message: `User ${user.id} logged in`,
    accessToken,
  });
};

export const refreshUser = async (req, res) => {
  const refreshToken = req.cookies.refreshToken;

  if (refreshToken == null) {
    throw createHttpError(401, "Authorization refresh token is not provided");
  }

  jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, payload) => {
    if (err) {
      throw createHttpError(403, "Forbidden", { message: err.message });
    }
    const accessToken = generateAccessToken(payload.id);
    return res.status(200).json({ accessToken });
  });
};

export const loguotUser = (req, res) => {
  res.clearCookie("refreshToken");
  res.status(204).send("Logged out successfully");
};
