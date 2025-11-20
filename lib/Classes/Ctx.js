import { Collection } from "@discordjs/collection";
import { decodeJid, getSender, makeRealInteractiveMessage } from "../Common/Functions.js";
import makeWASocket, {
    downloadMediaMessage,
    generateWAMessageFromContent,
    getDevice,
    prepareWAMessageMedia,
    proto
} from "baileys";
import { WAProto } from "baileys";
import { MessageCollector } from "./Collector/MessageCollector.js";
import { GroupData } from "./Group/GroupData.js";
import { Group } from "./Group/Group.js";

export class Ctx {
    constructor(options) {
        this._used = options.used;
        this._args = options.args;
        this._self = options.self;
        this._client = options.client;
        this._msg = this._self.m;

        this._sender = {
            jid: getSender(this._msg, this._client),
            decodedJid: null,
            pushName: this._msg.pushName
        };

        if (this._sender.jid) {
            this._sender.decodedJid = decodeJid(this._sender.jid);
        }

        this._config = {
            prefix: this._self.prefix,
            cmd: this._self.cmd
        };
    }

    get id() {
        return this._msg.key.remoteJid;
    }

    get used() {
        return this._used;
    }

    get bot() {
        return this._self;
    }

    get me() {
        let user = this.core.user;
        user.decodedId = decodeJid(user.id);
        user.readyAt = this.bot.readyAt;
        return user;
    }

    get core() {
        return this._client;
    }

    get decodedId() {
        if (this._msg.key.remoteJid) {
            return decodeJid(this._msg.key.remoteJid);
        }
    }

    get args() {
        return this._args;
    }

    get msg() {
        return {
            ...this._msg,
            media: {
                toBuffer: () => this.getMediaMessage(this._msg, "buffer"),
                toStream: () => this.getMediaMessage(this._msg, "stream")
            }
        };
    }

    get sender() {
        return this._sender;
    }

    async sendMessage(jid, content, options = {}) {
        if (this._self.autoMention) {
            let matchMention = content.text?.match(/(@[^](?![a-zA-Z]).\d*[$]*)/gm);

            if (matchMention) {
                for (let i = 0; i < matchMention.length; i++) {
                    if (matchMention[i].match(/^@\d/gm)) {
                        const num = matchMention[i].slice(1);

                        if (content.mentions) {
                            content.mentions.push(`${num}@s.whatsapp.net`);
                        } else {
                            content.mentions = [];
                            content.mentions.push(`${num}@s.whatsapp.net`);
                        }
                    }
                }
            }
        }

        return this._client.sendMessage(jid, content, options);
    }

    async reply(content, options = {}) {
        if (typeof content === "string") {
            content = { text: content };
        }

        return this.sendMessage(this.id, content, {
            quoted: this._msg,
            ...options
        });
    }

    async replyWithJid(jid, content, options = {}) {
        return this.sendMessage(jid, content, {
            quoted: this._msg,
            ...options
        });
    }

    async react(jid, emoji, key) {
        return this._client.sendMessage(jid, {
            react: {
                text: emoji,
                key: key ? key : this._msg.key
            }
        });
    }

    MessageCollector(args = {
        filter() {
            throw new Error("Function not implemented.");
        },
        time: 0,
        max: 0,
        maxProcessed: 0
    }) {
        return new MessageCollector({ self: this._self, msg: this._msg }, args);
    }

    awaitMessages(args = {
        filter() {
            throw new Error("Function not implemented.");
        },
        time: 0,
        max: 0,
        maxProcessed: 0
    }) {
        return new Promise((resolve, reject) => {
            const col = this.MessageCollector(args);

            col.once("end", (collected, r) => {
                if (args.endReason?.includes(r)) {
                    reject(collected);
                } else {
                    resolve(collected);
                }
            });
        });
    }

    getMessageType() {
        return this._msg.messageType;
    }

    async getMediaMessage(msg, type) {
        try {
            const buffer = await downloadMediaMessage(
                msg,
                type,
                {},
                {
                    logger: this._self.logger,
                    reuploadRequest: this._client.updateMediaMessage
                }
            );

            return buffer;
        } catch {
            return null;
        }
    }

    read() {
        let m = this._msg;

        this._client.readMessages([
            {
                remoteJid: m.key.remoteJid,
                id: m.key.id,
                participant: m.key.participant
            }
        ]);
    }

    simulateTyping() {
        this._client.sendPresenceUpdate("composing", this.id);
    }

    async deleteMessage(key) {
        return this._client.sendMessage(this.id, { delete: key });
    }

    simulateRecording() {
        this._client.sendPresenceUpdate("recording", this.id);
    }

    async editMessage(key, newText) {
        return this.sendMessage(this.id, {
            text: newText,
            edit: key
        });
    }

    async sendPoll(jid, args) {
        args.selectableCount = args.singleSelect ? true : false;
        return this._client.sendMessage(jid, { poll: args });
    }

    getMentioned() {
        return this._msg.message?.extendedTextMessage
            ? this._msg.message.extendedTextMessage.contextInfo?.mentionedJid
            : [];
    }

    getDevice(id) {
        return getDevice(id ? id : this._msg.key.id);
    }

    isGroup() {
        return this.id?.endsWith("@g.us");
    }

    async block(jid) {
        if (jid) {
            await this._client.updateBlockStatus(decodeJid(jid), "block");
        } else {
            await this._client.updateBlockStatus(decodeJid(this.id), "block");
        }
    }

    async unblock(jid) {
        if (jid) {
            await this._client.updateBlockStatus(decodeJid(jid), "unblock");
        } else {
            await this._client.updateBlockStatus(decodeJid(this.id), "unblock");
        }
    }

    get groups() {
        return new Group(this);
    }

    group(jid) {
        return new GroupData(this, jid ? jid : this.id);
    }

    get quoted() {
        let msgContext = this._msg.message?.extendedTextMessage?.contextInfo;
        let quotedMessage = msgContext?.quotedMessage;

        return {
            ...quotedMessage,
            senderJid: msgContext?.participant,
            decodedSenderJid: decodeJid(msgContext?.participant),
            media: {
                toBuffer: async () => {
                    try {
                        let type = this.getContentType(quotedMessage);
                        let stream = await this.downloadContentFromMessage(
                            quotedMessage?.[type],
                            type.slice(0, -7)
                        );

                        let buffer = Buffer.from([]);

                        for await (const chunk of stream) {
                            buffer = Buffer.concat([buffer, chunk]);
                        }

                        return buffer;
                    } catch {
                        return null;
                    }
                },
                toStream: async () => {
                    try {
                        let type = this.getContentType(quotedMessage);
                        let stream = await this.downloadContentFromMessage(
                            quotedMessage?.[type],
                            type.slice(0, -7)
                        );

                        return stream;
                    } catch {
                        return null;
                    }
                }
            }
        };
    }

    getContentType(content) {
        return this._self.getContentType(content);
    }

    downloadContentFromMessage(downloadable, type, opts) {
        return this._self.downloadContentFromMessage(downloadable, type, opts);
    }

    sendInteractiveMessage(jid, content, options = {}) {
        let contentReal = makeRealInteractiveMessage(content);

        if (this._self.autoMention) {
            let matchMention = content.body?.match(/(@[^](?![a-zA-Z]).\d*[$]*)/gm);

            if (matchMention) {
                for (let i = 0; i < matchMention.length; i++) {
                    if (matchMention[i].match(/^@\d/gm)) {
                        const num = matchMention[i].slice(1);

                        if (contentReal.contextInfo?.mentionedJid) {
                            contentReal.contextInfo.mentionedJid.push(`${num}@s.whatsapp.net`);
                        } else {
                            contentReal.contextInfo = {
                                ...contentReal.contextInfo,
                                mentionedJid: [`${num}@s.whatsapp.net`]
                            };
                        }
                    }
                }
            }
        }

        let msg = generateWAMessageFromContent(
            jid,
            {
                viewOnceMessage: {
                    message: {
                        messageContextInfo: {
                            deviceListMetadata: {},
                            deviceListMetadataVersion: 2
                        },
                        interactiveMessage: proto.Message.InteractiveMessage.create(
                            contentReal
                        )
                    }
                }
            },
            options
        );

        this._client.relayMessage(jid, msg.message, {
            messageId: msg.key.id
        });
    }

    async replyInteractiveMessage(content, options = {}) {
        return this.sendInteractiveMessage(this.id, content, {
            quoted: this._msg,
            ...options
        });
    }

    async prepareWAMessageMedia(message, options) {
        return prepareWAMessageMedia(message, options);
    }

    decodeJid(jid) {
        return decodeJid(jid);
    }
}