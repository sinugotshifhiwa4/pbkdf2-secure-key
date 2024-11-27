import * as crypto from "crypto";
import errorHandler from "../helpers/errorHandler";

export default class CryptoParamsGenerator {
  // Base64 encoding
  private static BASE_64: BufferEncoding = "base64";

  // default values
  private static readonly DEFAULT_IV_LENGTH = 16; // Default IV length in bytes
  private static readonly DEFAULT_SALT_LENGTH = 32; // Default salt length in bytes
  private static readonly DEFAULT_KEY_LENGTH = 32; // Default key length in bytes

  /**
   * Generates a random IV of the given length, defaulting to DEFAULT_IV_LENGTH.
   * The generated IV is a base64-encoded string.
   *
   * @param {number} [length] - The length of the IV to generate in bytes.
   * @returns {string} The generated IV as a base64-encoded string.
   * @throws {Error} If the given length is less than or equal to zero.
   * @throws {Error} If there is an error generating the IV.
   */
  public static generateIv(length: number = this.DEFAULT_IV_LENGTH): string {
    if (length <= 0) throw new Error("IV length must be greater than zero.");
    try {
      return crypto.randomBytes(length).toString(this.BASE_64);
    } catch (error) {
      errorHandler.logGeneralError(
        error,
        "generateIv",
        `Failed to generate IV of length ${length}`
      );
      throw error;
    }
  }

  /**
   * Generates a random salt of the given length, defaulting to DEFAULT_SALT_LENGTH.
   * The generated salt is a base64-encoded string.
   *
   * @param {number} [length] - The length of the salt to generate in bytes.
   * @returns {string} The generated salt as a base64-encoded string.
   * @throws {Error} If the given length is less than or equal to zero.
   * @throws {Error} If there is an error generating the salt.
   */
  public static generateSalt(
    length: number = this.DEFAULT_SALT_LENGTH
  ): string {
    if (length <= 0) throw new Error("Salt length must be greater than zero.");
    try {
      return crypto.randomBytes(length).toString(this.BASE_64);
    } catch (error) {
      errorHandler.logGeneralError(
        error,
        "generateSalt",
        `Failed to generate salt of length ${length}`
      );
      throw error;
    }
  }

  /**
   * Generates a cryptographically secure random key of the given length, defaulting to DEFAULT_KEY_LENGTH.
   * The generated key is a base64-encoded string.
   *
   * @param {number} [length] - The length of the key to generate in bytes.
   * @returns {string} The generated key as a base64-encoded string.
   * @throws {Error} If the given length is less than or equal to zero.
   * @throws {Error} If there is an error generating the key.
   */
  public static generateKey(length: number = this.DEFAULT_KEY_LENGTH): string {
    try {
      // Generate a cryptographically secure random key
      return crypto.randomBytes(length).toString(this.BASE_64);
    } catch (error) {
      errorHandler.logGeneralError(
        error,
        "generateKey",
        "Failed to generate key"
      );
      throw error;
    }
  }
}
