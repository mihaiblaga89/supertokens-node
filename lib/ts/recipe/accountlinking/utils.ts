/* Copyright (c) 2023, VRAI Labs and/or its affiliates. All rights reserved.
 *
 * This software is licensed under the Apache License, Version 2.0 (the
 * "License") as published by the Apache Software Foundation.
 *
 * You may not use this file except in compliance with the License. You may
 * obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS, WITHOUT
 * WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the
 * License for the specific language governing permissions and limitations
 * under the License.
 */

import type { NormalisedAppinfo, User } from "../../types";
import { SessionContainer } from "../session";
import type {
    TypeInput,
    RecipeLevelUser,
    RecipeInterface,
    TypeNormalisedInput,
    AccountInfoAndEmailWithRecipeId,
} from "./types";

async function defaultOnAccountLinked(_user: User, _newAccountInfo: RecipeLevelUser, _userContext: any) {}

async function defaultOnAccountUnlinked(_user: User, _unlinkedAccount: RecipeLevelUser, _userContext: any) {}

async function defaultShouldDoAutomaticAccountLinking(
    _newAccountInfo: AccountInfoAndEmailWithRecipeId,
    _user: User | undefined,
    _session: SessionContainer | undefined,
    _userContext: any
): Promise<{
    shouldAutomaticallyLink: false;
}> {
    return {
        shouldAutomaticallyLink: false,
    };
}

export function validateAndNormaliseUserInput(_: NormalisedAppinfo, config: TypeInput): TypeNormalisedInput {
    let onAccountLinked = config.onAccountLinked || defaultOnAccountLinked;
    let onAccountUnlinked = config.onAccountUnlinked || defaultOnAccountUnlinked;
    let shouldDoAutomaticAccountLinking =
        config.shouldDoAutomaticAccountLinking || defaultShouldDoAutomaticAccountLinking;

    let override = {
        functions: (originalImplementation: RecipeInterface) => originalImplementation,
        ...config.override,
    };

    return {
        override,
        onAccountLinked,
        onAccountUnlinked,
        shouldDoAutomaticAccountLinking,
    };
}
