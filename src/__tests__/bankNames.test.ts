/* eslint-disable import/order */
import { pipe } from "fp-ts/lib/function";
import * as O from "fp-ts/lib/Option";
import { readFileSync } from "fs";
import { IAbi, toCamelCase } from "../utils/bankNames";

describe("Test Success Case", () => {
  const updStatusAbi = toCamelCase(
    JSON.parse(
      readFileSync(__dirname + "/../../bonus/bpd/abi/pm_abi.json").toString()
    ) as IAbi
  );

  const findBank = (abiCode: string) =>
    pipe(
      updStatusAbi.data.find(myBank => myBank.abi === abiCode),
      O.fromNullable,
      O.map(myBank => myBank.name),
      O.getOrElse(() => "")
    );

  test("Should convert to Capital Case", () => {
    expect(findBank("08988")).toMatch(/degli Ulivi/);
  });

  test("Should preserve hyphens inside words", () => {
    expect(findBank("09506")).toMatch(/A-tono/);
  });

  test("Should preserve hyphens outside words", () => {
    expect(findBank("01005")).toMatch(/\s+-\s+SPA/);
  });

  test("Should preserve ampersand outside words", () => {
    expect(findBank("03332")).toMatch(/Passadore & C/);
  });

  test("Should preserve accents in lower case", () => {
    expect(findBank("08883")).toMatch(/Società/);
  });

  test("Should preserve double quotes", () => {
    expect(findBank("08947")).toMatch(/"Don Stella"/);
  });

  test("Should preserve numbers", () => {
    expect(findBank("08425")).toMatch(/Banca Cambiano 1884 - SPA/);
  });

  test("Should split at apostrophes", () => {
    expect(findBank("08284")).toMatch(/ll'Oltrepo/);
  });

  test("Should transform B.C.C. to BCC", () => {
    expect(findBank("08899")).toMatch(/BCC di Treviglio/);
  });

  test("Should transformm De* to lower caase (no capital letter)", () => {
    expect(findBank("08913")).toMatch(/BCC della Valle/);

    expect(findBank("08948")).toMatch(/BCC Ericina di Val/);

    expect(findBank("08997")).toMatch(/Marco dei Cavoti/);

    expect(findBank("03048")).toMatch(/Banca del Piemonte/);

    expect(findBank("06010")).toMatch(/Cassa dei Risparmi/);

    expect(findBank("08284")).toMatch(
      /Banca di Credito Cooperativo dell'Oltrepo/
    );

    expect(findBank("08514")).toMatch(
      /Banca di Credito Cooperativo dell’Oglio e del Serio SC/
    );
  });

  test("Should transformm E* to lower case (no capital letter)", () => {
    expect(findBank("06090")).toMatch(/Risparmio di Biella e Vercelli/);

    expect(findBank("08378")).toMatch(/Rurale ed Artigiana/);
  });

  test("Should take care of brand name typographic rules", () => {
    expect(findBank("03002")).toMatch(/UniCredit Banca/);
  });
});
