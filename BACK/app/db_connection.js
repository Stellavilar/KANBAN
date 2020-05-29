const Sequelize = require ('sequelize');

const client = new Sequelize(process.env.PG_URL);

module.exports = client;