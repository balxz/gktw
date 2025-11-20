import { Collection } from "@discordjs/collection";
import { decodeJid, getContentFromMsg, getSender } from "../../Common/Functions.js";
import { Events } from "../../Constant/Events.js";
import { Collector } from "./Collector.js";

export class MessageCollector extends Collector {
  constructor(clientReq, options = {
    filter: function () {
      throw new Error("Function not implemented.");
    },
    time: 0,
    max: 0,
    maxProcessed: 0
  }) {
    super(options);

    this.clientReq = clientReq;
    this.jid = this.clientReq.msg.key.remoteJid;
    this.received = 0;

    this.clientReq.self.ev.on(Events.MessagesUpsert, this.collect);
    this.once("end", () => {
      this.removeListener(Events.MessagesUpsert, this.collect);
    });

    return this;
  }

  _collect(msg) {
    const content = getContentFromMsg(msg);
    if (!msg.key.fromMe && this.jid === msg.key.remoteJid && content?.length) {
      this.received++;
      const sender = getSender(msg, this.clientReq.self.core);
      return {
        ...msg,
        jid: msg.key.remoteJid,
        decodedJid: msg.key.remoteJid ? decodeJid(msg.key.remoteJid) : null,
        sender,
        decodedSender: sender ? decodeJid(sender) : null,
        content
      };
    }
    return null;
  }
}