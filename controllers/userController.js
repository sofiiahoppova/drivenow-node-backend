import createHttpError from "http-errors";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const getUsers = async (req, res) => {
  const users = await prisma.user.findMany();

  return res.status(200).json(users);
};

export const createUser = async (req, res) => {
  if (!req.body.fullName || !req.body.email || !req.body.password) {
    throw createHttpError(422, 'Full name, email and password is required"');
  }

  if (await prisma.user.findUnique({ where: { email: req.body.email } })) {
    throw createHttpError(409, `${req.body.email} user already exists`);
  }

  const newUser = await prisma.user.create({
    data: {
      fullName: req.body.fullName,
      email: req.body.email,
      password: req.body.password,
    },
  });

  return res.status(201).json(newUser);
};

export const updateUser = async (req, res) => {
  const user = await prisma.user.findUnique({
    where: { id: parseInt(req.params.id) },
  });

  if (!user) {
    throw createHttpError(404, "User not found");
  }

  if (!req.body) {
    throw createHttpError(422, "Property is required");
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
    where: { id: parseInt(req.params.id) },
  });

  return res.status(200).json(updatedUser);
};

export const deleteUser = async (req, res) => {
  const user = await prisma.user.findUnique({
    where: { id: parseInt(req.params.id) },
  });

  if (!user) {
    throw createHttpError(404, "User not found");
  }

  await prisma.user.delete({ where: { id: parseInt(req.params.id) } });

  return res.status(204).json({ message: "User deleted succesfully" });
};
