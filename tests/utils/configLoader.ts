import errorHandler from "../helpers/errorHandler";

export default class ConfigLoader {
    
  /**
   * Loads the environment from the ENV variable.
   * @returns The environment or undefined if failed.
   */
  public static loadEnv() {
    try {
      return process.env.ENV;
    } catch (error) {
      errorHandler.logGeneralError(
        error,
        "loadEnv",
        "Failed to load environment"
      );
      throw error;
    }
  }
}