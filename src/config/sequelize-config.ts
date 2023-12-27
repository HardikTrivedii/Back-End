// sequelize-config.ts

import * as dotenv from "dotenv";

dotenv.config();

interface Config {
  [key: string]: {
    username: string;
    password: string;
    database: string;
    host: string;
    dialect: "mysql";
  };
}

const config: Config = {
  development: {
    username: process.env.DB_USERNAME!,
    password: process.env.DB_PASSWORD!,
    database: process.env.DB_DATABASE!,
    host: process.env.DB_HOST!,
    dialect: "mysql",
  },
};

export default config;
