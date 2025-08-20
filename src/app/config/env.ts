import dotenv from "dotenv";
dotenv.config();

interface IEnvConfig {
  PORT: string;
  NODE_ENV: string;
  DB_URI: string;
  BCRYPT_SALT_ROUND: string;
}

const loadEnvVariables = (): IEnvConfig => {
  const requiredEnvVariables: string[] = [
    "PORT",
    "NODE_ENV",
    "DB_URI",
    "BCRYPT_SALT_ROUND",
  ];

  requiredEnvVariables.forEach((key) => {
    if (!process.env[key]) {
      throw new Error(`Missing require environment variable ${key}`);
    }
  });

  return {
    PORT: process.env.PORT as string,
    NODE_ENV: process.env.NODE_ENV as "development" | "production",
    DB_URI: process.env.DB_URI!,
    BCRYPT_SALT_ROUND: process.env.BCRYPT_SALT_ROUND as string,
  };
};

export const envVars = loadEnvVariables();
