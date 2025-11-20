const ButtonType = [
  "cta_url",
  "cta_call",
  "cta_copy",
  "cta_reminder",
  "cta_cancel_reminder",
  "address_message",
  "send_location",
  "quick_reply"
];

export class ButtonBuilder {
  id;
  displayText;
  type;
  merhcant_url;
  url;
  copy_code;

  constructor(opts) {
    this.id = opts?.id || null;
    this.displayText = opts?.displayText || null;
    this.type = opts?.type || "quick_reply";
    this.merhcant_url = opts?.merhcant_url || null;
    this.url = opts?.url || null;
    this.copy_code = opts?.copy_code || null;
  }

  setId(id) {
    this.id = id;
    return this;
  }

  setDisplayText(text) {
    this.displayText = text;
    return this;
  }

  setType(type = "quick_reply") {
    if (!ButtonType.includes(type)) {
      throw new Error("Invalid button type");
    }
    this.type = type;
    return this;
  }

  setMerchantURL(url) {
    this.merhcant_url = url;
    return this;
  }

  setURL(url) {
    this.url = url;
    return this;
  }

  setCopyCode(content) {
    this.copy_code = content;
    return this;
  }

  build() {
    return {
      name: this.type,
      buttonParamsJson: JSON.stringify({
        display_text: this.displayText,
        id: this.id,
        copy_code: this.copy_code,
        merhcant_url: this.merhcant_url,
        url: this.url
      })
    };
  }
}