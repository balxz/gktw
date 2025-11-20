import { MessageType } from "../Constant/MessageType.js";

function ExtractEventsContent(m, msgType) {
    let used = { upsert: m.content };

    const eventMapping = {
        [MessageType.pollCreationMessage]: (m) => ({
            poll: m.message.pollCreationMessage.name
        }),
        [MessageType.pollUpdateMessage]: (m) => ({
            pollVote: m.content
        }),
        [MessageType.reactionMessage]: (m) => ({
            reactions: m.content
        })
    };

    return eventMapping[msgType] ? { ...used, ...eventMapping[msgType](m) } : used;
}

export default ExtractEventsContent;