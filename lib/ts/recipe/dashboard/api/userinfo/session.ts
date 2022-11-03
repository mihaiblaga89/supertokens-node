import { APIInterface, APIOptions } from "../../types";
import STError from "../../../../error";
import Session from "../../../session";
import { send200Response } from "../../../../utils";

export async function userSessionsGet(_: APIInterface, options: APIOptions): Promise<boolean> {
    const req = options.req;
    const userId = req.getKeyValueFromQuery("userId");

    if (userId === undefined) {
        throw new STError({
            message: "Missing required parameter 'userId'",
            type: STError.BAD_INPUT_ERROR,
        });
    }

    const response = await Session.getAllSessionHandlesForUser(userId);

    let updatedSessionArray: {
        sessionHandle: string;
        timeCreated: number;
        expiry: number;
    }[] = [];
    let sessionDataFetchPromises: (() => Promise<any>)[] = [];

    for (let i = 0; i < response.length; i++) {
        const sessionHandle = response[i];
        sessionDataFetchPromises.push(
            (): Promise<any> =>
                new Promise(async (resolve, reject) => {
                    try {
                        const sessionResponse = await Session.getSessionInformation(sessionHandle);

                        if (sessionResponse !== undefined) {
                            updatedSessionArray[i] = sessionResponse;
                        }

                        resolve(true);
                    } catch (e) {
                        // Something went wrong when fetching user meta data
                        reject(e);
                    }
                })
        );
    }

    let promiseArrayStartPosition = 0;
    let batchSize = 5;

    while (promiseArrayStartPosition < sessionDataFetchPromises.length) {
        /**
         * We want to query only 5 in parallel at a time
         *
         * First we check if the the array has enough elements to iterate
         * promiseArrayStartPosition + 4 (5 elements including current)
         */
        let promiseArrayEndPosition = promiseArrayStartPosition + (batchSize - 1);

        // If the end position is higher than the arrays length, we need to adjust it
        if (promiseArrayEndPosition >= sessionDataFetchPromises.length) {
            /**
             * For example if the array has 7 elements [A, B, C, D, E, F, G], when you run
             * the second batch [startPosition = 5], this will result in promiseArrayEndPosition
             * to be equal to 6 [5 + ((7 - 1) - 5)] and will then iterate over indexes [5] and [6]
             */
            promiseArrayEndPosition =
                promiseArrayStartPosition + (sessionDataFetchPromises.length - 1 - promiseArrayStartPosition);
        }

        let promisesToCall: (() => Promise<any>)[] = [];

        for (let j = promiseArrayStartPosition; j <= promiseArrayEndPosition; j++) {
            promisesToCall.push(sessionDataFetchPromises[j]);
        }

        await Promise.all(promisesToCall.map((p) => p()));
        promiseArrayStartPosition += batchSize;
    }

    send200Response(options.res, {
        status: "OK",
        sessions: updatedSessionArray,
    });
    return true;
}
