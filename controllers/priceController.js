import createHttpError from "http-errors";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const getAllPrices = async (req, res) => {
  const prices = await prisma.price.findMany();

  return res.status(200).json({
    status: 200,
    message: `Successfully found price categories`,
    data: prices,
  });
};

export const getPrice = async (req, res) => {
  const { id } = req.params;
  const price = await prisma.price.findUnique({ where: { id: parseInt(id) } });

  return res.status(200).json({
    status: 200,
    message: `Successfully found price category with id ${id}`,
    data: price,
  });
};

export const createPrice = async (req, res) => {
  if (
    await prisma.price.findUnique({
      where: { carClass: req.body.carClass },
    })
  ) {
    throw createHttpError(
      409,
      `Price related to this "${req.body.carClass}" car class already exists`
    );
  }

  const newPrice = await prisma.price.create({
    data: { ...req.body },
  });

  return res.status(201).json({
    status: 200,
    message: "Successfully added price category to database",
    data: newPrice,
  });
};

export const updatePrice = async (req, res) => {
  const { id } = req.params;
  const price = await prisma.price.findUnique({
    where: { id: parseInt(id) },
  });

  if (!price) {
    throw createHttpError(404, "Price not found");
  }

  if (req.body.carClass) {
    const existingPrice = await prisma.price.findUnique({
      where: {
        carClass: req.body.carClass,
        NOT: { id: parseInt(id) },
      },
    });
    if (existingPrice) {
      throw createHttpError(
        409,
        `Price related to this "${req.body.carClass}" car class already exists`
      );
    }
  }

  const updatedPrice = await prisma.price.update({
    data: { ...req.body },
    where: { id: parseInt(id) },
  });

  return res.status(200).json({
    status: 200,
    message: `Successfully updated price category with id ${id}`,
    data: updatedPrice,
  });
};

export const deletePrice = async (req, res) => {
  const price = await prisma.price.findUnique({
    where: { id: parseInt(req.params.id) },
  });

  if (!price) {
    throw createHttpError(404, "Price not found");
  }

  await prisma.price.delete({ where: { id: parseInt(req.params.id) } });

  return res.status(204).send();
};
