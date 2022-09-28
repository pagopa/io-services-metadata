/* eslint-disable import/order */
import * as E from "fp-ts/lib/Either";
import { pipe } from "fp-ts/lib/function";
import fs from "fs";
import { Abi } from "../../generated/definitions/pagopa/walletv2/Abi";
import { AbiListResponse } from "../../generated/definitions/pagopa/walletv2/AbiListResponse";
import { getDuplicates } from "../utils/collections";
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
): E.Either<Error, AbiListResponse> => {
  const data = abiListResponse.data || [];
  const errors = data
    .filter(issuer => !fs.existsSync(abiLogoPath + `${issuer.abi}.png`))
    .map(issuer => `${issuer.abi} - "${issuer.name}"`);
  if (errors.length > 0) {
    return E.left(
      new Error(
        `Please add the missing logo${
          errors.length > 1 ? "s" : ""
        }:\n${errors.join("\n")}`
      )
    );
  }
  return E.right(abiListResponse);
};
/**
 * check if the total and size match the array length
 * @param abiListResponse
 */
const checkSizeAndTotalMatch = (
  abiListResponse: AbiListResponse
): E.Either<Error, AbiListResponse> => {
  const data = abiListResponse.data || [];
  if (
    data.length !== abiListResponse.total ||
    data.length !== abiListResponse.size
  ) {
    return E.left(new Error(`total & size should be: ${data.length}`));
  }
  return E.right(abiListResponse);
};

/**
 * check for duplicates
 * @param abiListResponse
 */
const checkForDuplicates = (
  abiListResponse: AbiListResponse
): E.Either<Error, AbiListResponse> => {
  const data = abiListResponse.data || [];
  const duplicated = getDuplicates(data, (a: Abi, b: Abi) => a.abi === b.abi);
  if (duplicated.length > 0) {
    return E.left(
      new Error(
        `these abi are repeated more than one time:\n${duplicated
          .map(d => d.abi)
          .join("\n")}`
      )
    );
  }
  return E.right(abiListResponse);
};

const returnCode = pipe(
  printDecodeOutcome(
    pipe(
      basicJsonFileValidator(jsonPath, AbiListResponse),
      E.chain(checkAllLogosExist),
      E.chain(checkSizeAndTotalMatch),
      E.chain(checkForDuplicates)
    ),
    filename
  ),
  E.fold(
    _ => 1,
    __ => 0
  )
);

process.exit(returnCode);
