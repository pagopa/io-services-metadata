import { fromNullable } from "fp-ts/lib/Option";
import { readFileSync } from "fs";
import { toCamelCase, IAbi } from "../utils/bankNames";
describe("Test Success Case", () => {
  const updStatusAbi = toCamelCase(JSON.parse(
    readFileSync(__dirname + "/../../bonus/bpd/abi/pm_abi.json").toString()
  ) as IAbi);

  test("Should convert to Capital Case", () => {
    const bank = fromNullable(
      updStatusAbi.data.find(myBank => myBank.abi === "08988")
    );
    expect(bank.map(myBank => myBank.name).getOrElse("")).toMatch(
      /degli Ulivi/
    );
  });

  test("Should preserve hyphens inside words", () => {
    const bank = fromNullable(
      updStatusAbi.data.find(myBank => myBank.abi === "09506")
    );
    expect(bank.map(myBank => myBank.name).getOrElse("")).toMatch(/A-tono/);
  });

  test("Should preserve hyphens outside words", () => {
    const bank = fromNullable(
      updStatusAbi.data.find(myBank => myBank.abi === "01005")
    );
    expect(bank.map(myBank => myBank.name).getOrElse("")).toMatch(/\s+-\s+SPA/);
  });

  test("Should preserve ampersand outside words", () => {
    const bank = fromNullable(
      updStatusAbi.data.find(myBank => myBank.abi === "03332")
    );
    expect(bank.map(myBank => myBank.name).getOrElse("")).toMatch(
      /Passadore & C/
    );
  });

  test("Should preserve accents in lower case", () => {
    const bank = fromNullable(
      updStatusAbi.data.find(myBank => myBank.abi === "08883")
    );
    expect(bank.map(myBank => myBank.name).getOrElse("")).toMatch(/Società/);
  });

  test("Should preserve double quotes", () => {
    const bank = fromNullable(
      updStatusAbi.data.find(myBank => myBank.abi === "08947")
    );
    expect(bank.map(myBank => myBank.name).getOrElse("")).toMatch(
      /\"Don Stella\"/
    );
  });

  test("Should preserve numbers", () => {
    expect(
      fromNullable(updStatusAbi.data.find(myBank => myBank.abi === "08425"))
        .map(myBank => myBank.name)
        .getOrElse("")
    ).toMatch(/Banca Cambiano 1884 - SPA/);
  });

  test("Should split at apostrophes", () => {
    expect(
      fromNullable(updStatusAbi.data.find(myBank => myBank.abi === "08284"))
        .map(myBank => myBank.name)
        .getOrElse("")
    ).toMatch(/ll'Oltrepo/);
  });

  test("Should transform B.C.C. to BCC", () => {
    const bank = fromNullable(
      updStatusAbi.data.find(myBank => myBank.abi === "08899")
    );
    expect(bank.map(myBank => myBank.name).getOrElse("")).toMatch(
      /BCC di Treviglio/
    );
  });

  test("Should transformm De* to lower caase (no capital letter)", () => {
    expect(
      fromNullable(updStatusAbi.data.find(myBank => myBank.abi === "08913"))
        .map(myBank => myBank.name)
        .getOrElse("")
    ).toMatch(/BCC della Valle/);

    expect(
      fromNullable(updStatusAbi.data.find(myBank => myBank.abi === "08948"))
        .map(myBank => myBank.name)
        .getOrElse("")
    ).toMatch(/BCC Ericina di Val/);

    expect(
      fromNullable(updStatusAbi.data.find(myBank => myBank.abi === "08997"))
        .map(myBank => myBank.name)
        .getOrElse("")
    ).toMatch(/Marco dei Cavoti/);

    expect(
      fromNullable(updStatusAbi.data.find(myBank => myBank.abi === "03048"))
        .map(myBank => myBank.name)
        .getOrElse("")
    ).toMatch(/Banca del Piemonte/);

    expect(
      fromNullable(updStatusAbi.data.find(myBank => myBank.abi === "06010"))
        .map(myBank => myBank.name)
        .getOrElse("")
    ).toMatch(/Cassa dei Risparmi/);

    expect(
      fromNullable(updStatusAbi.data.find(myBank => myBank.abi === "08284"))
        .map(myBank => myBank.name)
        .getOrElse("")
    ).toMatch(/Banca di Credito Cooperativo dell'Oltrepo/);

    expect(
      fromNullable(updStatusAbi.data.find(myBank => myBank.abi === "08514"))
        .map(myBank => myBank.name)
        .getOrElse("")
    ).toMatch(/Banca di Credito Cooperativo dell’Oglio e del Serio SC/);
  });

  test("Should transformm E* to lower case (no capital letter)", () => {
    expect(
      fromNullable(updStatusAbi.data.find(myBank => myBank.abi === "06090"))
        .map(myBank => myBank.name)
        .getOrElse("")
    ).toMatch(/Risparmio di Biella e Vercelli/);

    expect(
      fromNullable(updStatusAbi.data.find(myBank => myBank.abi === "08378"))
        .map(myBank => myBank.name)
        .getOrElse("")
    ).toMatch(/Rurale ed Artigiana/);
  });

  test("Should take care of brand name typographic rules", () => {
    expect(
      fromNullable(updStatusAbi.data.find(myBank => myBank.abi === "03002"))
        .map(myBank => myBank.name)
        .getOrElse("")
    ).toMatch(/UniCredit Banca/);
  });
});
