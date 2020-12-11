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
  badge: LocalizedMessage,
  web_url: LocalizedMessage
});

export const SectionStatus = t.intersection(
  [SectionStatusR, SectionStatusO],
  "SectionStatus"
);
export type SectionStatus = t.TypeOf<typeof SectionStatus>;

const Sections = t.interface({
  bancomat: SectionStatus,
  bancomatpay: SectionStatus,
  cashback: SectionStatus,
  credit_card: SectionStatus,
  digital_payments: SectionStatus,
  email_validation: SectionStatus,
  ingress: SectionStatus,
  login: SectionStatus,
  messages: SectionStatus,
  satispay: SectionStatus,
  services: SectionStatus,
  wallets: SectionStatus
});
export type Sections = t.TypeOf<typeof Sections>;
const BackendStatusO = t.partial({
  sections: Sections
});

export const BackendStatus = t.intersection(
  [BackendStatusR, BackendStatusO],
  "BackendStatus"
);
export type BackendStatus = t.TypeOf<typeof BackendStatus>;

const fileContent = fs
  .readFileSync(__dirname + "/../status/backend.json")
  .toString();
const backendStatus = BackendStatus.decode(JSON.parse(fileContent));
if (!backendStatus.isRight()) {
  console.error(
    "status/backend.json is not compatible with BackendStatus type"
  );
} else {
  // check for duplicated keys in sections
  Object.keys(backendStatus.value.sections || {}).forEach(k => {
    const count = (fileContent.match(new RegExp(`"${k}"`, "gm")) || []).length;
    if (count > 1) {
      console.error(`sections key '${k}' is duplicated!`);
      process.exit(1);
    }
  });
}
process.exit(backendStatus.isRight() ? 0 : 1);
