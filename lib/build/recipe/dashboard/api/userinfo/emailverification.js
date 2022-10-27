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
const emailverification_1 = require("../../../emailverification");
const recipe_1 = require("../../../emailverification/recipe");
const utils_1 = require("../../../../utils");
function isEmailVerifiedAPI(_, options) {
    return __awaiter(this, void 0, void 0, function* () {
        const req = options.req;
        const userId = req.getKeyValueFromQuery("userId");
        if (userId === undefined) {
            throw new error_1.default({
                message: "Missing required parameter 'email'",
                type: error_1.default.BAD_INPUT_ERROR,
            });
        }
        try {
            recipe_1.default.getInstanceOrThrowError();
        } catch (e) {
            utils_1.send200Response(options.res, {
                status: "FEATURE_NOT_ENABLED",
            });
            return true;
        }
        const response = yield emailverification_1.default.isEmailVerified(userId);
        utils_1.send200Response(options.res, {
            status: "OK",
            isVerified: response,
        });
        return true;
    });
}
exports.isEmailVerifiedAPI = isEmailVerifiedAPI;
