/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable import/prefer-default-export */

import { AUTH_MODE, IS_IN_PRODUCTION_ENVIRONMENT } from 'lib/utils/config'

import Session from 'supertokens-node/recipe/session'
import { TypeInput, SuperTokensInfo, RecipeListFunction } from 'supertokens-node/types'
import ThirdPartyEmailPassword from 'supertokens-node/recipe/thirdpartyemailpassword'
import EmailPassword from "supertokens-node/recipe/emailpassword";
import Passwordless from "supertokens-node/recipe/passwordless";
import ThirdParty from "supertokens-node/recipe/thirdparty";
import ThirdPartyPasswordless from "supertokens-node/recipe/thirdpartypasswordless";

import { appInfo } from './appInfo'


const supertokens: SuperTokensInfo = {
  connectionURI: process.env.SUPERTOKENS_CONNECTION_URI as string,
  apiKey: process.env.SUPERTOKENS_API_KEY as string,
}

const isInServerlessEnv: boolean = true;

const framework = "express";

const sessionInit: RecipeListFunction = Session.init({
  // For localhost, we need to set sameSite to strict, due to no https
  cookieSameSite: !IS_IN_PRODUCTION_ENVIRONMENT ? 'strict' : 'none',
});

/**
 * These credentials are provided by the SuperTokens team for debugging purposes: https://supertokens.com/docs/thirdpartyemailpassword/custom-ui/init/backend#3-initialise-social-login-providers
 * 
 * Remember to replace these with your own before deploying to production
 */
const appleClientInfo = {
  clientId: "4398792-io.supertokens.example.service",
  clientSecret: {
      keyId: "7M48Y4RYDL",
      privateKey:
          "-----BEGIN PRIVATE KEY-----\nMIGTAgEAMBMGByqGSM49AgEGCCqGSM49AwEHBHkwdwIBAQQgu8gXs+XYkqXD6Ala9Sf/iJXzhbwcoG5dMh1OonpdJUmgCgYIKoZIzj0DAQehRANCAASfrvlFbFCYqn3I2zeknYXLwtH30JuOKestDbSfZYxZNMqhF/OzdZFTV0zc5u5s3eN+oCWbnvl0hM+9IW0UlkdA\n-----END PRIVATE KEY-----",
      teamId: "YWQCXGJRJL",
  },
}

/**
 * These credentials are provided by the SuperTokens team for debugging purposes: https://supertokens.com/docs/thirdpartyemailpassword/custom-ui/init/backend#3-initialise-social-login-providers
 * 
 * Remember to replace these with your own before deploying to production
 */
const googleClientInfo = {
  clientId: process.env.GOOGLE_CLIENT_ID as string,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
}

const thirdPartyEmailPasswordConfig = (): TypeInput => ({
  framework,
  supertokens,
  appInfo,
  isInServerlessEnv,
  recipeList: [
    ThirdPartyEmailPassword.init({
      providers: [
        ThirdPartyEmailPassword.Google(googleClientInfo),
        ThirdPartyEmailPassword.Apple(appleClientInfo),
      ],
    }),
    sessionInit,
  ],
})

const emailPasswordConfig = (): TypeInput => ({
  framework,
  supertokens,
  appInfo,
  isInServerlessEnv,
  recipeList: [
    EmailPassword.init(),
    sessionInit,
  ],
})

const passwordlessConfig = (): TypeInput => ({
  framework,
  supertokens,
  appInfo,
  isInServerlessEnv,
  recipeList: [
    Passwordless.init({
      contactMethod: "EMAIL",
      flowType: "USER_INPUT_CODE",
    }),
    sessionInit,
  ],
})

const thirdPartyConfig = (): TypeInput => ({
  framework,
  supertokens,
  appInfo,
  isInServerlessEnv,
  recipeList: [
    ThirdParty.init({
      signInAndUpFeature: {
        providers: [
          ThirdParty.Google(googleClientInfo),
          ThirdParty.Apple(appleClientInfo)
        ],
      },
    }),
    sessionInit,
  ],
})

const thirdPartyPasswordlessConfig = (): TypeInput => ({
  framework,
  supertokens,
  appInfo,
  isInServerlessEnv,
  recipeList: [
    ThirdPartyPasswordless.init({
      contactMethod: "EMAIL",
      flowType: "USER_INPUT_CODE",
      providers: [
        ThirdPartyPasswordless.Google(googleClientInfo),
        ThirdPartyPasswordless.Apple(appleClientInfo)
      ],
    }),
    sessionInit,
  ],
})

export function getBackendConfig(): TypeInput {
  if (AUTH_MODE === "thirdpartyemailpassword") {
    return thirdPartyEmailPasswordConfig();
  }

  if (AUTH_MODE === "emailpassword") {
    return emailPasswordConfig();
  }

  if (AUTH_MODE === "thirdparty") {
    return thirdPartyConfig();
  }

  if (AUTH_MODE === "passwordless") {
    return passwordlessConfig();
  }

  return thirdPartyPasswordlessConfig();
}
