// a simple check that CGN featured opportunities json respects type definition
import * as E from "fp-ts/lib/Either";
import { pipe } from "fp-ts/lib/function";
import { CgnFeaturedOpportunities } from "../../generated/definitions/content/CgnFeaturedOpportunities";
import { basicJsonFileValidator, printDecodeOutcome } from "./validateJson";

const filename = "bonus/cgn/featured_opportunities.json";
const jsonPath = __dirname + `/../../${filename}`;

const returnCode = pipe(
  printDecodeOutcome(
    basicJsonFileValidator(jsonPath, CgnFeaturedOpportunities),
    filename
  ),
  E.fold(
    _ => 1,
    __ => 0
  )
);

process.exit(returnCode);
