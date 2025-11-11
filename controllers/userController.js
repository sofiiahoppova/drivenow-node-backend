import createHttpError from "http-errors";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const getUsers = async (req, res) => {
  const users = await prisma.user.findMany();

  return res.status(200).json({
    status: 200,
    message: `Successfully found users`,
    data: users,
  });
};

export const getUser = async (req, res) => {
  const { id } = req.params;
  const user = await prisma.user.findUnique({ where: { id: parseInt(id) } });

  return res.status(200).json({
    status: 200,
    message: `Successfully found user with id ${id}`,
    data: user,
  });
};

export const createUser = async (req, res) => {
  if (await prisma.user.findUnique({ where: { email: req.body.email } })) {
    throw createHttpError(409, `${req.body.email} user already exists`);
  }

  const newUser = await prisma.user.create({
    data: { ...req.body },
  });

  return res.status(201).json({
    status: 200,
    message: "Successfully created user",
    data: newUser,
  });
};

export const updateUser = async (req, res) => {
  const { id } = req.params;
  const user = await prisma.user.findUnique({
    where: { id: parseInt(id) },
  });

  if (!user) {
    throw createHttpError(404, "User not found");
  }

  const existingUser = await prisma.user.findUnique({
    where: {
      phoneNumber: req.body.phoneNumber,
      NOT: { id: parseInt(id) },
    },
  });
  if (existingUser) {
    throw createHttpError(422, "User with this phone number already exists");
  }

  if (req.body.email) {
    const existingUser = await prisma.user.findUnique({
      where: { email: req.body.email },
    });

    if (existingUser && existingUser.id !== user.id) {
      throw createHttpError(409, `${req.body.email} is already taken`);
    }
  }

  const updatedUser = await prisma.user.update({
    data: { ...req.body },
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
    where: { id: parseInt(req.params.id) },
  });

  if (!user) {
    throw createHttpError(404, "User not found");
  }

  await prisma.user.delete({ where: { id: parseInt(req.params.id) } });

  return res
    .status(204)
    .json({ status: 204, message: "User deleted succesfully" });
};
