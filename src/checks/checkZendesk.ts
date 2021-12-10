import fs from "fs";
import { Zendesk } from "../../generated/definitions/content/Zendesk";
import { ZendeskCategory } from "../../generated/definitions/content/ZendeskCategory";
import { getDuplicates } from "../utils/collections";

/**
 * this script checks the zendesk config
 * it ensures that the json data match the expected type the app receives
 */

const error = (message: string) => {
  console.error(message);
  process.exit(1);
};

const fileContent = fs
  .readFileSync(__dirname + "/../../assistanceTools/zendesk.json")
  .toString();
const maybeZendeskConfig = Zendesk.decode(JSON.parse(fileContent));

if (maybeZendeskConfig.isLeft()) {
  error(`can't decode zendesk config assistanceTools/zendesk.json`);
} else {
  if (
    maybeZendeskConfig.value.zendeskCategories &&
    maybeZendeskConfig.value.zendeskCategories.categories.length === 0
  ) {
    error(`The categories field can't be an empty array`);
  }

  if (maybeZendeskConfig.value.zendeskCategories) {
    const zendeskCategories = maybeZendeskConfig.value.zendeskCategories;
    // check for duplicates in categories
    const duplicatedCategoriesValue = getDuplicates(
      zendeskCategories.categories,
      (a: ZendeskCategory, b: ZendeskCategory) => a.value === b.value
    );
    if (duplicatedCategoriesValue.length > 0) {
      error(
        `these categories are repeated more than one time:\n${duplicatedCategoriesValue
          .map(d => d.value)
          .join("\n")}`
      );
    }
  }
}
