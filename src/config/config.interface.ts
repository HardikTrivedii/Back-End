// config.interface.ts
interface Config {
  development: {
    username: string;
    password: string;
    database: string;
    host: string;
    dialect: string;
  };
  // Add an index signature for other environments if needed
  [key: string]: {
    username: string;
    password: string;
    database: string;
    host: string;
    dialect: string;
  };
}

export default Config;
