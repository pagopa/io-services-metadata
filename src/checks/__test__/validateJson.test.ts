import * as E from "fp-ts/lib/Either";
import { parseJson, readFileSync } from "../validateJson";

const expectedValidJson = `{
  "min_app_version": {
    "ios": "1.27.0",
    "android": "1.27.0"
  },
  "min_app_version_pagopa": {
    "ios": "0.0.0",
    "android": "0.0.0"
  },
  "latest_released_app_version" : {
    "ios": "2.1.0.1",
    "android": "2.1.0.1"
  },
  "rollout_app_version" : {
    "ios": "0.0.0",
    "android": "0.0.0"
  }
}`;

const expectedValidJsonObject = {
  min_app_version: {
    ios: "1.27.0",
    android: "1.27.0"
  },
  min_app_version_pagopa: {
    ios: "0.0.0",
    android: "0.0.0"
  },
  latest_released_app_version: {
    ios: "2.1.0.1",
    android: "2.1.0.1"
  },
  rollout_app_version: {
    ios: "0.0.0",
    android: "0.0.0"
  }
};

const readDirectoryError =
  "Error: EISDIR: illegal operation on a directory, read";
const fileDoesntExistError = "ENOENT: no such file or directory, open";
const syntaxError = "Syntax error";

const expectedSyntaxError = "Should return a left(error) with Syntax error";

const expectSyntaxError = (value: string) => {
  const result = parseJson(value);
  if (E.isLeft(result)) {
    expect(result.left.message).toContain(syntaxError);
  } else {
    fail("result should be left");
  }
};

describe("validateJson", () => {
  describe("When readFileSync is used", () => {
    describe("And an invalid path is provided", () => {
      describe("And is a folder path", () => {
        it("Should return a left(Error)", () => {
          const result = readFileSync(__dirname + `/../__mock__/`);
          if (E.isLeft(result)) {
            expect(result.left.message).toStrictEqual(readDirectoryError);
          } else {
            fail("result should be left");
          }
        });
      });
      describe("And the file does not exist ", () => {
        it("Should return a left(Error)", () => {
          const result = readFileSync(
            __dirname + `/../__mock__/fileDoesntExists.fantasy`
          );
          if (E.isLeft(result)) {
            expect(result.left.message).toContain(fileDoesntExistError);
          } else {
            fail("result should be left");
          }
        });
      });
    });

    describe("And a valid path is provided", () => {
      describe("And is a textual file", () => {
        it("Should return a right(string)", () => {
          const result = readFileSync(
            __dirname + `/../__mock__/file/valid.json`
          );
          expect(result).toStrictEqual(E.right(expectedValidJson));
        });
      });
      describe("And is an empty file", () => {
        it("Should return a right(string)", () => {
          const result = readFileSync(__dirname + `/../__mock__/file/empty`);
          expect(result).toStrictEqual(E.right(""));
        });
      });
      describe("And is a binary file", () => {
        it("Should return a right", () => {
          const result = readFileSync(
            __dirname + `/../__mock__/file/binary.png`
          );
          expect(E.isRight(result)).toBeTruthy();
        });
      });
    });
  });

  describe("When parseJson is used", () => {
    describe("And an empty string is provided", () => {
      it(expectedSyntaxError, () => {
        expectSyntaxError("");
      });
    });
    describe("And an wrong formatted json is provided", () => {
      it(expectedSyntaxError, () => {
        expectSyntaxError('{"key":}');
      });
    });
    describe("And an json with duplicate key is provided", () => {
      it(expectedSyntaxError, () => {
        expectSyntaxError('{"key": 5,"key": 5 }');
      });
    });
    describe("And a valid string is provided", () => {
      it("Should return right(object) with the parsed json", () => {
        const result = parseJson(expectedValidJson);
        expect(result).toStrictEqual(E.right(expectedValidJsonObject));
      });
    });
  });
});
