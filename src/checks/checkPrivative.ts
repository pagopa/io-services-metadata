import fs from "fs";
import { PrivativeServices } from "../../generated/definitions/pagopa/privative/PrivativeServices";

const fileContent = fs
  .readFileSync(__dirname + "/../../status/privativeServices.json")
  .toString();
const privativeServices = PrivativeServices.decode(JSON.parse(fileContent));
if (!privativeServices.isRight()) {
  console.error(
    "status/privativeServices.json is not compatible with PrivativeServices type"
  );
  process.exit(1);
} else {
  // check for duplicated keys in sections
  Object.keys(privativeServices.value || {}).forEach(k => {
    const count = (fileContent.match(new RegExp(`"${k}"`, "gm")) || []).length;
    if (count > 1) {
      console.error(`sections key '${k}' is duplicated!`);
      process.exit(1);
    }
  });
  process.exit(0);
}
