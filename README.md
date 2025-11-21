<div align="center">
  <img alt="@balxz/gaktw - Simplified WhatsApp Node.js API" src="https://socialify.git.ci/balxz/gaktw/image?description=1&descriptionEditable=@balxz/gaktw%20is%20a%20simplified%20version%20of%20the%20Baileys%20package%20%0Awhich%20is%20easier%20and%20faster.&font=KoHo&forks=1&issues=1&language=1&name=1&owner=1&pattern=Circuit%20Board&pulls=1&stargazers=1&theme=Auto">

  <h1 align="center">@balxz/gaktw - Simplified WhatsApp Node.js API</h1>

</div>

**@balxz/gaktw** is a lightweight, user-friendly wrapper around the [Baileys](https://github.com/WhiskeySockets/Baileys) library, designed to simplify building WhatsApp bots and integrations with TypeScript or ESM JavaScript. It offers a streamlined API, robust multi-device support, and seamless database integration for session management.

> [!TIP]
> Stay updated and get support by joining our [WhatsApp Channel](https://whatsapp.com/channel/0029VbBQG1n3QxRsqN7XkS06).

> [!IMPORTANT]
> There is no assurance that you won’t get blocked when using this approach. WhatsApp does not permit bots or unofficial clients, so use it at your own risk.


### 🛞 Table Of Contents
- [Installation](#installation)
- [Example Usage](#example-usage)
   * [Using Events](#using-events)
- [Client Configuration](#client-configuration)
- [Command Options](#command-options)
- [Command Handler](#command-handler)
   * [Main File Setup](#main-file-setup)
   * [Command File Structure](#command-file-structure)
- [Middleware](#middleware)
   * [Key Notes](#key-notes)
- [Command Cooldown](#command-cooldown)
- [Builder](#builder)
   * [Button](#button)
   * [Sections](#sections)
   * [Carousel](#carousel)
   * [Contact](#contact)
   * [Template Buttons](#template-buttons)
- [Collector](#collector)
   * [Message Collector](#message-collector)
   * [Awaited Messages](#awaited-messages)
- [Downloading Media](#downloading-media)
   * [Accessing Media Buffers or Streams](#accessing-media-buffers-or-streams)
- [Events](#events)
   * [Available Events](#available-events)
- [Sending Message](#sending-message)
- [Formatter](#formatter)
- [Editing Message](#editing-message)
- [Deleting Message](#deleting-message)
- [Poll Message](#poll-message)
- [Mentions](#mentions)
   * [Get Mentions](#get-mentions)
   * [Auto Mention](#auto-mention)
- [Custom Auth Adapter](#custom-auth-adapter)
- [Group Stuff](#group-stuff)
- [Miscellaneous](#miscellaneous)

#### *installation*
```bash
npm install balxz/gaktw
```
```bash
yarn add balxz/gaktw
```
```bash
pnpm add balxz/gaktw
```

#### *example usage*
```ts
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

let cmd = new CommandHandler(bot, path.resolve("example") + "/plug")
cmd.load(true)
bot.launch()
```

#### *in plugins*

```ts
export default {
    name: "ping",
    description: "",
    category: "general",
    code: async(ctx) => {
        ctx.reply({ text: `${Date.now() - (ctx.msg.messageTimestamp * 1000)}ms` })
    }
}
```

#### *client configuration*

```ts
export interface ClientOptions {
    /* The bot prefix */
    prefix: Array<string> | string | RegExp;
    /* Should bot mark as read the incomming messages? - Default: false */
    readIncommingMsg?: boolean;
    /* Path to the auth/creds directory - Default: ./state */
    authDir?: string;
    /* Print the qr in terminal? - Default: false */
    printQRInTerminal?: boolean;
    /* Time taken to generate new qr in ms - Default: 60000 ms (1 minute) */
    qrTimeout?: number;
    /* Should the client mark as online on connect? - Default: true */
    markOnlineOnConnect?: boolean;
    /* The bot phone number starts with country code (e.g 62xxx), Used for pairing code purposes. */
    phoneNumber?: string;
    /* Connect the bot using pairing code method instead of qr method. - Default: false */
    usePairingCode?: boolean;
    /* Should a bot reply when the bot number itself uses its bot command? - Default: false */
    selfReply?: boolean;
    /* Optional specify a custom Whatsapp Web Version */
    WAVersion?: [number, number, number];
    /* You can mention someone without having to enter each Whatsapp Jid into the `mentions` array. - Default: false */
    autoMention?: boolean;
    /* You can use custom adapters to store your bot's session auth state. The default will be stored locally with baileys default multi auth state. */
    authAdapter?: Promise<any>;
    /* Browser configuration for the WhatsApp Web client. Default to be Chrome in Ubuntu. You should only set a valid/logical browser config, otherwise the pair will fail. */
    browser?: WABrowserDescription;
}
```

#### *command options*

_define commands with the following structure:_

```ts
bot.command(opts: CommandOptions | string, code?: (ctx: Ctx) => Promise<any>)
```

```ts
// you can use the new command function code too
bot.command("ping", async(ctx) => ctx.reply("pong"))
```

```ts
// alternatively you can use the old one
export interface CommandOptions {
    /* command name */
    name: string;
    /* command aliases */
    aliases?: Array<string>;
    /* command code */
    code: (ctx: Ctx) => Promise<any>;
}

// example
bot.command({
  name: "ping",
  code: async(ctx) => ctx.reply("pong")
})
```

#### *command handler*

_With command handler you dont need all your command is located in one file._

### main file setup
  ```ts
  import { CommandHandler } from "balxz/gaktw"
  import path from "path"

  /* ... */
  let cmd = new CommandHandler(bot, path.resolve() + "/CommandsPath")
  cmd.load()
  //cmd.load(false) // hide log console

  /* ...bot.launch() */
  ```

#### command file structure

```ts
// command example
module.exports = {
    name: "ping",
    code: async (ctx) => {
        ctx.reply("pong")
    },
}

// Hears type example
module.exports = {
    name: "hears example",
    type: "hears",
    code: async (ctx) => {
        ctx.reply("Hello world")
    },
}
```

_You can add a `type` property to define the handler type... For now there are only `command` and `hears` types._
  
## middleware

Middleware allows you to intercept and process messages before they reach further processing. Control message flow using `next()` to continue processing or return to terminate. Middleware is only run before executing an existing command. Not all messages go to the middleware.

```ts
bot.use(async (ctx, next) => {
  // pre-process logic here
  console.log(`received: ${JSON.stringify(ctx.used)}`)

  await next()
})
```

### key Notes

-  **Execution Order**: Middlewares run sequentially based on registration order.
    ```ts
    bot.use(middleware1) // First run
    bot.use(middleware2) // Second run
    ```
-  **Flow Control**: Omit `next()` to prevent command execution.
    ```ts
    bot.use(async (ctx, next) => {
      if(condition) return // Block
      await next()
    })
    ```


## Command Cooldown

Cooldown can give a delay on the command. This can be done to prevent users from spamming your bot commands.

```js
import { Cooldown } from "balxz/gaktw" // import the Cooldown class

bot.command("ping", async(ctx) => {
    const cd = new Cooldown(ctx, 8000) // add this. Cooldown time must be in milliseconds.
    if(cd.onCooldown) return ctx.reply(`Slow down! wait ${cd.timeleft}ms`) // if user has cooldown stop the code by return something.

    ctx.reply("pong")
})
```

If you want to trigger some function when the cooldown end, you can use the `end` events in the cooldown:


```ts
// ⚠ Will always be triggered when the cooldown is over (even though the users only runs the command once)
cd.on("end", () => {
  ctx.reply({ text: "cd timeout" })
})
```

```ts
// coldown props

/* check if sender is on cooldown */
cd.onCooldown; // boolean

/* check the cooldown time left (in ms) */
cd.timeleft; // number
```

#### contact
  Send a contact.

  ```ts
  import { VCardBuilder } from "balxz/gaktw"

  const vcard = new VCardBuilder()
      .setFullName("John Doe") // full name
      .setOrg("PT Mencari Cinta Sejati") // organization name
      .setNumber("621234567890") // phone number
      .build(); // required build function at end

  ctx.reply({ contacts: { displayName: "John D", contacts: [{ vcard }] }})
  ```

## Collector

You can configure the collector using the following options:
```ts
export interface CollectorArgs {
    /* collector timeout in milliseconds */
    time?: number;
    /* how many messages have passed through the filter */
    max?: number;
    /* will be stop if end reason is match with your col.stop reason  */
    endReason?: string[];
    /* limit how many messages must be processed. */
    maxProcessed?: number;
    /* a function as a filter for incoming messages. */
    filter?: () => boolean;
}
```

#### message collector
  ```ts
  let col = ctx.MessageCollector({ time: 10000 }); // in milliseconds
  ctx.reply({ text: "say something... Timeout: 10s" });

  col.on("collect", (m) => {
      console.log("COLLECTED", m); // m is an Collections
      ctx.sendMessage(ctx.id, {
          text: `Collected: ${m.content}\nFrom: ${m.sender}`,
      });
  });

  col.on("end", (collector, r) => {
      console.log("ended", r); // r = reason
      ctx.sendMessage(ctx.id, { text: `Collector ended` });
  });
  ```

#### awaited Messages
  ```ts
  ctx.awaitMessages({ time: 10000 }).then((m) => ctx.reply(`got ${m.length} array length`)).catch(() => ctx.reply('end'))
  ```

#### downloading media
The example below demonstrates saving a received image to `./saved.jpeg`.

```ts
import { MessageType } from "balxz/gaktw"
import fs from "node:fs"

bot.ev.on(Events.MessagesUpsert, async(m, ctx) => {
    if(ctx.getMessageType() === MessageType.imageMessage) {
        const buffer = await ctx.msg.media.toBuffer()
        fs.writeFileSync('./saved.jpeg', buffer)
    }
})
```

#### Accessing Media Buffers or Streams
```ts
// Get current message media
ctx.msg.media.toBuffer();
ctx.msg.media.toStream();

// Get quoted message media
ctx.quoted.media.toBuffer();
ctx.quoted.media.toStream();
```

#### events
To utilize events, import the `Events` constant:

```ts
import { Events } from "balxz/gaktw";
```

### Available Events
- **ClientReady** - Triggered when the bot is ready.
- **MessagesUpsert** - Fired when a message is received.
- **QR** - QR code is ready to scan.
- **GroupsJoin** - Triggered when the bot joins a group.
- **UserJoin** - Triggered when someone joins a group the bot is in.
- **UserLeave** - Triggered when someone leaves a group.
- **Poll** - Triggered when a poll message is created.
- **PollVote** - Triggered when someone votes in a poll.
- **Reactions** - Triggered when a message receives a reaction.
- **Call** - Triggered when someone calls, or a call is accepted/rejected.
- **ConnectionUpdate** - Triggered when there is a change in the bot's connection status.

## Sending Message

```ts
/* sending a message */
ctx.sendMessage(ctx.id, { text: "hello" });

/* quote the message */
ctx.reply("hello");
ctx.reply({ text: "hello" });

/* send an image */
ctx.sendMessage(ctx.id, { image: { url: 'https://example.com/image.jpeg' }, caption: "image caption" });
ctx.reply({ image: { url: 'https://example.com/image.jpeg' }, caption: "image caption" });

/* send an audio file */
ctx.reply({ audio: { url: './audio.mp3' }, mimetype: 'audio/mp4', ptt: false }); // if "ptt" is true, the audio will be send as voicenote

/* send an sticker */
ctx.reply({ sticker: { url: './tmp/generatedsticker.webp' }});

/* send an video */
import fs from "node:fs";
ctx.reply({ video: fs.readFileSync("./video.mp4"), caption: "video caption", gifPlayback: false });
```

## Formatter
WhatsApp supports formatting in messages, such as bold or italic text. Use the following functions to format strings:

```ts
import { bold, inlineCode, italic, monospace, quote, strikethrough } from "balxz/gaktw";

const str = "Hello World";

const boldString = bold(str);
const italicString = italic(str);
const strikethroughString = strikethrough(str);
const quoteString = quote(str);
const inlineCodeString = inlineCode(str);
const monospaceString = monospace(str);
```

For more details, visit the [WhatsApp FAQ on formatting]((https://faq.whatsapp.com/539178204879377/?cms_platform=web).).

## Editing Message
```ts
let res = await ctx.reply("old text");
ctx.editMessage(res.key, "new text");
```

## Deleting Message
```ts
let res = await ctx.reply("testing");
ctx.deleteMessage(res.key);
```

## Poll Message
> `singleSelect` means you can only select one of the multiple options in the poll. Default to be false.

```ts
ctx.sendPoll(ctx.id, { name: "ini polling", values: ["abc", "def"], singleSelect: true })
```

## Mentions

### Get Mentions
Retrieve an array of mentioned users' JIDs. For example, a message containing `hello @jstn @person` where `@jstn` & `@person` is a mention, then you can get an array containing the jid of the two mentioned users.

```ts
ctx.getMentioned() // Returns an array of JIDs
```

### Auto Mention
You can mention someone **without** having to enter each Whatsapp Jid into the `mentions` array.

- First, you need to enable the `autoMention` option in your client.
  ```ts
  const bot = new Client({
    // ...
    autoMention: true // enable this
  });
  ```
- You can directly type `@` followed by the user number to be mentioned. For example like this:
  ```ts
  ctx.reply("Hello @62812345678");
  ```

If you are still confused about what this is, perhaps you can check out the code comparison for mentioning someone below:

```ts
// autoMention: true
ctx.reply("Hello @62812345678");

// autoMention: false, you must manually specify the mentions
ctx.reply({ text: "Hello @62812345678", mentions: ['62812345678@s.whatsapp.net'] });
```

## Custom Auth Adapter

You can use a variety of adapters, but here is an example of using the mysql adapter from [mysql-baileys](https://www.npmjs.com/package/mysql-baileys) library. This is optional, basically the auth session will be stored locally using the built-in `useMultiFileAuthState` adapter from `@whiskeysockets/baileys`.

```ts
// ...
import { useMySQLAuthState } from 'mysql-baileys'; // For more examples of using mysql-baileys, go to npmjs.com/mysql-baileys.

const bot = new Client({
    prefix: "!",
    readIncommingMsg: true,
    // directly assigned to authAdapter.
    authAdapter: useMySQLAuthState({
      session: "session", 
      password: '',
      database: 'baileys',
    })
});

// ...
```
  
## Group Stuff
```ts
ctx.groups.create(subject: string, members: string[]);
ctx.groups.inviteCodeInfo(code: string);
ctx.groups.acceptInvite(code: string);
ctx.groups.acceptInviteV4(key: string | proto.IMessageKeinviteMessage: proto.Message.IGroupInviteMessage);
```
```ts
ctx.group(jid?: string); // jid is optional

ctx.group().members();
ctx.group().inviteCode();
ctx.group().revokeInviteCode();
ctx.group().joinApproval(mode: "on" | "off");
ctx.group().leave();
ctx.group().membersCanAddMemberMode(mode: "on" | "off");
ctx.group().metadata();
ctx.group().getMetadata(key: keyof GroupMetadata);
ctx.group().name();
ctx.group().description();
ctx.group().owner();
ctx.group().isAdmin(jid: string);
ctx.group().isSenderAdmin();
ctx.group().isBotAdmin();
ctx.group().toggleEphemeral(expiration: number);
ctx.group().updateDescription(description: number);
ctx.group().updateSubject(subject: number);
ctx.group().membersUpdate(members: string[], action: ParticipantAction);
ctx.group().kick(members: string[]);
ctx.group().add(members: string[]);
ctx.group().promote(members: string[]);
ctx.group().demote(members: string[]);
ctx.group().pendingMembers();
ctx.group().pendingMembersUpdate(members: string[], action: 'reject' | 'approve');
ctx.group().approvePendingMembers(members: string[]);
ctx.group().rejectPendingMembers(members: string[]);
ctx.group().updateSetting(setting: 'announcement' | 'not_announcement' | 'locked' | 'unlocked')
ctx.group().open()
ctx.group().close()
ctx.group().lock()
ctx.group().unlock()
```

## Miscellaneous

```ts
/* replying message */
ctx.reply({ text: "test" });
ctx.reply("you can use string as a first parameter too!");

/* using interactive message */
ctx.sendInteractiveMessage(jid: string, content: IInteractiveMessageContent, options: MessageGenerationOptionsFromContent | {} = {});
ctx.replyInteractiveMessage(content: IInteractiveMessageContent, options: MessageGenerationOptionsFromContent | {} = {});

/* same with bot.command but without prefix */
bot.hears('test', async(ctx) => ctx.reply('test 1 2 3 beep boop...'));

/* will be triggered when someone sends a sticker message */
import { MessageType } from "balxz/gaktw";
bot.hears(MessageType.stickerMessage, async(ctx) => ctx.reply('wow, cool sticker'));

/* add react */
ctx.react(jid: string, emoji: string, key?: WAProto.IMessageKey);
ctx.react(ctx.id, "👀");

/* get the bot ready at timestamp */
bot.readyAt;

/* get the current jid */
ctx.id // string
ctx.decodedId // string 

/* get the array of arguments used */
ctx.args // Array<string>

/* get sender details */
ctx.sender

/* get quoted */
ctx.quoted

/* get bot user */
ctx.me

/* get the message type */
ctx.getMessageType()

/* get content type */
ctx.getContentType(content: WAProto.IMessage | undefined)

/* download content from message */
ctx.downloadContentFromMessage(downloadable: DownloadableMessage, type: MediaType, opts?: MediaDownloadOptions)

/* read the message */
ctx.read()

/* simulate typing or recording state */
ctx.simulateTyping()
ctx.simulateRecording()

/* change the client about/bio */
bot.bio("Hi there!");

/* fetch someone about/bio */
await bot.fetchBio("1234@s.whatsapp.net");

/* block and unblock */
await bot.block("1234@s.whatsapp.net");
await bot.unblock("1234@s.whatsapp.net");

/* get device */
ctx.getDevice(id) 
ctx.getDevice() // get the user device

/* check whether the chat is a group */
ctx.isGroup()

/* accessing @whiskeysockets/baileys objects */
bot.core
ctx.core
```