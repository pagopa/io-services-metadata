import {
  basicJsonFileValidator,
  decodeJson,
  parseJson,
  printDecodeOutcome,
  readFileSync,
  toError
} from "./validateJson";
import { VersionInfo } from "../../generated/definitions/content/VersionInfo";

const filename = "status/versionInfo.json";
const jsonPath = __dirname + `/../../${filename}`;

const versionInfoCheck = basicJsonFileValidator(jsonPath, VersionInfo).extend(
  x => printDecodeOutcome(x, filename, VersionInfo)
);

// TODO: when the release is implemented in io-app, add a check to control that the versions are <= latest released version

versionInfoCheck.isLeft() ? process.exit(1) : process.exit(0);
