const usersService = require('../services/users.services');

const userFields = ['username', 'email', 'fullname'];

function validateUserData(body, requireAllFields) {
  if (body === null || typeof body !== 'object' || Array.isArray(body)) {
    return { error: 'Request body must be a JSON object' };
  }

  const unknownField = Object.keys(body).find((key) => !userFields.includes(key));
  if (unknownField) {
    return { error: `Unknown field: ${unknownField}` };
  }

  if (requireAllFields && userFields.some((field) => !Object.hasOwn(body, field))) {
    return { error: 'username, email and fullname are required' };
  }

  if (!requireAllFields && Object.keys(body).length === 0) {
    return { error: 'At least one user field is required' };
  }

  const data = {};
  for (const field of userFields) {
    if (Object.hasOwn(body, field)) {
      if (typeof body[field] !== 'string' || body[field].trim() === '') {
        return { error: `${field} must be a non-empty string` };
      }
      data[field] = body[field].trim();
    }
  }

  return { data };
}

function parseUserId(value) {
  if (!/^\d+$/.test(value)) {
    return null;
  }

  const id = Number(value);
  return Number.isSafeInteger(id) && id > 0 ? id : null;
}

async function createUser(req, res, next) {
  const validation = validateUserData(req.body, true);
  if (validation.error) {
    return res.status(400).json({ error: validation.error });
  }

  try {
    const user = await usersService.createUser(validation.data);
    return res.status(201).json(user);
  } catch (error) {
    return next(error);
  }
}

async function getUsers(_req, res, next) {
  try {
    const users = await usersService.getUsers();
    return res.json(users);
  } catch (error) {
    return next(error);
  }
}

async function getUserById(req, res, next) {
  const id = parseUserId(req.params.id);
  if (id === null) {
    return res.status(400).json({ error: 'id must be a positive integer' });
  }

  try {
    const user = await usersService.getUserById(id);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    return res.json(user);
  } catch (error) {
    return next(error);
  }
}

async function updateUser(req, res, next) {
  const id = parseUserId(req.params.id);
  if (id === null) {
    return res.status(400).json({ error: 'id must be a positive integer' });
  }

  const validation = validateUserData(req.body, false);
  if (validation.error) {
    return res.status(400).json({ error: validation.error });
  }

  try {
    const user = await usersService.updateUser(id, validation.data);
    return res.json(user);
  } catch (error) {
    return next(error);
  }
}

async function deleteUser(req, res, next) {
  const id = parseUserId(req.params.id);
  if (id === null) {
    return res.status(400).json({ error: 'id must be a positive integer' });
  }

  try {
    await usersService.deleteUser(id);
    return res.status(204).end();
  } catch (error) {
    return next(error);
  }
}

module.exports = {
  createUser,
  getUsers,
  getUserById,
  updateUser,
  deleteUser,
};
