export class VCardBuilder {
  constructor(opts) {
    this.fullName = opts?.fullName || null;
    this.org = opts?.org || null;
    this.number = opts?.number || null;
  }

  setFullName(fullName) {
    if (!fullName) throw new Error("[ gktw ] vcard builder need full name");
    this.fullName = fullName;
    return this;
  }

  setOrg(organizationName) {
    if (!organizationName) throw new Error("[ gktw ] vcard builder need organization name");
    this.org = organizationName;
    return this;
  }

  setNumber(number) {
    if (!number) throw new Error("[ gktw ] vcard builder need number");
    this.number = number;
    return this;
  }

  build() {
    const num = String(this.number).replace(/\s/g, "");
    return (
      "BEGIN:VCARD\n" +
      "VERSION:3.0\n" +
      `FN:${this.fullName}\n` +
      `ORG:${this.org};\n` +
      `TEL;type=CELL;type=VOICE;waid=${num}:+${this.number}\n` +
      "END:VCARD"
    );
  }
}