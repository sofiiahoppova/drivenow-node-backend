import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const getUsers = async (req, res) => {
  try {
    const users = await prisma.user.findMany();

    return res.status(200).json(users);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

export const createUser = async (req, res) => {
  try {
    if (!req.body.fullName || !req.body.email || !req.body.password) {
      return res
        .status(422)
        .json({ error: "Full name, email and password is required" });
    }

    if (await prisma.user.findUnique({ where: { email: req.body.email } })) {
      return res
        .status(409)
        .json({ error: `${req.body.email} user already exists` });
    }

    const newUser = await prisma.user.create({
      data: {
        fullName: req.body.fullName,
        email: req.body.email,
        password: req.body.password,
      },
    });

    return res.status(201).json(newUser);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

export const updateUser = async (req, res) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: parseInt(req.params.id) },
    });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    if (!req.body) {
      return res.status(422).json({ error: "Property is required" });
    }

    if (req.body.email) {
      const existingUser = await prisma.user.findUnique({
        where: { email: req.body.email },
      });

      if (existingUser && existingUser.id !== user.id) {
        return res
          .status(409)
          .json({ error: `${req.body.email} is already taken` });
      }
    }

    const updatedUser = await prisma.user.update({
      data: { ...req.body },
      where: { id: parseInt(req.params.id) },
    });

    return res.status(200).json(updatedUser);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

export const deleteUser = async (req, res) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: parseInt(req.params.id) },
    });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    await prisma.user.delete({ where: { id: parseInt(req.params.id) } });

    return res.status(204).json({ message: "User deleted succesfully" });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};
