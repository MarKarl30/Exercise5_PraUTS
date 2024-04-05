const usersRepository = require('./users-repository');
const { hashPassword } = require('../../../utils/password');
const { passwordMatched } = require('../../../utils/password');

/**
 * Get list of users
 * @returns {Array}
 */
async function getUsers() {
  const users = await usersRepository.getUsers();

  const results = [];
  for (let i = 0; i < users.length; i += 1) {
    const user = users[i];
    results.push({
      id: user.id,
      name: user.name,
      email: user.email,
    });
  }

  return results;
}

/**
 * Get user detail
 * @param {string} id - User ID
 * @returns {Object}
 */
async function getUser(id) {
  const user = await usersRepository.getUser(id);

  // User not found
  if (!user) {
    return null;
  }

  return {
    id: user.id,
    name: user.name,
    email: user.email,
  };
}

/**
 * Create new user
 * @param {string} name - Name
 * @param {string} email - Email
 * @param {string} password - Password
 * @returns {boolean}
 */
async function createUser(name, email, password) {
  // Hash password
  const hashedPassword = await hashPassword(password);

  try {
    await usersRepository.createUser(name, email, hashedPassword);
  } catch (err) {
    return null;
  }

  return true;
}

/**
 * Update existing user
 * @param {string} id - User ID
 * @param {string} name - Name
 * @param {string} email - Email
 * @returns {boolean}
 */
async function updateUser(id, name, email) {
  const user = await usersRepository.getUser(id);

  // User not found
  if (!user) {
    return null;
  }

  try {
    await usersRepository.updateUser(id, name, email);
  } catch (err) {
    return null;
  }

  return true;
}

/**
 * Delete user
 * @param {string} id - User ID
 * @returns {boolean}
 */
async function deleteUser(id) {
  const user = await usersRepository.getUser(id);

  // User not found
  if (!user) {
    return null;
  }

  try {
    await usersRepository.deleteUser(id);
  } catch (err) {
    return null;
  }

  return true;
}

async function emailCheck(email) {
  try {
    const emailStatus = await usersRepository.checkEmailExist(email);
    if (!emailStatus) {
      return false;
    } else {
      return true;
    }
  } catch (error) {
    console.error('Error checking email: ', error);
    return false;
  }
}

//Checking curr psw with psw in db
async function checkCurrPsw(id, currpassword) {
  const user = await usersRepository.getUser(id);

  const userPassword = user ? user.password : '<RANDOM_PASSWORD_FILLER>';
  const verifiedPsw = await passwordMatched(currpassword, userPassword);

  if (user && verifiedPsw) {
    return true;
  }
}

//Patching / updating psw in db with new psw
async function pswChange(id, password) {
  const hashedPassword = await hashPassword(password);
  const user = await usersRepository.getUser(id);

  if (!user) {
    return null;
  }

  try {
    await usersRepository.changePsw(id, hashedPassword);
  } catch (error) {
    return null;
  }

  return true;
}

module.exports = {
  getUsers,
  getUser,
  createUser,
  updateUser,
  deleteUser,
  emailCheck,
  checkCurrPsw,
  pswChange,
};
