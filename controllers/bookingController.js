import createHttpError from "http-errors";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const getMyBookings = async (req, res) => {
  const bookings = await prisma.booking.findMany({
    where: { userId: req.user.id },
    include: {
      car: { select: { brand: true, model: true } },
      user: { select: { fullName: true, email: true } },
    },
  });

  return res.status(200).json({
    status: 200,
    message: `Successfully found bookings`,
    data: bookings,
  });
};

export const getBooking = async (req, res) => {
  const { id } = req.params;
  const booking = await prisma.booking.findUnique({
    where: { id: parseInt(id) },
    include: {
      car: { select: { brand: true, model: true } },
      user: { select: { fullName: true, email: true } },
    },
  });

  if (!booking) {
    throw createHttpError(404, "Booking not found");
  }

  const userId = req.user.id;

  if (booking.userId !== userId) {
    throw createHttpError(403, "Access to the requested resource is forbidden");
  }

  return res.status(200).json({
    status: 200,
    message: `Successfully found booking with id ${id}`,
    data: booking,
  });
};

export const createBooking = async (req, res) => {
  const userId = req.user.id;

  const user = await prisma.user.findUnique({
    where: { id: userId },
  });

  if (!user) {
    throw createHttpError(404, "User with passed id not found");
  }

  if (req.body.phoneNumber) {
    const existingUser = await prisma.user.findFirst({
      where: {
        phoneNumber: req.body.phoneNumber,
        NOT: { id: parseInt(userId) },
      },
    });
    if (existingUser) {
      throw createHttpError(409, "User with this phone number already exists");
    }
  }

  if (req.body.email) {
    const existingUser = await prisma.user.findFirst({
      where: { email: req.body.email },
      NOT: { id: parseInt(userId) },
    });

    if (existingUser) {
      throw createHttpError(409, `${req.body.email} is already taken`);
    }
  }

  const updatedUser = await prisma.user.update({
    data: {
      ...req.body.user,
      dateOfBirth: new Date(req.body.user.dateOfBirth),
    },
    where: { id: parseInt(userId) },
  });

  const car = await prisma.car.findUnique({ where: { id: req.body.carId } });

  if (!car) {
    throw createHttpError(404, "Car with passed id not found");
  }

  const newBooking = await prisma.booking.create({
    data: {
      plan: req.body.plan,
      carId: req.body.carId,
      startDate: new Date(req.body.startDate),
      endDate: new Date(req.body.endDate),
      userId,
    },
  });

  return res.status(201).json({
    status: 200,
    message: "Successfully added booking to database",
    data: { ...newBooking, user: updatedUser },
  });
};

export const updateBooking = async (req, res) => {
  const { id } = req.params;
  const userId = req.user.id;
  const booking = await prisma.booking.findUnique({
    where: { id: parseInt(id) },
  });

  if (!booking) {
    throw createHttpError(404, "Review not found");
  }

  if (booking.userId !== userId) {
    throw createHttpError(403, "Access to the requested resource is forbidden");
  }

  let startDate, endDate;

  if (req.body.startDate) startDate = new Date(req.body.startDate);
  if (req.body.endDate) endDate = new Date(req.body.endDate);

  const updatedBooking = await prisma.booking.update({
    data: {
      ...req.body,
      startDate: startDate || booking.startDate,
      endDate: endDate || booking.endDate,
    },
    where: { id: parseInt(id) },
  });

  return res.status(200).json({
    status: 200,
    message: `Successfully updated booking with id ${id}`,
    data: updatedBooking,
  });
};

export const deleteBooking = async (req, res) => {
  const userId = req.user.id;
  const booking = await prisma.booking.findUnique({
    where: { id: parseInt(req.params.id) },
  });

  if (!booking) {
    throw createHttpError(404, "Booking not found");
  }

  if (booking.userId !== userId) {
    throw createHttpError(403, "Access to the requested resource is forbidden");
  }

  await prisma.booking.delete({ where: { id: parseInt(req.params.id) } });

  return res.status(204).send();
};
