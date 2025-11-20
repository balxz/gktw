//import { proto } from "@whiskeysockets/baileys";
//import { GroupMetadata } from "@whiskeysockets/baileys"; 

export class Group {
    constructor(ctx) {
        this.ctx = ctx;
    }

    async create(subject, members) {
        return this.ctx._client.groupCreate(subject, members);
    }

    async inviteCodeInfo(code) {
        return this.ctx._client.groupGetInviteInfo(code);
    }

    async acceptInvite(code) {
        return this.ctx._client.groupAcceptInvite(code);
    }

    async acceptInviteV4(key, inviteMessage) {
        return this.ctx._client.groupAcceptInviteV4(key, inviteMessage);
    }
}