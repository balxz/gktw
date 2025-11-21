import { Client, Events, CommandHandler } from "@balxz/gaktw"
import fs from "node:fs"
import path from "node:path"

const bot = new Client({
    prefix: /^[°•π÷×¶∆£¢€¥®™✓=|~zZ+×_*!#%^&./\\©^]/,
    printQRInTerminal: false,
    readIncommingMsg: true,
    usePairingCode: true,
    selfReply: true,
    phoneNumber: "6283898161609",
})

bot.ev.once(Events.ClientReady, (m) => {
    console.log(`ready at ${m.user.id}`)
})

bot.use(async (ctx, next) => {
  bot.consolefy?.setTag("from middleware")
  bot.consolefy?.info(`received: ${ctx.used.prefix} — message: ${ctx.msg.content}`)
  bot.consolefy?.resetTag()
  await next()
})

let cmd = new CommandHandler(bot, path.resolve("example") + "/test")
cmd.load(true)
bot.launch()