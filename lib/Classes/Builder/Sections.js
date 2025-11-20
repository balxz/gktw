export class SectionsBuilder {
  constructor(opts) {
    this.displayText = opts?.displayText || null;
    this.sections = opts?.sections || [];
  }

  setDisplayText(text) {
    this.displayText = text;
    return this;
  }

  addSection(content) {
    this.sections.push(content);
    return this;
  }

  build() {
    return {
      name: "single_select",
      buttonParamsJson: JSON.stringify({
        title: this.displayText,
        sections: this.sections
      })
    };
  }
}