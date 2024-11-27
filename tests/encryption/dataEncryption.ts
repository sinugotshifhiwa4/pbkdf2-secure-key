import EncryptionUtility from "../helpers/encryptionUtility";
import errorHandler from "../helpers/errorHandler";

export default class DataEncryption {
    
  private encryptionUtility: EncryptionUtility;

/**
 * Constructs a new instance of the DataEncryption class.
 *
 * @param env - The environment for which the encryption utility is initialized.
 * @param secretKey - The secret key used for encryption operations.
 */
  constructor(env: string, secretKey: string) {
    this.encryptionUtility = new EncryptionUtility(env, secretKey);
  }

  /**
   * Encrypts all lines in the .env file for the given environment. This
   * method reads the .env file, encrypts each line, and writes the encrypted
   * lines back to the .env file. If any errors occur during this process, an
   * error will be logged and thrown.
   * 
   * @throws Will log and throw an error if encryption fails.
   */
  public encryptEnvParameters(): void {
    try {
      const envFileContent = this.encryptionUtility.readEnvFile();
      const encryptedLines = this.encryptionUtility.encryptLines(envFileContent);
      this.encryptionUtility.writeEnvFile(encryptedLines);
      this.encryptionUtility.logEncryptionSuccess(envFileContent.length, encryptedLines.length);
    } catch (error) {
      errorHandler.logGeneralError(
        error,
        "encryptEnvParameters",
        "Failed to encrypt environment parameters"
      );
      throw error;
    }
  }
}
