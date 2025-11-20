import { Ctx } from "../Classes/Ctx.js";
import { Events } from "../Constant/Events.js";
import { MessageType } from "../Constant/MessageType.js";
import ExtractEventsContent from "./ExtractEventsContent.js";

export const emitPollCreation = async (m, ev, self, core) => {
    let used = ExtractEventsContent(m, MessageType.pollCreationMessage);
    m.pollValues = m.message.pollCreationMessage.options.map(x => x.optionName);
    m.pollSingleSelect = Boolean(m.message.pollCreationMessage.selectableOptionsCount);
    ev && ev.emit(Events.Poll, m, new Ctx({ used, args: [], self, client: core }));
};

export const emitPollUpdate = async (m, ev, self, core) => {
    let used = ExtractEventsContent(m, MessageType.pollUpdateMessage);
    ev && ev.emit(Events.PollVote, m, new Ctx({ used, args: [], self, client: core }));
};

export const emitReaction = async (m, ev, self, core) => {
    let used = ExtractEventsContent(m, MessageType.reactionMessage);
    ev.emit(Events.Reactions, m, new Ctx({ used, args: [], self, client: core }));
};

export const MessageEventList = {
    [MessageType.pollCreationMessage]: emitPollCreation,
    [MessageType.pollUpdateMessage]: emitPollUpdate,
    [MessageType.reactionMessage]: emitReaction
};