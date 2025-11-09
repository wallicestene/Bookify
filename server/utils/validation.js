const Joi = require("joi");

// User validation schemas
const signupSchema = Joi.object({
  first_name: Joi.string().trim().min(2).max(50).required().messages({
    "string.min": "First name must be at least 2 characters",
    "string.max": "First name cannot exceed 50 characters",
    "any.required": "First name is required",
  }),
  last_name: Joi.string().trim().min(2).max(50).required().messages({
    "string.min": "Last name must be at least 2 characters",
    "string.max": "Last name cannot exceed 50 characters",
    "any.required": "Last name is required",
  }),
  email: Joi.string().email().required().messages({
    "string.email": "Please provide a valid email",
    "any.required": "Email is required",
  }),
  password: Joi.string()
    .min(8)
    .pattern(
      new RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&])[A-Za-z\\d@$!%*?&]")
    )
    .required()
    .messages({
      "string.min": "Password must be at least 8 characters",
      "string.pattern.base":
        "Password must contain uppercase, lowercase, number, and special character",
      "any.required": "Password is required",
    }),
});

const loginSchema = Joi.object({
  email: Joi.string().email().required().messages({
    "string.email": "Please provide a valid email",
    "any.required": "Email is required",
  }),
  password: Joi.string().required().messages({
    "any.required": "Password is required",
  }),
});

// Property validation schema
const propertySchema = Joi.object({
  owner: Joi.string().required(),
  name: Joi.string().trim().min(5).max(100).required(),
  address: Joi.string().trim().min(10).max(200).required(),
  description: Joi.string().trim().min(20).max(2000).required(),
  images: Joi.array().items(Joi.string().uri()).min(1).required(),
  whereToSleep: Joi.array().items(
    Joi.object({
      bedroom: Joi.alternatives().try(
        Joi.number().integer().min(1),
        Joi.string().min(1)
      ).required(),
      sleepingPosition: Joi.object({
        kingBed: Joi.number().integer().min(0).default(0),
        queenBed: Joi.number().integer().min(0).default(0),
        singleBed: Joi.number().integer().min(0).default(0),
        sofa: Joi.number().integer().min(0).default(0),
      }).required(),
    })
  ).min(1).required(),
  guests: Joi.number().integer().min(1).required(),
  price: Joi.number().positive().required(),
  amenities: Joi.array().items(Joi.string()).default([]),
  tags: Joi.array().items(Joi.string()).default([]),
});

// Middleware to validate request body
const validate = (schema) => {
  return (req, res, next) => {
    const { error, value } = schema.validate(req.body, {
      abortEarly: false,
      stripUnknown: true,
    });

    if (error) {
      const errors = error.details.map((detail) => detail.message);
      return res.status(400).json({
        success: false,
        message: "Validation failed",
        errors,
      });
    }

    req.body = value;
    next();
  };
};

module.exports = {
  signupSchema,
  loginSchema,
  propertySchema,
  validate,
};
