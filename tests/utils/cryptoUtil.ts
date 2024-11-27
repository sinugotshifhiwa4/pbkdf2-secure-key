import CryptoJS from "crypto-js";
import * as cryptoResult from "../models/applicationInterfaces";
import errorHandler from "../helpers/errorHandler";
import CryptoParamGenerator from "./cryptoParamsGenerator";
import logger from "./loggerUtil";

export default class CryptoUtil {
  /**
   * Derives a key from the given secret key and salt using PBKDF2.
   *
   * @param secretKey - The secret key to use for derivation.
   * @param salt - The salt to use for derivation.
   * @returns A derived key as a CryptoJS WordArray.
   */
  private static deriveKey(
    secretKey: string,
    salt: string
  ): CryptoJS.lib.WordArray {
    return CryptoJS.PBKDF2(secretKey, CryptoJS.enc.Base64.parse(salt), {
      keySize: 256 / 32,
      iterations: 100000,
    });
  }

  /**
   * Generates a message authentication code (MAC) using the HMAC-SHA256 algorithm
   * given the salt, initialization vector, ciphertext, and key.
   *
   * The MAC is generated by concatenating the salt, IV, and ciphertext with colons
   * and then hashing the result using the given key with HMAC-SHA256.
   *
   * @param salt - The salt used for encryption.
   * @param iv - The initialization vector used for encryption.
   * @param cipherText - The encrypted data.
   * @param key - The key used for encryption.
   * @returns The generated MAC as a string.
   */
  private static generateMac(
    salt: string,
    iv: string,
    cipherText: string,
    key: CryptoJS.lib.WordArray
  ): string {
    return CryptoJS.HmacSHA256(
      `${salt}:${iv}:${cipherText}`,
      key.toString(CryptoJS.enc.Base64)
    ).toString();
  }

  /**
   * Validates the parsed data to ensure all required properties are present.
   *
   * The required properties are salt, iv, cipherText, and mac.
   *
   * @param parsedData - The parsed data to validate.
   * @throws Error - If any of the required properties are missing.
   */
  private static validateParsedData(
    parsedData: cryptoResult.CryptoResult
  ): void {
    const { salt, iv, cipherText, mac } = parsedData;
    if (!salt || !iv || !cipherText || !mac) {
      errorHandler.logAndThrowError(
        "Missing required properties in encrypted data."
      );
    }
  }

  /**
   * Encrypts a given string using AES encryption with a PBKDF2-derived key.
   *
   * This method generates a random salt and initialization vector (IV), derives
   * an encryption key from the secret key and salt using PBKDF2, and encrypts
   * the input value with AES encryption in CBC mode, applying PKCS7 padding.
   * It also generates a message authentication code (MAC) using HMAC-SHA256
   * to ensure the integrity of the encrypted data.
   *
   * @param value - The plaintext string to encrypt.
   * @param secretKey - The secret key used for key derivation.
   * @returns An object containing the salt, IV, ciphertext, and MAC.
   * @throws Will log and throw an error if encryption fails.
   */
  public static encrypt(
    value: string,
    secretKey: string
  ): cryptoResult.CryptoResult {
    try {
      // Generate a random salt and IV
      const salt = CryptoParamGenerator.generateSalt();
      const iv = CryptoParamGenerator.generateIv();

      // Derive a key from the secret key and salt
      const key = this.deriveKey(secretKey, salt);

      // Encrypt the value
      const cipherText = CryptoJS.AES.encrypt(value, key, {
        iv: CryptoJS.enc.Base64.parse(iv),
        mode: CryptoJS.mode.CBC,
        padding: CryptoJS.pad.Pkcs7,
      }).toString();

      // Generate the MAC
      const mac = this.generateMac(salt, iv, cipherText, key);

      return { salt, iv, cipherText, mac };
    } catch (error) {
      errorHandler.logGeneralError(error, "encrypt", "Failed to encrypt text");
      throw error;
    }
  }

  public static decrypt(encryptedData: string, secretKey: string): string {
    if (!encryptedData) {
      errorHandler.logAndThrowError("Encrypted data is required.");
    }

    // Extract the salt, IV, ciphertext, and MAC from the encrypted data
    let parsedData: cryptoResult.CryptoResult;

    try {
      // Parse the encrypted data as JSON
      parsedData = JSON.parse(encryptedData) as cryptoResult.CryptoResult;

      // Check if the required properties are present
      this.validateParsedData(parsedData);
    } catch (error) {
      errorHandler.logAndThrowError(
        `Invalid encrypted data format. Unable to parse JSON: ${error.message}`
      );
    }

    // Pass the salt, IV, ciphertext, and MAC to the decrypt function
    const { salt, iv, cipherText, mac } = parsedData;

    try {
      // Derive a key from the secret key and salt
      const decodedIv = CryptoJS.enc.Base64.parse(iv);
      const decodedCipherText = CryptoJS.enc.Base64.parse(cipherText);
      const key = this.deriveKey(secretKey, salt);

      // Verify the MAC
      const computedMac = this.generateMac(salt, iv, cipherText, key);

      if (computedMac !== mac) {
        errorHandler.logAndThrowError(
          "MAC verification failed. The data may have been tampered with."
        );
      }

      // Decrypt the ciphertext
      const decryptedBytes = CryptoJS.AES.decrypt(
        { ciphertext: decodedCipherText } as CryptoJS.lib.CipherParams,
        key,
        { iv: decodedIv, mode: CryptoJS.mode.CBC, padding: CryptoJS.pad.Pkcs7 }
      );

      // Convert the decrypted bytes to a string
      const decrypted = decryptedBytes.toString(CryptoJS.enc.Utf8);

      if (!decrypted) {
        errorHandler.logAndThrowError(
          "Decryption failed. The result is empty or malformed."
        );
      }

      return decrypted;
    } catch (error) {
      errorHandler.logGeneralError(error, "decrypt", "Failed to decrypt text");
      throw error;
    }
  }
}
