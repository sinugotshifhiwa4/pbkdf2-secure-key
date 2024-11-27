import logger from "../utils/loggerUtil";

export default class ErrorHandler {
  /**
   * Logs a general error with context, method name, and an optional custom message.
   *
   * @param error - The error object, message, or any unknown value to log.
   * @param methodName - The name of the method where the error occurred.
   * @param customMessage - An optional message to provide additional context.
   */
  public static logGeneralError(
    error: unknown,
    methodName: string,
    customMessage?: string
  ): void {
    const messagePrefix = customMessage ? `${customMessage}: ` : "";
    const errorMessage = this.formatErrorMessage(error, messagePrefix);

    logger.error(`[Method: ${methodName}] ${errorMessage}`);
  }

  /**
   * Formats the error message based on the type of error provided.
   *
   * @param error - The error object or value to format.
   * @param messagePrefix - A prefix to prepend to the error message for context.
   * @returns A formatted error message as a string.
   */
  private static formatErrorMessage(error: unknown, messagePrefix: string): string {
    if (error === null) {
      return `${messagePrefix}Received a null error.`;
    }

    if (error instanceof Error) {
      return `${messagePrefix}Error: ${error.message}`;
    }

    if (typeof error === "object") {
      return `${messagePrefix}Object error: ${JSON.stringify(
        error,
        Object.getOwnPropertyNames(error)
      )}`;
    }

    return `${messagePrefix}Unknown error type encountered: ${String(error)}`;
  }

  /**
   * Logs an error message and throws the error.
   *
   * @param errorMessage - The error message to log and throw.
   * @returns Never, as this function will always throw an error.
   */
  public static logAndThrowError(errorMessage: string): never {
    logger.error(errorMessage); // Log the error message
    throw new Error(errorMessage); // Throw the error
  }

  /**
   * Logs an error message and throws an error if the cipherText is undefined or empty.
   *
   * @returns Never, as this function will always throw an error.
   */
  public static handleUndefinedCipherText(): never {
    return this.logAndThrowError("cipherText is undefined or empty.");
  }

/**
 * Logs an error message and throws an error indicating that the cipher text format is invalid.
 *
 * The expected format for the cipher text is "salt:iv:encrypted".
 *
 * @returns Never, as this function will always throw an error.
 */
  public static handleInvalidCipherFormat(): never {
    return this.logAndThrowError(
      "Invalid cipherText format. Expected format: salt:iv:encrypted."
    );
  }

  /**
   * Logs an error message indicating that decryption failed and throws an error.
   *
   * The error message will indicate that the decryption failed due to an invalid
   * key or ciphertext.
   *
   * @returns Never, as this function will always throw an error.
   */
  public static handleDecryptionFailure(): never {
    return this.logAndThrowError(
      "Decryption failed. Invalid key or ciphertext."
    );
  }

/**
 * Constructs an error message for a line with invalid format or no variables.
 *
 * @param index - The zero-based index of the line in the file.
 * @param line - The content of the line that has an invalid format.
 * @returns A formatted error message indicating the line number and the issue.
 */
  public static handleInvalidFormatError(index: number, line: string): string {
    return `Line ${
      index + 1
    } doesn't contain any variables or has invalid format: ${line}`;
  }
}
