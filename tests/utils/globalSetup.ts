import dotenv from "dotenv";
import logger from "./loggerUtil";
import errorHandler from "../helpers/errorHandler";
import path from "path";
import * as envEnums from "../models/appEnums";
import ConfigLoader from "./configLoader";
import fs from "fs";
import CryptoUtilityHelper from "../helpers/cryptoUtilityHelper";

// Initialize KeyGenUtilityHelper
const utilityHelper = new CryptoUtilityHelper();

function globalSetup(): void {
  try {
    // Ensure base .env file exists
    utilityHelper.ensureEnvFileExist();

    // Load base .env file
    const baseEnvPath = path.resolve(
      envEnums.Environments.ENV_DIR,
      envEnums.Environments.BASE_ENV_FILE
    );

    // Load base .env file
    loadEnvironmentVariablesFromFile(baseEnvPath);

    // Load environment-specific .env file if specified
    const env = ConfigLoader.loadEnv();
    if (env) {
      const envFilePath = path.resolve(
        envEnums.Environments.ENV_DIR,
        `.env.${env}`
      );

      if (fs.existsSync(envFilePath)) {
        loadEnvironmentVariablesFromFile(envFilePath);
      } else {
        logger.warn(
          `Environment-specific file not found: ${envFilePath}. Please ensure it exists or is not required.`
        );
      }
    } else {
      logger.warn(envEnums.Environments.NO_ENV_SPECIFIED_WARNING);
    }
  } catch (error) {
    errorHandler.logGeneralError(
      error,
      "globalSetup",
      "Failed to set up environment variables"
    );
    throw error;
  }
}

/**
 * Loads environment variables from a specified .env file.
 * @param filePath - Absolute path to the .env file.
 * @throws Error if the file cannot be read or contains invalid configurations.
 */
function loadEnvironmentVariablesFromFile(filePath: string): void {
  try {
    const result = dotenv.config({ path: filePath, override: true });

    if (result.error) {
      const errorMessage = `Error loading environment variables from ${filePath}: ${result.error.message}`;
      logger.error(errorMessage);
      throw new Error(errorMessage);
    }

    logger.info(`Environment variables from ${filePath} loaded successfully`);

  } catch (error) {
    errorHandler.logGeneralError(
      error,
      "loadEnvironmentVariablesFromFile",
      `Failed to load variables from ${filePath}`
    );
    throw error;
  }
}

export default globalSetup;
