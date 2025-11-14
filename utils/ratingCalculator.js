import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const ratingCalc = async (id) => {
  let counter = 0;
  let rating = 0;

  const reviews = await prisma.review.findMany({
    where: { carId: parseInt(id) },
    select: { rating: true },
  });

  if (!reviews.length) return [0, 0.0];

  reviews.forEach((rate) => {
    rating += rate.rating;
    counter += 1;
  });
  const averageRating = rating / counter;
  return [counter, averageRating];
};
