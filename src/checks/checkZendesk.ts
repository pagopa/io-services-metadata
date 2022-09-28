import * as E from "fp-ts/lib/Either";
import { pipe } from "fp-ts/lib/function";
import { Zendesk } from "../../generated/definitions/content/Zendesk";
import { ZendeskCategory } from "../../generated/definitions/content/ZendeskCategory";
import { getDuplicates } from "../utils/collections";
import { basicJsonFileValidator, printDecodeOutcome } from "./validateJson";

/**
 * this script checks the zendesk config
 * it ensures that the json data match the expected type the app receives
 */

const filename = "assistanceTools/zendesk.json";
const jsonPath = __dirname + `/../../${filename}`;

const checkNonEmptyCategories = (
  zendesk: Zendesk
): E.Either<Error, Zendesk> => {
  if (
    zendesk.zendeskCategories &&
    zendesk.zendeskCategories.categories.length === 0
  ) {
    return E.left(new Error(`The categories field can't be an empty array`));
  }
  return E.right(zendesk);
};

const checkDuplicateCategories = (
  zendesk: Zendesk
): E.Either<Error, Zendesk> => {
  if (zendesk.zendeskCategories) {
    const zendeskCategories = zendesk.zendeskCategories;
    // check for duplicates in categories
    const duplicatedCategoriesValue = getDuplicates(
      zendeskCategories.categories,
      (a: ZendeskCategory, b: ZendeskCategory) => a.value === b.value
    );
    if (duplicatedCategoriesValue.length > 0) {
      return E.left(
        new Error(
          `these categories are repeated more than one time:\n${duplicatedCategoriesValue
            .map(d => d.value)
            .join("\n")}`
        )
      );
    }
  }
  return E.right(zendesk);
};

const returnCode = pipe(
  printDecodeOutcome(
    pipe(
      basicJsonFileValidator(jsonPath, Zendesk),
      E.chain(checkNonEmptyCategories),
      E.chain(checkDuplicateCategories)
    ),
    filename
  ),
  E.fold(
    _ => 1,
    __ => 0
  )
);

process.exit(returnCode);
