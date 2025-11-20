import makeWASocket, { getContentType, jidDecode, proto } from "baileys";
import fs from "node:fs";
import path from "node:path";

export const arrayMove = (arr, old_index, new_index) => {
  if (new_index >= arr.length) {
    let k = new_index - arr.length + 1;
    while (k--) {
      arr.push(undefined);
    }
  }
  arr.splice(new_index, 0, arr.splice(old_index, 1)[0]);
  return arr;
};

export const getContentFromMsg = (msg) => {
  const type = getContentType(msg.message);

  switch (type) {
    case "conversation":
      return msg.message.conversation;
    case "imageMessage":
      return msg.message.imageMessage.caption;
    case "documentMessage":
      return msg.message.documentMessage.caption;
    case "videoMessage":
      return msg.message.videoMessage.caption;
    case "extendedTextMessage":
      return msg.message.extendedTextMessage.text;
    case "listResponseMessage":
      return msg.message.listResponseMessage.singleSelectReply.selectedRowId;
    case "buttonsResponseMessage":
      return msg.message.buttonsResponseMessage.selectedButtonId;
    case "templateButtonReplyMessage":
      return msg.message.templateButtonReplyMessage.selectedId;
    case "interactiveResponseMessage":
      return JSON.parse(
        msg.message.interactiveResponseMessage.nativeFlowResponseMessage.paramsJson
      ).id;
    case "messageContextInfo":
      return (
        msg.message.buttonsResponseMessage?.selectedButtonId ||
        msg.message.listResponseMessage?.singleSelectReply?.selectedRowId ||
        msg.message.interactiveResponseMessage?.nativeFlowResponseMessage
      );
    default:
      return "";
  }
};

export const getSender = (msg, client) => {
  return msg.key.fromMe
    ? client.user.id
    : msg.participant
    ? msg.participant
    : msg.key.participant
    ? msg.key.participant
    : msg.key.remoteJid;
};

export const walk = (dir, callback) => {
  const files = fs.readdirSync(dir);
  files.forEach((file) => {
    const filepath = path.join(dir, file);
    const stats = fs.statSync(filepath);
    if (stats.isDirectory()) {
      walk(filepath, callback);
    } else if (stats.isFile()) {
      callback(filepath, stats);
    }
  });
};

export const decodeJid = (jid) => {
  if (!jid) return jid;
  if (/:\d+@/gi.test(jid)) {
    let decode = jidDecode(jid);
    return decode && decode.user && decode.server
      ? decode.user + "@" + decode.server
      : jid;
  }
  return jid;
};

export const makeRealInteractiveMessage = (content) => {
  let contentReal = {};
  Object.keys(content).map((x) => {
    if (x === "body") {
      contentReal.body = proto.Message.InteractiveMessage.Body.create({
        text: content.body
      });
    } else if (x === "footer") {
      contentReal.footer = proto.Message.InteractiveMessage.Footer.create({
        text: content.footer
      });
    } else if (x === "contextInfo") {
      contentReal.contextInfo = content.contextInfo;
    } else if (x === "shopStorefrontMessage") {
      contentReal.shopStorefrontMessage =
        proto.Message.InteractiveMessage.ShopMessage.create(
          content.shopStorefrontMessage
        );
    } else {
      let prop =
        proto.Message.InteractiveMessage[
          x.charAt(0).toUpperCase() + x.slice(1)
        ];
      contentReal[x] = prop.create(content[x]);
    }
  });

  return contentReal;
};