"use strict";
var __awaiter =
    (this && this.__awaiter) ||
    function (thisArg, _arguments, P, generator) {
        function adopt(value) {
            return value instanceof P
                ? value
                : new P(function (resolve) {
                      resolve(value);
                  });
        }
        return new (P || (P = Promise))(function (resolve, reject) {
            function fulfilled(value) {
                try {
                    step(generator.next(value));
                } catch (e) {
                    reject(e);
                }
            }
            function rejected(value) {
                try {
                    step(generator["throw"](value));
                } catch (e) {
                    reject(e);
                }
            }
            function step(result) {
                result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected);
            }
            step((generator = generator.apply(thisArg, _arguments || [])).next());
        });
    };
Object.defineProperty(exports, "__esModule", { value: true });
const error_1 = require("../../../../error");
const session_1 = require("../../../session");
const utils_1 = require("../../../../utils");
function userSessionsGet(_, options) {
    return __awaiter(this, void 0, void 0, function* () {
        const req = options.req;
        const userId = req.getKeyValueFromQuery("userId");
        if (userId === undefined) {
            throw new error_1.default({
                message: "Missing required parameter 'userId'",
                type: error_1.default.BAD_INPUT_ERROR,
            });
        }
        const response = yield session_1.default.getAllSessionHandlesForUser(userId);
        let updatedSessionArray = [];
        let sessionDataFetchPromises = [];
        for (let i = 0; i < response.length; i++) {
            const sessionHandle = response[i];
            sessionDataFetchPromises.push(
                () =>
                    new Promise((resolve, reject) =>
                        __awaiter(this, void 0, void 0, function* () {
                            try {
                                const sessionResponse = yield session_1.default.getSessionInformation(sessionHandle);
                                if (sessionResponse !== undefined) {
                                    updatedSessionArray[i] = sessionResponse;
                                }
                                resolve(true);
                            } catch (e) {
                                // Something went wrong when fetching user meta data
                                reject(e);
                            }
                        })
                    )
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
            let promisesToCall = [];
            for (let j = promiseArrayStartPosition; j <= promiseArrayEndPosition; j++) {
                promisesToCall.push(sessionDataFetchPromises[j]);
            }
            yield Promise.all(promisesToCall.map((p) => p()));
            promiseArrayStartPosition += batchSize;
        }
        utils_1.send200Response(options.res, {
            status: "OK",
            sessions: updatedSessionArray,
        });
        return true;
    });
}
exports.userSessionsGet = userSessionsGet;
