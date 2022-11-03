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
const recipe_1 = require("../../../emailpassword/recipe");
const emailpassword_1 = require("../../../emailpassword");
const recipe_2 = require("../../../thirdparty/recipe");
const thirdparty_1 = require("../../../thirdparty");
const recipe_3 = require("../../../passwordless/recipe");
const passwordless_1 = require("../../../passwordless");
const utils_1 = require("../../../../utils");
function userInfoGet(_, options) {
    return __awaiter(this, void 0, void 0, function* () {
        const userId = options.req.getKeyValueFromQuery("userId");
        const recipeId = options.req.getKeyValueFromQuery("recipeId");
        if (userId === undefined) {
            throw new error_1.default({
                message: "Missing required parameter 'userId'",
                type: error_1.default.BAD_INPUT_ERROR,
            });
        }
        if (recipeId === undefined) {
            throw new error_1.default({
                message: "Missing required parameter 'recipeId'",
                type: error_1.default.BAD_INPUT_ERROR,
            });
        }
        let user;
        // TODO: For each recipe type check which super recipe was initialised, for example email password needs to check of email and tpep recipes
        if (recipeId === recipe_1.default.RECIPE_ID) {
            user = yield emailpassword_1.default.getUserById(userId);
        } else if (recipeId === recipe_2.default.RECIPE_ID) {
            user = yield thirdparty_1.default.getUserById(userId);
        } else if (recipeId === recipe_3.default.RECIPE_ID) {
            user = yield passwordless_1.default.getUserById({
                userId,
            });
        }
        if (user === undefined) {
            utils_1.send200Response(options.res, {
                status: "NO_USER_FOUND",
            });
            return true;
        }
        utils_1.send200Response(options.res, {
            status: "OK",
            user: {
                recipeId,
                user,
            },
        });
        return true;
    });
}
exports.default = userInfoGet;
