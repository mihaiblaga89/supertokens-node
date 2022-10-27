import { APIInterface, APIOptions } from "../../types";
import STError from "../../../../error";
import EmailPasswordRecipe from "../../../emailpassword/recipe";
import EmailPassword from "../../../emailpassword";
import ThirdPartyRecipe from "../../../thirdparty/recipe";
import ThirdParty from "../../../thirdparty";
import PasswordlessRecipe from "../../../passwordless/recipe";
import Passwordless from "../../../passwordless";
import { send200Response } from "../../../../utils";

export default async function userInfoGet(_: APIInterface, options: APIOptions): Promise<boolean> {
    const userId = options.req.getKeyValueFromQuery("userId");
    const recipeId = options.req.getKeyValueFromQuery("recipeId");

    if (userId === undefined) {
        throw new STError({
            message: "Missing required parameter 'userId'",
            type: STError.BAD_INPUT_ERROR,
        });
    }

    if (recipeId === undefined) {
        throw new STError({
            message: "Missing required parameter 'recipeId'",
            type: STError.BAD_INPUT_ERROR,
        });
    }

    let user;

    if (recipeId === EmailPasswordRecipe.RECIPE_ID) {
        user = await EmailPassword.getUserById(userId);
    } else if (recipeId === ThirdPartyRecipe.RECIPE_ID) {
        user = await ThirdParty.getUserById(userId);
    } else if (recipeId === PasswordlessRecipe.RECIPE_ID) {
        user = await Passwordless.getUserById({
            userId,
        });
    }

    if (user === undefined) {
        send200Response(options.res, {
            status: "NO_USER_FOUND",
        });
        return true;
    }

    send200Response(options.res, {
        status: "OK",
        user: {
            recipeId,
            user,
        },
    });
    return true;
}
