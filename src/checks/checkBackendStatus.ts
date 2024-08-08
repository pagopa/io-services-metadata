import * as E from "fp-ts/lib/Either";
import { pipe } from "fp-ts/lib/function";
import { BackendStatus } from "../../generated/definitions/content/BackendStatus";
import { basicJsonFileValidator, printDecodeOutcome } from "./validateJson";

const filename = "status/backend.json";
const jsonPath = __dirname + `/../../${filename}`;

const returnCode = pipe(
  printDecodeOutcome(basicJsonFileValidator(jsonPath, BackendStatus), filename),
  E.fold(
    _ => 1,
    payload => {
      const { statusMessages } = payload;
      if (statusMessages) {
        const routes: ReadonlyArray<string> = statusMessages.items.reduce(
          (res: ReadonlyArray<string>, m) => [...res, ...m.routes],
          []
        );
        const routesSet = new Set<string>(routes);

        if (routes.length > routesSet.size) {
          console.error(
            "Error on status messages: Seems to have a duplicate route, check the status messages"
          );
          return 1;
        }
      }
      return 0;
    }
  )
);

process.exit(returnCode);
