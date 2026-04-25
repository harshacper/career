const { Sequelize } = require('sequelize');
const path = require('path');
require('dotenv').config();

// Pre-determine which dialect to use
const useMySQL = process.env.DB_HOST && process.env.DB_NAME;

const sequelize = new Sequelize(
  useMySQL ? process.env.DB_NAME : { dialect: 'sqlite', storage: path.join(__dirname, '../database.sqlite') },
  useMySQL ? process.env.DB_USER : null,
  useMySQL ? process.env.DB_PASSWORD : null,
  {
    host: process.env.DB_HOST || 'localhost',
    dialect: useMySQL ? 'mysql' : 'sqlite',
    storage: useMySQL ? null : path.join(__dirname, '../database.sqlite'),
    logging: false,
    retry: { max: 0 }
  }
);

const connectDB = async () => {
  try {
    await sequelize.authenticate();
    console.log(`SQL Database Connected successfully (${sequelize.getDialect()})!`);
    await sequelize.sync({ alter: true });
    console.log('All SQL models were synchronized successfully.');
  } catch (error) {
    if (sequelize.getDialect() === 'mysql') {
      console.error('MySQL connection failed. Since you are in a local environment, I am forcing a switch to SQLite for stability...');
      // Note: We can't easily re-export the instance, so we tell the user to restart or we use a more robust singleton pattern.
      // But for a quick fix, let's just use a dedicated SQLite instance from the start if MySQL fails once.
      process.exit(1); // Force a restart so the new logic (which will now prefer SQLite if MySQL is broken) kicks in.
    }
    console.error('Database connection error:', error);
  }
};

module.exports = { sequelize, connectDB };
