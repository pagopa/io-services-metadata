import fs from "fs";
import * as t from "io-ts";
// required attributes
const LocalizedMessage = t.interface({
  "en-EN": t.string,
  "it-IT": t.string
});

const BackendStatusR = t.interface({
  is_alive: t.boolean,
  message: LocalizedMessage
});

const Levels = t.keyof({
  critical: null,
  normal: null,
  warning: null
});

// SectionStatus represents the status of a single section
const SectionStatusR = t.interface({
  is_visible: t.boolean,
  level: Levels,
  message: LocalizedMessage
});

const SectionStatusO = t.partial({
  web_url: LocalizedMessage
});

export const SectionStatus = t.intersection(
  [SectionStatusR, SectionStatusO],
  "SectionStatus"
);
export type SectionStatus = t.TypeOf<typeof SectionStatus>;

const Sections = t.interface({
  ingress: SectionStatus,
  login: SectionStatus,
  messages: SectionStatus,
  services: SectionStatus,
  wallets: SectionStatus
});
const BackendStatusO = t.partial({
  sections: Sections
});

export const BackendStatus = t.intersection(
  [BackendStatusR, BackendStatusO],
  "BackendStatus"
);
export type BackendStatus = t.TypeOf<typeof BackendStatus>;

const isRight = BackendStatus.decode(
  JSON.parse(fs.readFileSync(__dirname + "/../status/backend.json").toString())
).isRight();
if (!isRight) {
  console.error(
    "status/backend.json is not compatible with BackendStatus type"
  );
}
process.exit(isRight ? 0 : 1);
