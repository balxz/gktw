import { proto } from "baileys";
import { makeRealInteractiveMessage } from "../../Common/Functions.js";

export class CarouselBuilder {
  constructor(opts) {
    this.cards = opts?.cards || [];
  }

  addCard(content) {
    this.cards.push(makeRealInteractiveMessage(content));
    return this;
  }

  build() {
    return this.cards;
  }
}