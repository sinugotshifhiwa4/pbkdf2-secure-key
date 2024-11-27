import { test as generateKey } from "@playwright/test";
import KeyManager from "../encryption/keyManager";
import logger from "../utils/loggerUtil";
import * as envsEnums from "../models/appEnums";

generateKey.describe("Generate Key Test Suite", () => {
  generateKey(`Generate Secret Key`, async () => {

    // Generate secret key
    KeyManager.generateAndStoreKey(envsEnums.Environments.SECRET_KEY_DEV); // specific to UAT environment, you can change it to your environment if needed

    logger.info(
      `${envsEnums.Environments.SECRET_KEY_DEV} Secret key generated successfully`
    );
  });
});
