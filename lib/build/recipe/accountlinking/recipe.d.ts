// @ts-nocheck
import error from "../../error";
import { BaseRequest, BaseResponse } from "../../framework";
import normalisedURLPath from "../../normalisedURLPath";
import RecipeModule from "../../recipeModule";
import type { APIHandled, HTTPMethod, NormalisedAppinfo, RecipeListFunction } from "../../types";
import { SessionContainer } from "../session";
import type { TypeNormalisedInput, RecipeInterface, TypeInput, AccountInfoAndEmailWithRecipeId } from "./types";
export default class Recipe extends RecipeModule {
    private static instance;
    static RECIPE_ID: string;
    config: TypeNormalisedInput;
    recipeInterfaceImpl: RecipeInterface;
    isInServerlessEnv: boolean;
    constructor(
        recipeId: string,
        appInfo: NormalisedAppinfo,
        isInServerlessEnv: boolean,
        config: TypeInput,
        _recipes: {},
        _ingredients: {}
    );
    static init(config: TypeInput): RecipeListFunction;
    static getInstanceOrThrowError(): Recipe;
    getAPIsHandled(): APIHandled[];
    handleAPIRequest(
        _id: string,
        _req: BaseRequest,
        _response: BaseResponse,
        _path: normalisedURLPath,
        _method: HTTPMethod
    ): Promise<boolean>;
    handleError(error: error, _request: BaseRequest, _response: BaseResponse): Promise<void>;
    getAllCORSHeaders(): string[];
    isErrorFromThisRecipe(err: any): err is error;
    getIdentitiesForPrimaryUserId: (
        primaryUserId: string
    ) => Promise<{
        verified: {
            emails: string[];
            phoneNumbers: string[];
            thirdpartyInfo: {
                thirdpartyId: string;
                thirdpartyUserId: string;
            }[];
        };
        unverified: {
            emails: string[];
            phoneNumbers: string[];
            thirdpartyInfo: {
                thirdpartyId: string;
                thirdpartyUserId: string;
            }[];
        };
    }>;
    isSignUpAllowed: ({
        info,
        userContext,
    }: {
        info: AccountInfoAndEmailWithRecipeId;
        userContext: any;
    }) => Promise<boolean>;
    createPrimaryUserIdOrLinkAccountPostSignUp: ({
        info,
        infoVerified,
        recipeUserId,
        userContext,
    }: {
        info: AccountInfoAndEmailWithRecipeId;
        infoVerified: boolean;
        recipeUserId: string;
        userContext: any;
    }) => Promise<string>;
    accountLinkPostSignInViaSession: ({
        session,
        info,
        infoVerified,
        userContext,
    }: {
        session: SessionContainer;
        info: AccountInfoAndEmailWithRecipeId;
        infoVerified: boolean;
        userContext: any;
    }) => Promise<
        | {
              createRecipeUser: true;
              updateVerificationClaim: boolean;
          }
        | ({
              createRecipeUser: false;
          } & {
              accountsLinked: true;
              updateVerificationClaim: boolean;
          })
        | ({
              createRecipeUser: false;
          } & {
              accountsLinked: false;
              reason:
                  | "RECIPE_USER_ID_ALREADY_LINKED_WITH_ANOTHER_PRIMARY_USER_ID_ERROR"
                  | "ACCOUNT_INFO_ALREADY_LINKED_WITH_ANOTHER_PRIMARY_USER_ID_ERROR"
                  | "ACCOUNT_LINKING_IS_NOT_ALLOWED_ERROR"
                  | "EXISTING_ACCOUNT_NEEDS_TO_BE_VERIFIED_ERROR"
                  | "NEW_ACCOUNT_NEEDS_TO_BE_VERIFIED_ERROR";
          })
    >;
}
