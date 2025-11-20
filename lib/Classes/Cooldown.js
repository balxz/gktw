import { Collection } from "@discordjs/collection";
import { decodeJid } from "../Common/Functions.js";
import EventEmitter from "events";

export class Cooldown extends EventEmitter {
    constructor(ctx, ms) {
        super();
        this.ms = ms;
        this.cooldown = ctx._self.cooldown;
        this.timeout = 0;

        const q = `cooldown_${ctx._used.command}_${decodeJid(ctx._msg.key.remoteJid)}_${decodeJid(ctx._sender.jid)}`;
        const get = this.cooldown?.get(q);

        if (get) {
            this.timeout = Number(get) - Date.now();
        } else {
            this.cooldown?.set(q, Date.now() + ms);
            setTimeout(() => {
                this.cooldown?.delete(q);
                this.emit("end");
            }, ms);
        }
    }

    get onCooldown() {
        return this.timeout ? true : false;
    }

    get timeleft() {
        return this.timeout;
    }
}