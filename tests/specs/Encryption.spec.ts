import { test } from "@playwright/test";
import DataEncryption from "../encryption/dataEncryption";
import logger from "../utils/loggerUtil";
import * as envsEnums from "../models/appEnums";
import ENV from "../utils/env";

test.describe(`Encrypt Data Test Suite`, () => {
  test(`Encrypt Data`, async () => {
    // Data encryption instance
    const dataEncryption = new DataEncryption(envsEnums.Environments.DEV_ENV_FILE, ENV.SECRET_KEY_DEV); // specific to UAT environment, you can change it to your environment if needed

    // Encrypt data
    dataEncryption.encryptEnvParameters();

    logger.info(`Data was encrypted successfully`);
  });
});
