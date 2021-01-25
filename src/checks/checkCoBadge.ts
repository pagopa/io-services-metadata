import fs from "fs";
import { BackendStatus } from "../@types/backendStatus";
import { CoBadgeServices } from "../../generated/definitions/pagopa/cobadge/CoBadgeServices";

const fileContent = fs
  .readFileSync(__dirname + "/../../status/cobadgeServices.json")
  .toString();
const cobadgeServices = CoBadgeServices.decode(JSON.parse(fileContent));
if (!cobadgeServices.isRight()) {
  console.error(
    "status/cobadgeServices.json is not compatible with CoBadgeServices type"
  );
  process.exit(1);
} else {
  // check for duplicated keys in sections
  Object.keys(cobadgeServices.value.sections || {}).forEach(k => {
    const count = (fileContent.match(new RegExp(`"${k}"`, "gm")) || []).length;
    if (count > 1) {
      console.error(`key '${k}' is duplicated!`);
      process.exit(1);
    }
  });
  process.exit(0);
}
