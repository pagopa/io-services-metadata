import fs from "fs";
import { Either, left, right } from "fp-ts/lib/Either";
import { AbiListResponse } from "../../generated/definitions/pagopa/walletv2/AbiListResponse";
import { getDuplicates } from "../utils/collections";
import { Abi } from "../../generated/definitions/pagopa/walletv2/Abi";
import { basicJsonFileValidator, printDecodeOutcome } from "./validateJson";

/**
 * this script checks abi.json file
 * - check the data has the expected shape
 * - check each issuer has its own logo
 */

const filename = "status/abi.json";
const jsonPath = __dirname + `/../../${filename}`;
const abiLogoPath = __dirname + "/../../logos/abi/";

const checkAllLogosExist = (
  abiListResponse: AbiListResponse
): Either<Error, AbiListResponse> => {
  const data = abiListResponse.data || [];
  const errors = data
    .filter(issuer => !fs.existsSync(abiLogoPath + `${issuer.abi}.png`))
    .map(issuer => `${issuer.abi} - "${issuer.name}"`);
  if (errors.length > 0) {
    return left(
      new Error(
        `Please add the missing logo${
          errors.length > 1 ? "s" : ""
        }:\n${errors.join("\n")}`
      )
    );
  }
  return right(abiListResponse);
};
/**
 * check if the total and size match the array length
 * @param abiListResponse
 */
const checkSizeAndTotalMatch = (
  abiListResponse: AbiListResponse
): Either<Error, AbiListResponse> => {
  const data = abiListResponse.data || [];
  if (
    data.length !== abiListResponse.total ||
    data.length !== abiListResponse.size
  ) {
    return left(new Error(`total & size should be: ${data.length}`));
  }
  return right(abiListResponse);
};

/**
 * check for duplicates
 * @param abiListResponse
 */
const checkForDuplicates = (
  abiListResponse: AbiListResponse
): Either<Error, AbiListResponse> => {
  const data = abiListResponse.data || [];
  const duplicated = getDuplicates(data, (a: Abi, b: Abi) => a.abi === b.abi);
  if (duplicated.length > 0) {
    return left(
      new Error(
        `these abi are repeated more than one time:\n${duplicated
          .map(d => d.abi)
          .join("\n")}`
      )
    );
  }
  return right(abiListResponse);
};

const returnCode = printDecodeOutcome(
  basicJsonFileValidator(jsonPath, AbiListResponse)
    .chain(checkAllLogosExist)
    .chain(checkSizeAndTotalMatch)
    .chain(checkForDuplicates),
  filename
).fold(
  _ => 1,
  __ => 0
);

process.exit(returnCode);
