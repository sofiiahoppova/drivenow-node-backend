import { PrismaClient } from "@prisma/client";
import createHttpError from "http-errors";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();

export const getAllUsers = async (req, res) => {
  const users = await prisma.user.findMany();

  return res.status(200).json({
    status: 200,
    message: `Successfully found users`,
    data: users,
  });
};

export const getUser = async (req, res) => {
  const user = await prisma.user.findUnique({
    where: { id: parseInt(req.user.id) },
    include: { bookings: true },
  });

  if (!user) {
    throw createHttpError(404, "User not found");
  }

  return res.status(200).json({
    status: 200,
    message: `Successfully found user with id ${req.user.id}`,
    data: user,
  });
};

export const updateUser = async (req, res) => {
  const id = req.user.id;
  const user = await prisma.user.findUnique({
    where: { id: parseInt(id) },
  });

  if (!user) {
    throw createHttpError(404, "User not found");
  }

  if (!(await bcrypt.compare(req.body.password, user.password))) {
    throw createHttpError(401, "Wrong password. Unauthorised");
  }

  if (req.body.phoneNumber) {
    const existingUser = await prisma.user.findFirst({
      where: {
        phoneNumber: req.body.phoneNumber,
        NOT: { id: parseInt(id) },
      },
    });
    if (existingUser) {
      throw createHttpError(409, "User with this phone number already exists");
    }
  }

  if (req.body.email) {
    const existingUser = await prisma.user.findFirst({
      where: { email: req.body.email },
      NOT: { id: parseInt(id) },
    });

    if (existingUser) {
      throw createHttpError(409, `${req.body.email} is already taken`);
    }
  }

  const hashedPassword = await bcrypt.hash(req.body.password, 10);

  const updatedUser = await prisma.user.update({
    data: { ...req.body, password: hashedPassword },
    where: { id: parseInt(id) },
  });

  return res.status(200).json({
    status: 200,
    message: `Successfully updated user with id ${id}`,
    data: updatedUser,
  });
};

export const deleteUser = async (req, res) => {
  const user = await prisma.user.findUnique({
    where: { id: parseInt(req.user.id) },
  });

  if (!user) {
    throw createHttpError(404, "User not found");
  }

  await prisma.user.delete({ where: { id: parseInt(req.params.id) } });

  return res.status(204).send();
};
