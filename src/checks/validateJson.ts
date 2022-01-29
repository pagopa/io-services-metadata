import * as t from "io-ts";
import { Context, Errors } from "io-ts";
import { Either, left, right } from "fp-ts/lib/Either";
import * as jsonValidator from "json-dup-key-validator";
import fs from "fs";

/**
 * Parse a string to a json object, checking for duplicate keys
 * @param content
 */
export const parseJson = (content: string): Either<Error, object> => {
  try {
    return right(jsonValidator.parse(content, false));
  } catch (e) {
    return left(e);
  }
};

/**
 * Read a file async transforming the results in Either
 * @param path
 */
export const readFileSync = (path: string): Either<Error, string> => {
  try {
    return right(fs.readFileSync(path).toString());
  } catch (e) {
    return left(e);
  }
};

/**
 * Print the result of an Either<Error, T>
 * @param result
 * @param path
 */
export const printDecodeOutcome = <T>(
  result: Either<Error, T>,
  path: string
) => {
  if (result.isLeft()) {
    console.error(
      `An error occurred while checking "${path}": ${result.value.message}`
    );
  } else {
    console.log(`"${path}" correctly read and decoded!`);
  }
  return result;
};

// Errors to Error utilities

const getContextPath = (context: Context): string => {
  if (context.length === 0) {
    return "] (decoder info n/a)";
  }
  const keysPath = context.map(({ key }) => key).join(".");
  const lastType = context[context.length - 1].type;

  if ("never" === lastType.name) {
    return `${keysPath}] is not a known property`;
  }

  return `${keysPath}] is not a valid [${lastType.name}]`;
};

const getMessage = (value: unknown, context: Context): string =>
  `value [${JSON.stringify(value)}] at [root${getContextPath(context)}`;

/**
 * Translates validation errors to more readable messages.
 */
export const errorsToReadableMessages = (es: Errors): ReadonlyArray<string> =>
  es.map(e => getMessage(e.value, e.context));

export const toError = (errors: Errors): Error => {
  return new Error(errorsToReadableMessages(errors).join(","));
};

/**
 * Perform a validation for a Json in a specific path, using a decoder. Check if:
 * - The file exists
 * - The file is a valid Json
 * - The Json doesn't have duplicate keys
 * - The Json can be decoded using the provided decoder
 * Any other specific semantic check can be chained to this basic check
 * @param jsonPath
 * @param decoder
 */
export const basicJsonFileValidator = <T>(
  jsonPath: string,
  decoder: t.Decoder<unknown, T>
): Either<Error, T> =>
  readFileSync(jsonPath)
    .chain(parseJson)
    .chain(x => decoder.decode(x).mapLeft(toError));
