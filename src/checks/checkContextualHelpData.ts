// a simple check that contextual help data json respects type definition

import * as E from "fp-ts/lib/Either";
import { pipe } from "fp-ts/lib/function";
import { ContextualHelp } from "../../generated/definitions/content/ContextualHelp";
import { getDuplicates } from "../utils/collections";
import { basicJsonFileValidator, printDecodeOutcome } from "./validateJson";

const filename = "contextualhelp/data.json";
const jsonPath = __dirname + `/../../${filename}`;

const checkNonEmptyCategories = (
  contextualHelp: ContextualHelp
): E.Either<Error, ContextualHelp> => {
  const itScreens = getDuplicates(
    contextualHelp.it.screens,
    (a, b) => a.route_name === b.route_name
  );
  const enScreens = getDuplicates(
    contextualHelp.en.screens,
    (a, b) => a.route_name === b.route_name
  );
  if (itScreens.length + enScreens.length > 0) {
    return E.left(
      new Error(
        `these screens are repeated more than one time :\n${[
          ...itScreens,
          ...enScreens
        ]
          .map(d => d.route_name)
          .join("\n")}`
      )
    );
  }
  return E.right(contextualHelp);
};

const returnCode = pipe(
  printDecodeOutcome(
    pipe(
      basicJsonFileValidator(jsonPath, ContextualHelp),
      E.chain(checkNonEmptyCategories)
    ),
    filename
  ),
  E.fold(
    _ => 1,
    _ => 0
  )
);

process.exit(returnCode);
