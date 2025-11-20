/**
 * @deprecated Use Button Builder instead!
 */
export class TemplateButtonsBuilder {
  constructor(opts) {
    this.array = opts?.array || [];
    this.index = 0;
  }

  addURL(opts) {
    if (!opts.displayText || !opts.url) {
      throw new Error("[ gktw ] template button builder need url display text or url");
    }

    const index = this.index + 1;
    this.array.push({ index, urlButton: { ...opts } });
    this.index = index;
    return this;
  }

  addCall(opts) {
    if (!opts.displayText || !opts.phoneNumber) {
      throw new Error("[ gktw ] template button builder need call display text or phone number");
    }

    const index = this.index + 1;
    this.array.push({ index, callButton: { ...opts } });
    this.index = index;
    return this;
  }

  addQuickReply(opts) {
    if (!opts.displayText || ！opts.id) {
      throw new Error("[ gktw ] template button builder need quick reply display text or id");
    }

    const index = this.index + 1;
    this.array.push({ index, quickReplyButton: { ...opts } });
    this.index = index;
    return this;
  }

  build() {
    return this.array;
  }
}