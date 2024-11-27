import errorHandler from "./errorHandler";
import * as envEnums from "../models/appEnums";
import path from "path";
import CryptoParamGenerator from "../utils/cryptoParamsGenerator";
import fs from "fs";
import logger from "../utils/loggerUtil";

export default class CryptoUtilityHelper {

  private readonly baseEnvPath: string;

  constructor() {
    this.baseEnvPath = path.resolve(
      process.cwd(),
      envEnums.Environments.BASE_ENV_FILE_FULL_PATH
    );
    this.ensureEnvFileExist();
  }

  /**
   * Ensures that the .env file and its containing directory exist.
   * If the directory does not exist, it will be created.
   * If the .env file does not exist, it will be created with an empty string.
   * If any errors occur during this process, an error will be logged and thrown.
   */
  public ensureEnvFileExist(): void {
    try {
      // Get the directory path from the full env file path
      const envDir = path.dirname(this.baseEnvPath);

      // Ensure the directory exists
      if (!fs.existsSync(envDir)) {
        fs.mkdirSync(envDir, { recursive: true });
        logger.info(`Directory created at ${envDir}`);
      }

      // Ensure the .env file exists
      if (!fs.existsSync(this.baseEnvPath)) {
        fs.writeFileSync(this.baseEnvPath, "");
        logger.info(`.env file created at ${this.baseEnvPath}`);
      }
    } catch (error) {
      errorHandler.logGeneralError(
        error,
        "ensureEnvFileExist",
        "Failed to create .env file or its directory"
      );
      throw error;
    }
  }

  /**
   * Generates a cryptographically secure secret key using the default key length.
   * The generated key is a base64-encoded string.
   *
   * @returns {string | undefined} The generated secret key as a base64-encoded string,
   * or undefined if an error occurs during key generation.
   * @throws Will log and throw an error if key generation fails.
   */
  public generateSecretKey(): string | undefined {
    try {
      return CryptoParamGenerator.generateKey(); // use default value of 32 bytes
    } catch (error) {
      errorHandler.logGeneralError(
        error,
        "generateSecretKey",
        "Failed to generate secret key"
      );
      throw error;
    }
  }

  /**
   * Stores a key-value pair in the .env file. If the key already exists,
   * its value is updated. If the key does not exist, it is appended to
   * the file. Logs an error and throws if the process fails.
   *
   * @param keyName - The name of the key to store in the .env file.
   * @param keyValue - The value associated with the key to store in the .env file.
   * @throws Will log and throw an error if storing the key in the .env file fails.
   */
  public storeKeyInEnv(keyName: string, keyValue: string): void {
    try {
      let envConfig = this.readEnvFile();

      // Update or append the specified key
      const regex = new RegExp(`^${keyName}=.*`, "m");
      if (regex.test(envConfig)) {
        envConfig = envConfig.replace(regex, `${keyName}=${keyValue}`);
      } else {
        envConfig += `${keyName}=${keyValue}\n`;
      }

      this.writeEnvFile(envConfig, keyName);
    } catch (error) {
      errorHandler.logGeneralError(
        error,
        "storeKeyInEnv",
        `Failed to store ${keyName} in .env file`
      );
      throw error;
    }
  }

  /**
   * Retrieves the value associated with the specified key from the .env file.
   *
   * @param keyName - The name of the key to retrieve from the .env file.
   * @returns {string | undefined} The value associated with the key, or undefined
   * if the key does not exist in the .env file.
   * @throws Will log and throw an error if retrieving the key from the .env file fails.
   */
  public getKeyValue(keyName: string): string | undefined {
    try {
      const envConfig = this.readEnvFile();
      const regex = new RegExp(`^${keyName}=(.*)$`, "m");
      const match = envConfig.match(regex);
      return match ? match[1] : undefined;
    } catch (error) {
      errorHandler.logGeneralError(
        error,
        "getKeyValue",
        `Failed to read ${keyName} from .env file`
      );
      throw error;
    }
  }

  /**
   * Reads the contents of the .env file at the specified path.
   *
   * @returns {string} The contents of the .env file as a string.
   * @throws Will log and throw an error if reading the .env file fails.
   */
  private readEnvFile(): string {
    try {
      return fs.readFileSync(this.baseEnvPath, "utf8");
    } catch (error) {
      errorHandler.logGeneralError(
        error,
        "readEnvFile",
        "Failed to read .env file"
      );
      throw error;
    }
  }

  /**
   * Writes the provided content to the .env file at the specified path.
   * Logs the action with the key name that was written.
   *
   * @param content - The content to write into the .env file.
   * @param keyName - The name of the key being written to the .env file, used for logging purposes.
   *
   * @throws Will log and throw an error if writing to the .env file fails.
   */
  private writeEnvFile(content: string, keyName: string): void {
    try {
      fs.writeFileSync(this.baseEnvPath, content, "utf8");
      logger.info(`${keyName} written to .env file`);
    } catch (error) {
      errorHandler.logGeneralError(
        error,
        "writeEnvFile",
        `Failed to write ${keyName} to .env file`
      );
      throw error;
    }
  }
}
