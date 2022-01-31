import { VersionInfo } from "../../generated/definitions/content/VersionInfo";
import { basicJsonFileValidator, printDecodeOutcome } from "./validateJson";

const filename = "status/versionInfo.json";
const jsonPath = __dirname + `/../../${filename}`;

const returnCode = printDecodeOutcome(
  basicJsonFileValidator(jsonPath, VersionInfo),
  filename
).fold(
  _ => 1,
  __ => 0
);

// TODO: when the release is implemented in io-app, add a check to control that the versions are <= latest released version

process.exit(returnCode);
