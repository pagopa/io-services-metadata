import fs from "fs";
import { BackendStatus } from "./@types/backendStatus";

const fileContent = fs
  .readFileSync(__dirname + "/../status/backend.json")
  .toString();
const backendStatus = BackendStatus.decode(JSON.parse(fileContent));
if (!backendStatus.isRight()) {
  console.error(
    "status/backend.json is not compatible with BackendStatus type"
  );
} else {
  // check for duplicated keys in sections
  Object.keys(backendStatus.value.sections || {}).forEach(k => {
    const count = (fileContent.match(new RegExp(`"${k}"`, "gm")) || []).length;
    if (count > 1) {
      console.error(`sections key '${k}' is duplicated!`);
      process.exit(1);
    }
  });
}
process.exit(backendStatus.isRight() ? 0 : 1);
