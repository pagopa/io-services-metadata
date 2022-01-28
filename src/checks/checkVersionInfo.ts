import {
  decodeJson,
  parseJson,
  printDecodeOutcome,
  readFileSync,
  toError
} from "./validateJson";
import { VersionInfo } from "../../generated/definitions/content/VersionInfo";

const filename = "status/versionInfo.json";
const jsonPath = __dirname + `/../../${filename}`;

const versionInfoCheck = readFileSync(jsonPath)
  .chain(parseJson)
  .chain(rawJson => decodeJson(VersionInfo, rawJson).mapLeft(toError))
  .extend(x => printDecodeOutcome(x, filename, VersionInfo));

versionInfoCheck.isLeft() ? process.exit(1) : process.exit(0);
