import createHttpError from "http-errors";
import { PrismaClient } from "@prisma/client";

import { ratingCalc } from "../utils/ratingCalculator.js";

const prisma = new PrismaClient();

export const getAllCars = async (req, res) => {
  const {
    brand,
    transmission,
    carClass,
    seats,
    page = 1,
    perPage = 10,
    startDate,
    endDate,
  } = req.query;

  const filters = {
    ...(seats && { seats: parseInt(seats) }),
    ...(brand && { brand }),
    ...(transmission && { transmission }),
    ...(carClass && { carClass }),
  };

  if (startDate && endDate) {
    filters.bookings = {
      none: {
        AND: [
          { startDate: { lte: new Date(endDate) } },
          { endDate: { gte: new Date(startDate) } },
        ],
      },
    };
  }

  const cars = await prisma.car.findMany({
    where: filters,
    skip: (parseInt(page) - 1) * parseInt(perPage),
    take: parseInt(perPage),
    include: {
      prices: {
        select: {
          dailyPrice: true,
          weekendPrice: true,
          weeklyPrice: true,
          monthlyPrice: true,
        },
      },
      reviews: {
        select: {
          id: true,
          description: true,
          rating: true,
          user: { select: { fullName: true } },
        },
      },
    },
  });

  return res.status(200).json({
    status: 200,
    message: `Successfully found cars`,
    data: cars,
  });
};

export const getCar = async (req, res) => {
  const { id } = req.params;
  const car = await prisma.car.findUnique({
    where: { id: parseInt(id) },
    include: {
      prices: {
        select: {
          dailyPrice: true,
          weekendPrice: true,
          weeklyPrice: true,
          monthlyPrice: true,
        },
      },
    },
  });

  return res.status(200).json({
    status: 200,
    message: `Successfully found car with id ${id}`,
    data: car,
  });
};

export const createCar = async (req, res) => {
  if (
    await prisma.car.findUnique({
      where: { serialNumber: req.body.serialNumber },
    })
  ) {
    throw createHttpError(
      409,
      `Car with this ${req.body.serialNumber} serial number already exists`
    );
  }

  if (req.body.carClass && req.body.priceId) {
    const priceCategory = await prisma.price.findUnique({
      where: { id: req.body.priceId },
    });
    if (priceCategory.carClass != req.body.carClass) {
      throw createHttpError(
        409,
        "Car class and price Id can not represent different classes"
      );
    }
  }

  const [quantity, rating] = await ratingCalc(req.body.id);

  let newCar;

  if (!req.body.priceId) {
    const priceCategory = await prisma.price.findUnique({
      where: { carClass: req.body.carClass },
      select: { id: true },
    });
    newCar = await prisma.car.create({
      data: {
        ...req.body,
        averageRating: rating,
        reviewCount: quantity,
        priceId: priceCategory.id,
      },
    });
  } else {
    newCar = await prisma.car.create({
      data: { ...req.body, averageRating: rating, reviewCount: quantity },
    });
  }

  return res.status(201).json({
    status: 200,
    message: "Successfully added car to database",
    data: newCar,
  });
};

export const updateCar = async (req, res) => {
  const { id } = req.params;
  const car = await prisma.car.findUnique({
    where: { id: parseInt(id) },
  });

  if (!car) {
    throw createHttpError(404, "Car not found");
  }

  if (req.body.serialNumber) {
    const existingCar = await prisma.car.findFirst({
      where: { serialNumber: req.body.serialNumber },
      NOT: { id: parseInt(id) },
    });
    if (existingCar) {
      throw createHttpError(
        409,
        `Car with this ${req.body.serialNumber} serial number already exists`
      );
    }
  }

  if (req.body.carClass && req.body.priceId) {
    const priceCategory = await prisma.price.findUnique({
      where: { id: req.body.priceId },
    });
    if (priceCategory.carClass != req.body.carClass) {
      throw createHttpError(
        409,
        "Car class and price Id can not represent different classes"
      );
    }
  }

  let updatedCar;

  if (req.body.carClass) {
    const priceCategory = await prisma.price.findUnique({
      where: { carClass: req.body.carClass },
      select: { id: true },
    });
    updatedCar = await prisma.car.update({
      data: { ...req.body, priceId: priceCategory.id },
      where: { id: parseInt(id) },
    });
  }
  if (req.body.priceId) {
    const priceCategory = await prisma.price.findUnique({
      where: { id: req.body.priceId },
      select: { id: true, carClass: true },
    });

    if (!priceCategory) {
      throw createHttpError(404, "Price not found");
    }

    updatedCar = await prisma.car.update({
      data: {
        ...req.body,
        priceId: priceCategory.id,
        carClass: priceCategory.carClass,
      },
      where: { id: parseInt(id) },
    });
  } else {
    updatedCar = await prisma.car.update({
      data: { ...req.body },
      where: { id: parseInt(id) },
    });
  }

  return res.status(200).json({
    status: 200,
    message: `Successfully updated car with id ${id}`,
    data: updatedCar,
  });
};

export const deleteCar = async (req, res) => {
  const car = await prisma.car.findUnique({
    where: { id: parseInt(req.params.id) },
  });

  if (!car) {
    throw createHttpError(404, "Car not found");
  }

  await prisma.car.delete({ where: { id: parseInt(req.params.id) } });

  return res.status(204).send();
};
