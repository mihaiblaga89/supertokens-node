import { APIInterface, APIOptions } from "../../types";
import STError from "../../../../error";
import EmailVerification from "../../../emailverification";
import EmailVerificationRecipe from "../../../emailverification/recipe";
import { send200Response } from "../../../../utils";

export async function isEmailVerifiedAPI(_: APIInterface, options: APIOptions): Promise<boolean> {
    const req = options.req;
    const userId = req.getKeyValueFromQuery("userId");

    if (userId === undefined) {
        throw new STError({
            message: "Missing required parameter 'email'",
            type: STError.BAD_INPUT_ERROR,
        });
    }

    try {
        EmailVerificationRecipe.getInstanceOrThrowError();
    } catch (e) {
        send200Response(options.res, {
            status: "FEATURE_NOT_ENABLED",
        });
        return true;
    }

    const response = await EmailVerification.isEmailVerified(userId);

    send200Response(options.res, {
        status: "OK",
        isVerified: response,
    });
    return true;
}
