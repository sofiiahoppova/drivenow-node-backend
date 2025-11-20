import createHttpError from "http-errors";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const getAllReviews = async (req, res) => {
  const reviews = await prisma.review.findMany({
    include: {
      car: {
        select: {
          brand: true,
          model: true,
        },
      },
      user: { select: { fullName: true } },
    },
  });

  return res.status(200).json({
    status: 200,
    message: `Successfully found review categories`,
    data: reviews,
  });
};

export const getReview = async (req, res) => {
  const { id } = req.params;
  const review = await prisma.review.findUnique({
    where: { id: parseInt(id) },
    include: {
      car: {
        select: {
          brand: true,
          model: true,
        },
      },
      user: { select: { fullName: true } },
    },
  });

  return res.status(200).json({
    status: 200,
    message: `Successfully found review with id ${id}`,
    data: review,
  });
};

export const createReview = async (req, res) => {
  const userId = req.user.id;
  const user = await prisma.user.findUnique({
    where: { id: userId },
  });

  if (!user) {
    throw createHttpError(404, "User with passed id not found");
  }

  const car = await prisma.car.findUnique({ where: { id: req.body.carId } });

  if (!car) {
    throw createHttpError(404, "Car with passed id not found");
  }

  const newReview = await prisma.review.create({
    data: { ...req.body, userId },
  });

  // Оновлення середнього рейтингу та кількості відгуків
  const [quantity, rating] = await ratingCalc(req.body.carId);

  await prisma.car.update({
    where: { id: req.body.carId },
    data: {
      averageRating: rating,
      reviewCount: quantity,
    },
  });

  return res.status(201).json({
    status: 200,
    message: "Successfully added review to database",
    data: newReview,
  });
};

export const updateReview = async (req, res) => {
  const { id } = req.params;
  const review = await prisma.review.findUnique({
    where: { id: parseInt(id) },
  });

  if (!review) {
    throw createHttpError(404, "Review not found");
  }

  const userId = req.user.id;

  if (review.userId !== userId) {
    throw createHttpError(403, "Access to the requested resource is forbidden");
  }

  const updatedReview = await prisma.review.update({
    data: { ...req.body },
    where: { id: parseInt(id) },
  });

  return res.status(200).json({
    status: 200,
    message: `Successfully updated review with id ${id}`,
    data: updatedReview,
  });
};

export const deleteReview = async (req, res) => {
  const review = await prisma.review.findUnique({
    where: { id: parseInt(req.params.id) },
  });

  if (!review) {
    throw createHttpError(404, "Review not found");
  }
  const userId = req.user.id;

  if (review.userId !== userId) {
    throw createHttpError(403, "Access to the requested resource is forbidden");
  }

  await prisma.review.delete({ where: { id: parseInt(req.params.id) } });

  return res.status(204).send();
};
