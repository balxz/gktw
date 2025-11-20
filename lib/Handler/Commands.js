import { arrayMove } from "../Common/Functions.js";
import { Ctx } from "../Classes/Ctx.js";

export default async (self, runMiddlewares) => {
    let { cmd, prefix, m } = self;

    if (!m || !m.message || (m.key && m.key.remoteJid === "status@broadcast")) return;
    if (!self.selfReply && m.key && m.key.fromMe) return;

    const hasHears = Array.from(self.hearsMap.values()).filter((x) => 
        x.name === m.content || 
        x.name === m.messageType || 
        new RegExp(x.name).test(m.content) || 
        (Array.isArray(x.name) && x.name.includes(m.content))
    );

    if (hasHears.length) {
        return hasHears.forEach((x) => 
            x.code(new Ctx({ used: { hears: m.content }, args: [], self, client: self.core }))
        );
    }

    let commandsList = Array.from(cmd ? cmd.values() : []);
    let selectedPrefix;

    if (Array.isArray(prefix)) {
        if (prefix[0] == "") {
            const emptyIndex = prefix.findIndex((x) => x.includes(""));
            prefix = arrayMove(prefix, emptyIndex - 1, prefix.length - 1);
        } else {
            selectedPrefix = prefix.find((p) => m.content && m.content.startsWith(p));
        }
    } else if (prefix instanceof RegExp) {
        const match = m.content ? m.content.match(prefix) : null;
        if (match) selectedPrefix = match[0];
    }

    if (!selectedPrefix) return;

    let args = m.content ? m.content.slice(selectedPrefix.length).trim().split(/\s+/) : [];
    let commandName = args.shift();
    if (commandName) commandName = commandName.toLowerCase();

    if (!commandName) return;

    const matchedCommands = commandsList.filter((c) => 
        c.name.toLowerCase() === commandName ||
        (Array.isArray(c.aliases) ? c.aliases.includes(commandName) : c.aliases === commandName)
    );

    if (!matchedCommands.length) return;

    let ctx = new Ctx({ used: { prefix: selectedPrefix, command: commandName }, args, self, client: self.core });

    const pass = await runMiddlewares(ctx);
    if (!pass) return;

    matchedCommands.forEach((cmd) => cmd.code(ctx));
};