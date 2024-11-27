import { test } from "@playwright/test";
import CryptoUtil from "../utils/cryptoUtil";
import ENV from "../utils/env";
import logger from "../utils/loggerUtil";

test.describe(`Decrypt Data Test Suite`, () => {
  test(`Decrypt Data`, async () => {
    // Decrypt data
    const encryptedUsername = CryptoUtil.decrypt(ENV.PORTAL_USERNAME, ENV.SECRET_KEY_DEV);
    const encryptedPassword = CryptoUtil.decrypt(ENV.PORTAL_PASSWORD, ENV.SECRET_KEY_DEV);
    console.log(`Decrypted Username: ${encryptedUsername}`);
    console.log(`Decrypted Password: ${encryptedPassword}`);
    logger.info(`Data was decrypted successfully`);
  });
});
