import CryptoUtilityHelper from "../helpers/cryptoUtilityHelper";
import errorHandler from "../helpers/errorHandler";
import logger from "../utils/loggerUtil";

export default class KeyManager {
  /**
   * Generates a secret key and stores it in the .env file.
   * Handles any errors that occur during key generation or storage.
   *
   * @param keyName The environment variable name to store the key.
   * @returns The generated key as a string, or undefined if an error occurs.
   */
  public static generateAndStoreKey(keyName: string): string | undefined {
    const utilityHelper = new CryptoUtilityHelper();

    try {
      // Generate the secret key
      const secretKey = utilityHelper.generateSecretKey();

      if (secretKey === undefined) {
        logger.error("Failed to generate secret key");
        throw new Error("Failed to generate secret key");
      }

      // Store the generated secret key in the .env file
      utilityHelper.storeKeyInEnv(keyName, secretKey);

      return secretKey;
    } catch (error) {
      errorHandler.logGeneralError(
        error,
        `generateAndStoreKey`,
        `Failed to generate and store secret key`
      );
      throw error;
    }
  }
}
