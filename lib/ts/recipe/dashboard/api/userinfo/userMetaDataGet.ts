import { APIInterface, APIOptions } from "../../types";
import STError from "../../../../error";
import UserMetaDataRecipe from "../../../usermetadata/recipe";
import UserMetaData from "../../../usermetadata";
import { send200Response } from "../../../../utils";

export default async function userMetaDataGet(_: APIInterface, options: APIOptions): Promise<boolean> {
    const userId = options.req.getKeyValueFromQuery("userId");

    if (userId === undefined) {
        throw new STError({
            message: "Missing required parameter 'userId'",
            type: STError.BAD_INPUT_ERROR,
        });
    }

    try {
        UserMetaDataRecipe.getInstanceOrThrowError();
    } catch (e) {
        send200Response(options.res, {
            status: "FEATURE_NOT_ENABLED",
        });
        return true;
    }

    const metaDataResponse = UserMetaData.getUserMetadata(userId);
    send200Response(options.res, {
        status: "OK",
        data: (await metaDataResponse).metadata,
    });
    return true;
}
