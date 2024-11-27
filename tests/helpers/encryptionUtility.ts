import path from "path";
import * as envEnums from "../models/appEnums";
import errorHandler from "./errorHandler";
import fs from "fs";
import logger from "../utils/loggerUtil";
import CryptoUtil from "../utils/cryptoUtil";

export default class EncryptionUtility {
    
  private readonly envDir: string;
  private readonly envFilePath: string;
  private readonly secretKey: string;

  constructor(env: string, secretKey: string) {
    this.envDir = path.join(process.cwd(), envEnums.Environments.ENV_DIR);
    this.envFilePath = path.join(this.envDir, env);
    this.secretKey = this.getSecretKey(secretKey);
  }

  /**
   * Retrieves the secret key from the .env file. If the key is not set, this
   * method will throw an error.
   *
   * @param secretKey - The value of the secret key in the .env file.
   * @returns The secret key value.
   * @throws Will log and throw an error if the key is not found in the .env file.
   */
  private getSecretKey(secretKey: string): string {
    try {
      if (!secretKey) {
        errorHandler.logAndThrowError("Key not found in .env file");
      }
      return secretKey;
    } catch (error) {
      errorHandler.logGeneralError(
        error,
        "getSecretKey",
        "Failed to get secret key"
      );
      throw error;
    }
  }

/**
 * Reads the contents of the environment file for the specified environment.
 * Splits the file content by lines and returns an array of lines.
 *
 * @returns {string[]} An array of strings, each representing a line from the environment file.
 * @throws Will log and throw an error if reading the environment file fails.
 */
  public readEnvFile(): string[] {
    try {
      return fs.readFileSync(this.envFilePath, "utf8").split("\n");
    } catch (error) {
      errorHandler.logGeneralError(
        error,
        "readEnvFile",
        "Failed to read environment file"
      );
      throw error;
    }
  }

  /**
   * Encrypts all lines in the given array. Each line is split into a key-value
   * pair and the value is encrypted using the provided secret key. The
   * encrypted value is then serialized to JSON and prepended to the key. If
   * any line is malformed or fails encryption, an error is logged and the line
   * is skipped.
   *
   * @param lines - An array of strings, each representing a line from the
   * environment file.
   * @returns An array of strings, each representing an encrypted line from the
   * environment file.
   * @throws Will log and throw an error if encryption fails for any line.
   */
  public encryptLines(lines: string[]): string[] {
    try {
      if (
        !Array.isArray(lines) ||
        !lines.every((line) => typeof line === "string")
      ) {
        throw new TypeError("Input must be an array of strings.");
      }

      if (lines.every((line) => line.trim() === "")) {
        errorHandler.logAndThrowError(
          "File is completely empty or contains only whitespace."
        );
      }

      const encryptedLines: string[] = [];
      const errors: string[] = [];

      for (let index = 0; index < lines.length; index++) {
        const line = lines[index];
        const trimmedLine = line.trim();

        if (trimmedLine === "") {
          encryptedLines.push(""); // Keep empty lines unchanged
          continue;
        }

        if (!trimmedLine.includes("=")) {
          const errorMessage = errorHandler.handleInvalidFormatError(
            index,
            line
          );
          logger.error(errorMessage);
          errors.push(errorMessage);
          continue; // Skip malformed lines
        }

        const [key, value] = trimmedLine.split("=");
        if (value) {
          // Generate encryption metadata
          const encryptionResult = CryptoUtil.encrypt(
            value.trim(),
            this.secretKey
          );
          const encryptedValue = JSON.stringify(encryptionResult); // Serialize to JSON
          encryptedLines.push(`${key}=${encryptedValue}`); // Add serialized JSON
        } else {
          encryptedLines.push(line); // Preserve the line if no value
        }
      }

      if (errors.length > 0) {
        errorHandler.logGeneralError(
          new Error(errors.join("\n")),
          "encryptLines",
          "Failed to encrypt some lines"
        );
      }
      return encryptedLines;
    } catch (error) {
      errorHandler.logGeneralError(
        error,
        "encryptLines",
        "Failed to encrypt lines"
      );
      throw error;
    }
  }

/**
 * Writes the provided lines to the environment file at the specified path.
 * Each line in the array is joined by a newline character before writing.
 * If writing to the file fails, an error is logged and thrown.
 *
 * @param lines - An array of strings, each representing a line to write into the environment file.
 * @throws Will log and throw an error if writing to the environment file fails.
 */
  public writeEnvFile(lines: string[]): void {
    try {
      fs.writeFileSync(this.envFilePath, lines.join("\n"), "utf8");
    } catch (error) {
      errorHandler.logGeneralError(
        error,
        "writeEnvFile",
        "Failed to write encrypted lines to environment file"
      );
      throw error;
    }
  }

  /**
   * Logs a success message after encryption is complete.
   *
   * @param originalCount - The original number of lines in the file.
   * @param encryptedCount - The number of lines that were successfully encrypted.
   * @throws Will log and throw an error if logging the success message fails.
   */
  public logEncryptionSuccess(
    originalCount: number,
    encryptedCount: number
  ): void {
    try {
      const relativePath = path.relative(process.cwd(), this.envFilePath);
      logger.info(
        `Encryption complete. Successfully encrypted ${encryptedCount} variable(s) in the ${relativePath} file.`
      );
    } catch (error) {
      errorHandler.logGeneralError(
        error,
        "logEncryptionSuccess",
        "Failed to log encryption success"
      );
      throw error;
    }
  }
}
