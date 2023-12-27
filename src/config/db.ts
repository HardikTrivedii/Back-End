import { Dialect, Sequelize } from "sequelize";
import Config from "./config.interface";
import dotenv from "dotenv";
dotenv.config();

const env = process.env.NODE_ENV || "development";

const config: Config = {
  development: {
    username: `${process.env.DBUSER}`,
    password: `${process.env.DBPASSWORD}`,
    database: `${process.env.DATABASE}`,
    host: `${process.env.DBHOST}`,
    dialect: `${process.env.DIALECT}`,
  },
};

const dbConfig = config[env];

const sequelize = new Sequelize(
  dbConfig.database,
  dbConfig.username,
  dbConfig.password,
  {
    host: dbConfig.host,
    dialect: dbConfig.dialect as Dialect, // Provide a default value if dialect is undefined
    logging: console.log,
    pool: {
      max: 10,
      min: 0,
      acquire: 30000,
      idle: 10000,
    },
  }
);

export { sequelize };
