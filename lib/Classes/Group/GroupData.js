import { BinaryNode } from "baileys";
import { GroupMetadata } from "baileys";
import { GroupParticipant } from "baileys";
import { ParticipantAction } from "baileys";

import { decodeJid } from "../../Common/Functions.js";

export class GroupData {
    constructor(ctx, jid) {
        this.ctx = ctx;
        this.jid = jid;
    }

    async members() {
        const metadata = await this.metadata();
        return metadata.participants;
    }

    async inviteCode() {
        return this.ctx._client.groupInviteCode(this.jid);
    }

    async revokeInviteCode() {
        return this.ctx._client.groupRevokeInvite(this.jid);
    }

    async joinApproval(mode) {
        return this.ctx._client.groupJoinApprovalMode(this.jid, mode);
    }

    async leave() {
        this.ctx._client.groupLeave(this.jid);
    }
    
    async membersCanAddMemberMode(mode) {
        return this.ctx._client.groupMemberAddMode(this.jid, mode === "on" ? "all_member_add" : "admin_add");
    }

    async metadata() {
        return this.ctx._client.groupMetadata(this.jid);
    }

    async getMetadata(key) {
        const metadata = await this.metadata();
        return metadata[key];
    }

    async name() {
        return this.getMetadata('subject');
    }

    async description() {
        return this.getMetadata('desc');
    }

    async owner() {
        return this.getMetadata('owner');
    }

    async isAdmin(jid) {
        const members = await this.members();
        const check = members.filter(x => decodeJid(x.id) === decodeJid(jid) && (x.admin === 'admin' || x.admin === 'superadmin'));
        return check.length > 0;
    }

    async isSenderAdmin() {
        return this.isAdmin(this.ctx.sender.decodedJid);
    }

    async isBotAdmin() {
        return this.isAdmin(this.ctx.me.decodedId);
    }

    async toggleEphemeral(expiration) {
        return this.ctx._client.groupToggleEphemeral(this.jid, expiration);
    }

    async updateDescription(description) {
        return this.ctx._client.groupUpdateDescription(this.jid, description);
    }

    async updateSubject(subject) {
        return this.ctx._client.groupUpdateSubject(this.jid, subject);
    }

    async membersUpdate(members, action) {
        return this.ctx._client.groupParticipantsUpdate(this.jid, members, action);
    }

    async kick(members) {
        return this.membersUpdate(members, 'remove');
    }

    async add(members) {
        return this.membersUpdate(members, 'add');
    }

    async promote(members) {
        return this.membersUpdate(members, 'promote');
    }

    async demote(members) {
        return this.membersUpdate(members, 'demote');
    }

    async pendingMembers() {
        return this.ctx._client.groupRequestParticipantsList(this.jid);
    }

    async pendingMembersUpdate(members, action) {
        return this.ctx._client.groupRequestParticipantsUpdate(this.jid, members, action);
    }

    async approvePendingMembers(members) {
        return this.pendingMembersUpdate(members, 'approve');
    }

    async rejectPendingMembers(members) {
        return this.pendingMembersUpdate(members, 'reject');
    }

    async updateSetting(setting) {
        await this.ctx._client.groupSettingUpdate(this.jid, setting);
    }

    async open() {
        await this.updateSetting('not_announcement');
    }

    async close() {
        await this.updateSetting('announcement');
    }

    async lock() {
        await this.updateSetting('locked');
    }

    async unlock() {
        await this.updateSetting('unlocked');
    }
}