import { PrismaClient } from "@prisma/client";
import createHttpError from "http-errors";
import bcrypt from "bcrypt";
import nodemailer from "nodemailer";
import jwt from "jsonwebtoken";

import { generateResetToken } from "../utils/generateToken.js";

const prisma = new PrismaClient();

export const forgotPassoword = async (req, res, next) => {
  const { email } = req.body;
  const user = await prisma.user.findUnique({ where: { email } });

  if (!user) {
    throw createHttpError(404, "User not found");
  }

  const resetToken = generateResetToken(user.id);

  //   res.cookie("resetToken", resetToken, {
  //     httpOnly: true,
  //     secure: true,
  //     sameSite: "strict",
  //   });

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: "sofiabusiness567@gmail.com",
      pass: "ylmn pzbf hgud vccl",
    },
    tls: {
      rejectUnauthorized: false,
    },
  });

  const mailOptions = {
    from: "sofiabusiness567@gmail.com",
    to: email,
    subject: "Password Reset",
    text: `Click the following link to reset your password: http://drivenow/reset-password/${resetToken}`,
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error("Nodemailer error:", error);
      return next(createHttpError(500, "Failed to send reset email."));
    } else {
      console.log(`Email sent: ${info.response}`);
      res
        .status(200)
        .send("Check your email for instructions on resetting your password.");
    }
  });
};

export const resetPassword = async (req, res) => {
  const { token } = req.params;
  let userId;

  try {
    const decoded = jwt.verify(token, process.env.RESET_TOKEN_SECRET);
    userId = decoded.id;
  } catch (err) {
    console.error("Token verification error:", err.message);
    throw createHttpError(403, "Invalid or expired reset token");
  }

  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) {
    throw createHttpError(404, "User associated with this token not found");
  }

  res.status(200).json({
    status: 200,
    message: "Access given successfully",
  });
};

export const updatePassword = async (req, res) => {
  const { password, token } = req.body;
  let userId;

  if (!password || !token) {
    throw createHttpError(400, "Password or token is missing.");
  }

  try {
    const decoded = jwt.verify(token, process.env.RESET_TOKEN_SECRET);
    userId = decoded.id;
  } catch (err) {
    throw createHttpError(
      403,
      "Invalid or expired token. Please restart the process."
    );
  }

  const user = await prisma.user.findUnique({
    where: { id: userId },
  });

  if (!user) {
    return next(createHttpError(404, "User not found."));
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const updatedUser = await prisma.user.update({
    data: {
      password: hashedPassword,
    },
    where: { id: userId },
  });

  return res.status(200).json({
    status: 200,
    message: `Password updated successfully. You can now log in.`,
    data: updatedUser,
  });
};
