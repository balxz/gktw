//import { Consolefy } from "@mengkodingan/consolefy";
import pkg from "@mengkodingan/consolefy";
const { Consolefy } = pkg;
import { walk } from "../Common/Functions.js";

export class CommandHandler {
    constructor(bot, path) {
        this._bot = bot;
        this._path = path;

        this.consolefy = new Consolefy({ tag: 'command-handler' });
    }

    async load(isShowLog = true) {
        if (isShowLog) this.consolefy?.group("Command Handler Load");

        walk(this._path, async (x) => {
            let cmdObj = (await import(x)).default ?? (await import(x));

            if(!cmdObj.type || cmdObj.type === 'command') {
                this._bot.cmd.set(cmdObj.name, cmdObj);
                if (isShowLog) this.consolefy?.success(`Loaded Command - ${cmdObj.name}`);
            } else if(cmdObj.type === 'hears') {
                this._bot.hearsMap.set(cmdObj.name, cmdObj);
                if (isShowLog) this.consolefy?.success(`Loaded Hears - ${cmdObj.name}`);
            }
        });

        if (isShowLog) this.consolefy?.groupEnd();
    }
}