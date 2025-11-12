import Joi from "joi";

export const createCarValidationSchema = Joi.object({
  serialNumber: Joi.string().max(20).required().messages({
    "string.empty": "Serial number is required",
    "string.alphanum": "Serial number can contain only letters and numbers",
    "string.max": "Serial number must not exceed 20 characters",
    "any.required": "Please provide the car's serial number",
  }),

  brand: Joi.string().max(30).required().messages({
    "string.base": "Brand must be a string",
    "string.empty": "Brand is required",
    "string.max": "Brand name must not exceed 30 characters",
    "any.required": "Please provide the car brand",
  }),

  model: Joi.string().max(30).required().messages({
    "string.empty": "Model is required",
    "string.max": "Model name must not exceed 30 characters",
    "any.required": "Please provide the car model",
  }),

  carClass: Joi.string()
    .valid("economy", "compact", "midsize", "SUV", "premium")
    .required()
    .messages({
      "any.only":
        "Class must be one of: economy, compact, midsize, SUV, premium",
      "any.required": "Please specify the car class",
    }),

  year: Joi.number()
    .integer()
    .min(1900)
    .max(new Date().getFullYear() + 1)
    .required()
    .messages({
      "number.base": "Year must be a number",
      "number.min": "Year cannot be earlier than 1900",
      "number.max": "Year cannot be greater than the current year",
      "any.required": "Please provide the car year",
    }),

  seats: Joi.number().integer().min(1).max(10).required().messages({
    "number.base": "Seats must be a number",
    "number.min": "A car must have at least one seat",
    "number.max": "Number of seats cannot exceed 10",
    "any.required": "Please provide the number of seats",
  }),

  fuelType: Joi.string()
    .valid("petrol", "diesel", "hybrid", "electric", "gas")
    .required()
    .messages({
      "any.only":
        "Fuel type must be one of: petrol, diesel, hybrid, electric, gas",
      "any.required": "Please specify the fuel type",
    }),

  transmission: Joi.string().valid("automatic", "manual").required().messages({
    "any.only": "Transmission must be either 'automatic' or 'manual'",
    "any.required": "Please specify the transmission type",
  }),

  consumption: Joi.number().required().messages({
    "number.base": "Consumption must be a number",
    "any.required": "Please provide fuel consumption",
  }),

  imageUrl: Joi.string().uri().required().messages({
    "string.uri": "Image URL must be a valid link",
    "any.required": "Please add an image of the car",
  }),

  priceId: Joi.number().integer().messages({
    "number.base": "Price Id must be a number",
    "number.integer": "Price Id must be a valid integer",
  }),
});

export const updateCarValidationSchema = createCarValidationSchema.fork(
  [
    "serialNumber",
    "brand",
    "model",
    "carClass",
    "year",
    "seats",
    "fuelType",
    "transmission",
    "consumption",
    "imageUrl",
    "priceId",
  ],
  (schema) => schema.optional()
);

// Object.keys(createCarValidationSchema)
