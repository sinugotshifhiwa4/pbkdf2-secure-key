export enum Environments {
  // parent directory
  ENV_DIR = "envs",

  // environment file names
  BASE_ENV_FILE = ".env",
  DEV_ENV_FILE = ".env.dev",
  UAT_ENV_FILE = ".env.uat",

  // .env full path
  BASE_ENV_FILE_FULL_PATH = "envs/.env",

  // secret key variables
  SECRET_KEY_DEV = "SECRET_KEY_DEV",
  SECRET_KEY_UAT = "SECRET_KEY_UAT",

  ERROR_LOADING_ENV = "Error: Unable to load environment variables. Please check the file path and permissions.",
  NO_ENV_SPECIFIED_WARNING = `Warning: No environment specified in the ENV variable. Defaulting to '${BASE_ENV_FILE}' for environment configuration.\n Specify one of the following environments: "dev", "uat", or "prod". Example: ENV=uat`,
}  
