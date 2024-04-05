const joi = require('joi');
const { passwordChange } = require('./users-controller');

module.exports = {
  createUser: {
    body: {
      name: joi.string().min(1).max(100).required().label('Name'),
      email: joi.string().email().required().label('Email'),
      password: joi.string().min(6).max(32).required().label('Password'),
      verify_password: joi
        .string()
        .min(6)
        .max(32)
        .required()
        .label('Verify_password'),
    },
  },

  updateUser: {
    body: {
      name: joi.string().min(1).max(100).required().label('Name'),
      email: joi.string().email().required().label('Email'),
    },
  },

  passwordChange: {
    body: {
      curr_password: joi
        .string()
        .min(6)
        .max(32)
        .required()
        .label('Current password'),
      new_password: joi
        .string()
        .min(6)
        .max(32)
        .required()
        .label('New password'),
      verify_password: joi
        .string()
        .min(6)
        .max(32)
        .required()
        .label('Verify new password'),
    },
  },
};
