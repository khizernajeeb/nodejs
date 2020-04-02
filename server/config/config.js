require('dotenv').config();

module.exports = {
  development: {
    username: process.env.DATABASE_USER || 'test',
    password: process.env.DATABASE_PASSWORD || 'test',
    database: process.env.DATABASE_NAME || 'test',
    host: process.env.DATABASE_HOST || 'localhost',
    dialect: 'postgres',
    seederStorage: 'sequelize',
    port: process.env.DATABASE_PORT || '5432',
    pool: {
      max: 10,
      min: 0,
      acquire: 30000,
      idle: 10000,
    },
    logging: true,
  },
  test: {
    username: process.env.DATABASE_USER || 'test',
    password: process.env.DATABASE_PASSWORD || 'test',
    database: process.env.DATABASE_NAME || 'testapp',
    host: process.env.DATABASE_HOST || 'localhost',
    dialect: 'postgres',
    seederStorage: 'sequelize',
    port: process.env.DATABASE_PORT || '5432',
  },
  production: {
    username: process.env.DATABASE_USER || 'test',
    password: process.env.DATABASE_PASSWORD || 'test',
    database: process.env.DATABASE_NAME || 'testapp',
    host: process.env.DATABASE_HOST || 'localhost',
    dialect: 'postgres',
    seederStorage: 'sequelize',
    port: process.env.DATABASE_PORT || '5432',
    logging: false,
    pool: {
      max: 10,
      min: 0,
      acquire: 30000,
      idle: 10000,
    },
  },
};
