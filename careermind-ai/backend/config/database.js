const { Sequelize } = require('sequelize');
const path = require('path');
require('dotenv').config();

const sequelize = new Sequelize(
  process.env.DB_NAME || 'careermind',
  process.env.DB_USER || 'root',
  process.env.DB_PASSWORD || '',
  {
    host: process.env.DB_HOST || 'localhost',
    dialect: 'mysql',
    logging: false,
  }
);

const connectDB = async () => {
  try {
    await sequelize.authenticate();
    console.log('SQL Database Connected successfully (MySQL)!');
    // Sync models
    await sequelize.sync({ alter: true });
    console.log('All SQL models were synchronized successfully.');
  } catch (error) {
    console.error('Unable to connect to the SQL database:', error);
  }
};

module.exports = { sequelize, connectDB };
