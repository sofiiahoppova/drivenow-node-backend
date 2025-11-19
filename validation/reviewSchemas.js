import Joi from "joi";

export const createReviewValidationSchema = Joi.object({
  description: Joi.string().required().messages({
    "string.base": "Description must be a string",
    "string.empty": "Description is required",
    "any.required": "Please provide the description",
  }),
  rating: Joi.number().min(0).max(5).required().messages({
    "number.base": "Rating must be a number",
    "any.required": "Please add rating",
  }),
  carId: Joi.number().integer().required().messages({
    "number.base": "Car Id must be a number",
    "number.integer": "Car Id must be a valid integer",
    "any.required": "Please add car id",
  }),
});

export const updateReviewValidationSchema = createReviewValidationSchema.fork(
  ["description", "rating", "carId"],
  (schema) => schema.optional()
);
