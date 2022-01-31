// a simple check that contextual help data json respects type definition

import { Either, left, right } from "fp-ts/lib/Either";
import { ContextualHelp } from "../../generated/definitions/content/ContextualHelp";
import { getDuplicates } from "../utils/collections";
import { basicJsonFileValidator, printDecodeOutcome } from "./validateJson";

const filename = "contextualhelp/data.json";
const jsonPath = __dirname + `/../../${filename}`;

const checkNonEmptyCategories = (
  contextualHelp: ContextualHelp
): Either<Error, ContextualHelp> => {
  const itScreens = getDuplicates(
    contextualHelp.it.screens,
    (a, b) => a.route_name === b.route_name
  );
  const enScreens = getDuplicates(
    contextualHelp.en.screens,
    (a, b) => a.route_name === b.route_name
  );
  if (itScreens.length + enScreens.length > 0) {
    return left(
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
  return right(contextualHelp);
};

const returnCode = printDecodeOutcome(
  basicJsonFileValidator(jsonPath, ContextualHelp).chain(
    checkNonEmptyCategories
  ),
  filename
).fold(
  _ => 1,
  __ => 0
);

process.exit(returnCode);
