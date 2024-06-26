const usersService = require('./users-service');
const { errorResponder, errorTypes } = require('../../../core/errors');

/**
 * Handle get list of users request
 * @param {object} request - Express request object
 * @param {object} response - Express response object
 * @param {object} next - Express route middlewares
 * @returns {object} Response object or pass an error to the next route
 */
async function getUsers(request, response, next) {
  try {
    const users = await usersService.getUsers();
    return response.status(200).json(users);
  } catch (error) {
    return next(error);
  }
}

/**
 * Handle get user detail request
 * @param {object} request - Express request object
 * @param {object} response - Express response object
 * @param {object} next - Express route middlewares
 * @returns {object} Response object or pass an error to the next route
 */
async function getUser(request, response, next) {
  try {
    const user = await usersService.getUser(request.params.id);

    if (!user) {
      throw errorResponder(errorTypes.UNPROCESSABLE_ENTITY, 'Unknown user');
    }

    return response.status(200).json(user);
  } catch (error) {
    return next(error);
  }
}

/**
 * Handle create user request
 * @param {object} request - Express request object
 * @param {object} response - Express response object
 * @param {object} next - Express route middlewares
 * @returns {object} Response object or pass an error to the next route
 */
async function createUser(request, response, next) {
  const name = request.body.name;
  const email = request.body.email;
  const password = request.body.password;
  const verify_password = request.body.verify_password;

  try {
    const emailTakenErr = await usersService.emailCheck(email);
    if (emailTakenErr) {
      throw errorResponder(
        errorTypes.EMAIL_ALREADY_TAKEN,
        'Email_already_taken'
      );
    }

    if (password != verify_password) {
      throw errorResponder(errorTypes.INVALID_PASSWORD, 'Invalid password');
    }

    const success = await usersService.createUser(name, email, password);
    if (!success) {
      throw errorResponder(
        errorTypes.UNPROCESSABLE_ENTITY,
        'Failed to create user'
      );
    }

    return response.status(200).json({ name, email });
  } catch (error) {
    return next(error);
  }
}

/**
 * Handle update user request
 * @param {object} request - Express request object
 * @param {object} response - Express response object
 * @param {object} next - Express route middlewares
 * @returns {object} Response object or pass an error to the next route
 */
async function updateUser(request, response, next) {
  const id = request.params.id;
  const name = request.body.name;
  const email = request.body.email;

  try {
    const emailTakenErr = await usersService.emailCheck(email);
    if (emailTakenErr) {
      throw errorResponder(
        errorTypes.EMAIL_ALREADY_TAKEN,
        'Email_Already_Taken'
      );
    }

    const success = await usersService.updateUser(id, name, email);
    if (!success) {
      throw errorResponder(
        errorTypes.UNPROCESSABLE_ENTITY,
        'Failed to update user'
      );
    }

    return response.status(200).json({ id });
  } catch (error) {
    return next(error);
  }
}

/**
 * Handle delete user request
 * @param {object} request - Express request object
 * @param {object} response - Express response object
 * @param {object} next - Express route middlewares
 * @returns {object} Response object or pass an error to the next route
 */
async function deleteUser(request, response, next) {
  try {
    const id = request.params.id;

    const success = await usersService.deleteUser(id);
    if (!success) {
      throw errorResponder(
        errorTypes.UNPROCESSABLE_ENTITY,
        'Failed to delete user'
      );
    }

    return response.status(200).json({ id });
  } catch (error) {
    return next(error);
  }
}

async function passwordChange(request, response, next) {
  const id = request.params.id;
  const curr_password = request.body.curr_password;
  const new_password = request.body.new_password;
  const verify_password = request.body.verify_password;

  try {
    const checkedCurrPsw = await usersService.checkCurrPsw(id, curr_password);
    if (!checkedCurrPsw) {
      throw errorResponder(
        errorTypes.INVALID_PASSWORD,
        'Current_password_invalid'
      );
    }

    if (verify_password != new_password) {
      throw errorResponder(
        errorTypes.INVALID_PASSWORD,
        'Confirmed_password_does_not_match'
      );
    }

    const password = await new_password;
    const success = await usersService.pswChange(id, password);
    if (!success) {
      throw errorResponder(
        errorTypes.UNPROCESSABLE_ENTITY,
        'Password change failed'
      );
    }
    return response.status(200).json({ id });
  } catch (error) {
    return next(error);
  }
}

module.exports = {
  getUsers,
  getUser,
  createUser,
  updateUser,
  deleteUser,
  passwordChange,
};
