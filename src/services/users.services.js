const getPrisma = require('../db');

async function createUser(data) {
  const prisma = await getPrisma();
  return prisma.user.create({ data });
}

async function getUsers() {
  const prisma = await getPrisma();
  return prisma.user.findMany();
}

async function getUserById(id) {
  const prisma = await getPrisma();
  return prisma.user.findUnique({ where: { id } });
}

async function updateUser(id, data) {
  const prisma = await getPrisma();
  return prisma.user.update({ where: { id }, data });
}

async function deleteUser(id) {
  const prisma = await getPrisma();
  return prisma.user.delete({ where: { id } });
}

module.exports = {
  createUser,
  getUsers,
  getUserById,
  updateUser,
  deleteUser,
};
