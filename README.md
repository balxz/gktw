# @balxz/gktw

Buat bot WhatsApp yang powerful dengan mudah.

- **✨ Mudah Digunakan**
- **🧱 Builder**
- **🛒 Collector, Cooldown, Command Handler Bawaan**
- **🚀 Sistem Middleware**
- **💽 Custom Auth Adapter**
- **🎉 Dan masih banyak lagi!**

## Daftar Isi
- [Instalasi](#instalasi)
- [Contoh Penggunaan](#contoh-penggunaan)
   * [Menggunakan Events](#menggunakan-events)
- [Konfigurasi Client](#konfigurasi-client)
- [Opsi Command](#opsi-command)
- [Command Handler](#command-handler)
   * [Setup File Utama](#setup-file-utama)
   * [Struktur File Command](#struktur-file-command)
- [Middleware](#middleware)
   * [Catatan Penting](#catatan-penting)
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
- [Mengunduh Media](#mengunduh-media)
   * [Mengakses Buffer atau Stream Media](#mengakses-buffer-atau-stream-media)
- [Events](#events)
   * [Event yang Tersedia](#event-yang-tersedia)
- [Mengirim Pesan](#mengirim-pesan)
- [Formatter](#formatter)
- [Mengedit Pesan](#mengedit-pesan)
- [Menghapus Pesan](#menghapus-pesan)
- [Pesan Poll](#pesan-poll)
- [Mentions](#mentions)
   * [Mendapatkan Mentions](#mendapatkan-mentions)
   * [Auto Mention](#auto-mention)
- [Custom Auth Adapter](#custom-auth-adapter)
- [Fitur Grup](#fitur-grup)
- [Lain-lain](#lain-lain)

## Instalasi

```bash
npm install balxz/gktw
# atau
yarn add balxz/gktw
# atau
pnpm add balxz/gktw
```

## Contoh Penggunaan

```javascript
const { Client, Events, MessageType } = require("@balxz/gktw");

const bot = new Client({
    prefix: "!",
    printQRInTerminal: true,
    readIncommingMsg: true
});

bot.ev.once(Events.ClientReady, (m) => {
    console.log(`siap di ${m.user.id}`);
});

bot.command('ping', async(ctx) => ctx.reply({ text: 'pong!' }));
bot.command('hi', async(ctx) => ctx.reply('halo! kamu bisa menggunakan string sebagai parameter pertama di fungsi reply juga!'));

bot.hears('test', async(ctx) => ctx.reply('test 1 2 3 beep boop...'));
bot.hears(MessageType.stickerMessage, async(ctx) => ctx.reply('wow, stiker keren'));
bot.hears(['help', 'menu'], async(ctx) => ctx.reply('hears bisa menggunakan array juga!'));
bot.hears(/(menggunakan\s?)?regex/, async(ctx) => ctx.reply('atau menggunakan regex!'));

bot.launch();
```

### Menggunakan Events

```javascript
const { Client, Events } = require("@balxz/gktw");

const bot = new Client({
    prefix: "!", // kamu juga bisa menggunakan array atau regex,
    printQRInTerminal: true,
    readIncommingMsg: true
});

bot.ev.once(Events.ClientReady, (m) => {
    console.log(`siap di ${m.user.id}`);
});

bot.ev.on(Events.MessagesUpsert, (m, ctx) => {
    if(m.key.fromMe) return;
    if(m.content === "halo") {
        ctx.reply("hai 👋");
    }
})

bot.launch();
```

## Konfigurasi Client

```javascript
// Contoh konfigurasi ClientOptions
const bot = new Client({
    // Prefix bot (bisa string, array, atau regex)
    prefix: "!",
    
    // Apakah bot harus menandai pesan masuk sebagai sudah dibaca? - Default: false
    readIncommingMsg: true,
    
    // Path ke direktori auth/creds - Default: ./state
    authDir: "./state",
    
    // Cetak QR di terminal? - Default: false
    printQRInTerminal: true,
    
    // Waktu yang dibutuhkan untuk menghasilkan QR baru dalam ms - Default: 60000 ms (1 menit)
    qrTimeout: 60000,
    
    // Apakah client harus menandai sebagai online saat terhubung? - Default: true
    markOnlineOnConnect: true,
    
    // Nomor telepon bot dimulai dengan kode negara (misal 62xxx), Digunakan untuk tujuan pairing code.
    phoneNumber: "6281234567890",
    
    // Hubungkan bot menggunakan metode pairing code daripada metode QR. - Default: false
    usePairingCode: false,
    
    // Apakah bot harus membalas ketika nomor bot sendiri menggunakan command bot? - Default: false
    selfReply: false,
    
    // Opsional menentukan Versi WhatsApp Web kustom
    WAVersion: [2, 2323, 4],
    
    // Kamu dapat mention seseorang tanpa harus memasukkan setiap Whatsapp Jid ke dalam array mentions. - Default: false
    autoMention: false,
    
    // Kamu dapat menggunakan adapter kustom untuk menyimpan auth state sesi bot.
    authAdapter: null,
    
    // Konfigurasi browser untuk client WhatsApp Web. Default ke Chrome di Ubuntu.
    browser: ["Chrome", "Ubuntu", "20.0.04"]
});
```

## Opsi Command

Definisikan command dengan struktur berikut:

```javascript
// kamu bisa menggunakan fungsi command baru juga! 
bot.command('ping', async(ctx) => ctx.reply('pong!'))
```

```javascript
// atau kamu bisa menggunakan yang lama!
// Contoh CommandOptions:
// {
//     name: string,           // nama command
//     aliases: Array<string>, // alias command (opsional)
//     code: (ctx) => Promise  // kode command
// }

bot.command({
  name: 'ping',
  code: async(ctx) => ctx.reply('pong!')
});
```

## Command Handler

Dengan command handler kamu tidak perlu semua command berada di satu file.

### Setup File Utama
  ```javascript
  const { CommandHandler } = require("@balxz/gktw");
  const path = require("path");

  /* ... */
  const cmd = new CommandHandler(bot, path.resolve() + '/PathCommands');
  cmd.load();
  //cmd.load(false); // sembunyikan log console

  /* ...bot.launch() */
  ```

### Struktur File Command

```javascript
// contoh command
module.exports = {
    name: "ping",
    code: async (ctx) => {
        ctx.reply("pong!");
    },
};

// Contoh tipe Hears
module.exports = {
    name: "contoh hears",
    type: "hears",
    code: async (ctx) => {
        ctx.reply("Halo dunia!");
    },
};
```

Kamu bisa menambahkan properti `type` untuk mendefinisikan tipe handler... Untuk saat ini hanya ada tipe `command` dan `hears`.
  
## Middleware

Middleware memungkinkan kamu untuk mencegat dan memproses pesan sebelum mencapai pemrosesan lebih lanjut. Kontrol alur pesan menggunakan `next()` untuk melanjutkan pemrosesan atau return untuk menghentikan. Middleware hanya berjalan sebelum menjalankan command yang ada. Tidak semua pesan masuk ke middleware.

```javascript
bot.use(async (ctx, next) => {
  // Logika pra-proses di sini
  console.log(`diterima: ${JSON.stringify(ctx.used)}`);

  await next();
});
```

### Catatan Penting

-  **Urutan Eksekusi**: Middleware berjalan berurutan berdasarkan urutan pendaftaran.
    ```javascript
    bot.use(middleware1); // Dijalankan pertama
    bot.use(middleware2); // Dijalankan kedua
    ```
-  **Kontrol Alur**: Abaikan `next()` untuk mencegah eksekusi command.
    ```javascript
    bot.use(async (ctx, next) => {
      if(kondisi) return; // Blokir
      await next();
    });
    ```


## Command Cooldown

Cooldown dapat memberikan delay pada command. Ini dapat dilakukan untuk mencegah pengguna melakukan spam command bot kamu.

```javascript
const { Cooldown } = require("@balxz/gktw"); // import class Cooldown

bot.command('ping', async(ctx) => {
    const cd = new Cooldown(ctx, 8000); // tambahkan ini. Waktu cooldown harus dalam milidetik.
    if(cd.onCooldown) return ctx.reply(`Pelan-pelan! tunggu ${cd.timeleft}ms`); // jika user memiliki cooldown hentikan kode dengan return sesuatu.

    ctx.reply('pong!')
})
```

Jika kamu ingin memicu fungsi tertentu ketika cooldown berakhir, kamu dapat menggunakan event `end` di cooldown:

```javascript
// ⚠ Akan selalu dipicu ketika cooldown berakhir (meskipun pengguna hanya menjalankan command sekali)
cd.on("end", () => {
  ctx.reply({ text: "cooldown timeout" });
})
```

```javascript
// Props Cooldown

// cek apakah pengirim sedang cooldown
cd.onCooldown; // boolean

// cek sisa waktu cooldown (dalam ms)
cd.timeleft; // number
```

## Builder

> **⚠ Peringatan:** Beberapa builder seperti Button, Sections, atau Carousel mungkin tidak berfungsi seperti yang diharapkan karena kebijakan dan pembatasan WhatsApp. Pastikan penggunaan kamu mematuhi ketentuan layanan WhatsApp.

### Button
  Buat pesan button dengan Button Builder. 

  ```javascript
  // ButtonType: 'cta_url' | 'cta_call' | 'cta_copy' | 'cta_reminder' | 'cta_cancel_reminder' | 'address_message' | 'send_location' | 'quick_reply'
  ```

  ```javascript
  const { ButtonBuilder } = require("@balxz/gktw");

  let button = new ButtonBuilder()
      .setId('!ping')
      .setDisplayText('command Ping')
      .setType('quick_reply')
      .build();

  let button2 = new ButtonBuilder()
      .setId('id2')
      .setDisplayText('salin kode')
      .setType('cta_copy')
      .setCopyCode('halo dunia')
      .build();

  let button3 = new ButtonBuilder()
      .setId('id3')
      .setDisplayText('@balxz/gktw')
      .setType('cta_url')
      .setURL('https://github.com/balxz/gktw')
      .setMerchantURL('https://github.com/balxz')
      .build();

  // gunakan sendInteractiveMessage jika kamu tidak ingin quote pesan.
  ctx.replyInteractiveMessage({ 
    body: 'ini body', 
    footer: 'ini footer', 
    nativeFlowMessage: { buttons: [button, button2, button3] } 
  })
  ```

### Sections
  Pesan sections seperti list.

  ```javascript
  const { SectionsBuilder } = require("@balxz/gktw");

  let section1 = new SectionsBuilder()
    .setDisplayText("Klik saya")
    .addSection({
      title: 'Judul 1',
      rows: [
        { header: "Header Baris 1", title: "Judul Baris 1", description: "Deskripsi Baris 1", id: "Id Baris 1" },
        { header: "Header Baris 2", title: "Judul Baris 2", description: "Deskripsi Baris 2", id: "Id Baris 2" }
      ]
    })
    .addSection({
      title: 'Ini judul 2',
      rows: [
        { title: "Ping", id: "!ping" },
        { title: "Halo dunia", id: "halo dunia" },
      ]
    })
    .build();


  ctx.sendInteractiveMessage(ctx.id, { 
    body: 'ini body', 
    footer: 'ini footer', 
    nativeFlowMessage: { buttons: [section1] }  // berikan ke properti buttons
  })
  ```

### Carousel
  Pesan carousel adalah tipe pesan yang meluncur seperti carousel.

  ```javascript
  const { ButtonBuilder, CarouselBuilder } = require("@balxz/gktw");

  let button = new ButtonBuilder()
      .setId('!ping')
      .setDisplayText('command Ping')
      .setType('quick_reply')
      .build();

  let exampleMediaAttachment = await ctx.prepareWAMessageMedia({ image: { url:  "https://github.com/balxz.png" } }, { upload: ctx._client.waUploadToServer })
  let cards = new CarouselBuilder()
    .addCard({
      body: "BODY 1",
      footer: "FOOTER 1",
      header: {
        title: "JUDUL HEADER 1",
        // header kartu harus memiliki lampiran media
        hasMediaAttachment: true,
        ...exampleMediaAttachment
      },
      nativeFlowMessage: { buttons: [button] } // membutuhkan minimal 1 button
    })
    .addCard({
      body: "BODY 2",
      footer: "FOOTER 2",
      header: {
        title: "JUDUL HEADER 2",
        // header kartu harus memiliki lampiran media
        hasMediaAttachment: true,
        ...exampleMediaAttachment // kamu bisa menggunakan lampiran media lain
      },
      nativeFlowMessage: { buttons: [button] } // membutuhkan minimal 1 button
    })
    .build();


  ctx.replyInteractiveMessage({ 
      body: "ini body",
      footer: "ini footer",
      carouselMessage: {
          cards,
      },
  });
  ```

### Contact
  Kirim kontak.

  ```javascript
  const { VCardBuilder } = require("@balxz/gktw");

  const vcard = new VCardBuilder()
      .setFullName("John Doe") // nama lengkap
      .setOrg("PT Mencari Cinta Sejati") // nama organisasi
      .setNumber("621234567890") // nomor telepon
      .build(); // fungsi build diperlukan di akhir

  ctx.reply({ contacts: { displayName: "John D", contacts: [{ vcard }] }});
  ```

### Template Buttons
  Kirim button dengan "lampiran".

  ```javascript
  const { TemplateButtonsBuilder } = require("@balxz/gktw");

  const templateButtons = new TemplateButtonsBuilder()
        .addURL({ displayText: 'gktw di Github', url: 'https://github.com/balxz/gktw' })
        .addCall({ displayText: 'hubungi saya', phoneNumber: '+1234567890' })
        .addQuickReply({ displayText: 'hanya button normal', id: 'btn1' })
        .build(); // fungsi build diperlukan di akhir

    ctx.sendMessage(ctx.id, { text: "template buttons", templateButtons });
  ```

## Collector

Kamu dapat mengkonfigurasi collector menggunakan opsi berikut:
```javascript
// Interface CollectorArgs:
// {
//     time: number,              // timeout collector dalam milidetik
//     max: number,               // berapa banyak pesan yang telah melewati filter
//     endReason: string[],       // akan berhenti jika alasan end cocok dengan alasan col.stop kamu
//     maxProcessed: number,      // batasi berapa banyak pesan yang harus diproses
//     filter: () => boolean      // fungsi sebagai filter untuk pesan masuk
// }
```

### Message Collector
  ```javascript
  let col = ctx.MessageCollector({ time: 10000 }); // dalam milidetik
  ctx.reply({ text: "katakan sesuatu... Timeout: 10s" });

  col.on("collect", (m) => {
      console.log("DIKUMPULKAN", m); // m adalah Collections
      ctx.sendMessage(ctx.id, {
          text: `Dikumpulkan: ${m.content}\nDari: ${m.sender}`,
      });
  });

  col.on("end", (collector, r) => {
      console.log("berakhir", r); // r = alasan
      ctx.sendMessage(ctx.id, { text: `Collector berakhir` });
  });
  ```

### Awaited Messages
  ```javascript
  ctx.awaitMessages({ time: 10000 }).then((m) => ctx.reply(`dapat ${m.length} panjang array`)).catch(() => ctx.reply('selesai'))
  ```

## Mengunduh Media

Contoh di bawah mendemonstrasikan menyimpan gambar yang diterima ke `./saved.jpeg`.

```javascript
const { MessageType } = require("@balxz/gktw");
const fs = require("fs");

bot.ev.on(Events.MessagesUpsert, async(m, ctx) => {
    if(ctx.getMessageType() === MessageType.imageMessage) {
        const buffer = await ctx.msg.media.toBuffer();
        fs.writeFileSync('./saved.jpeg', buffer);
    }
});
```

### Mengakses Buffer atau Stream Media

```javascript
// Dapatkan media pesan saat ini
ctx.msg.media.toBuffer();
ctx.msg.media.toStream();

// Dapatkan media pesan yang dikutip
ctx.quoted.media.toBuffer();
ctx.quoted.media.toStream();
```

## Events

Untuk menggunakan event, import konstanta `Events`:

```javascript
const { Events } = require("@balxz/gktw");
```

### Event yang Tersedia
- **ClientReady** - Dipicu ketika bot siap.
- **MessagesUpsert** - Dipicu ketika pesan diterima.
- **QR** - Kode QR siap untuk dipindai.
- **GroupsJoin** - Dipicu ketika bot bergabung dengan grup.
- **UserJoin** - Dipicu ketika seseorang bergabung dengan grup tempat bot berada.
- **UserLeave** - Dipicu ketika seseorang keluar dari grup.
- **Poll** - Dipicu ketika pesan poll dibuat.
- **PollVote** - Dipicu ketika seseorang memilih dalam poll.
- **Reactions** - Dipicu ketika pesan menerima reaksi.
- **Call** - Dipicu ketika seseorang menelepon, atau panggilan diterima/ditolak.
- **ConnectionUpdate** - Dipicu ketika ada perubahan pada status koneksi bot.

## Mengirim Pesan

```javascript
// mengirim pesan
ctx.sendMessage(ctx.id, { text: "halo" });

// quote pesan
ctx.reply("halo");
ctx.reply({ text: "halo" });

// kirim gambar
ctx.sendMessage(ctx.id, { image: { url: 'https://example.com/image.jpeg' }, caption: "caption gambar" });
ctx.reply({ image: { url: 'https://example.com/image.jpeg' }, caption: "caption gambar" });

// kirim file audio
ctx.reply({ audio: { url: './audio.mp3' }, mimetype: 'audio/mp4', ptt: false }); // jika "ptt" true, audio akan dikirim sebagai voicenote

// kirim stiker
ctx.reply({ sticker: { url: './tmp/generatedsticker.webp' }});

// kirim video
const fs = require("fs");
ctx.reply({ video: fs.readFileSync("./video.mp4"), caption: "caption video", gifPlayback: false });
```

## Formatter
WhatsApp mendukung format dalam pesan, seperti teks tebal atau miring. Gunakan fungsi berikut untuk memformat string:

```javascript
const { bold, inlineCode, italic, monospace, quote, strikethrough } = require("@balxz/gktw");

const str = "Halo Dunia";

const boldString = bold(str);
const italicString = italic(str);
const strikethroughString = strikethrough(str);
const quoteString = quote(str);
const inlineCodeString = inlineCode(str);
const monospaceString = monospace(str);
```

Untuk detail lebih lanjut, kunjungi [FAQ WhatsApp tentang format](https://faq.whatsapp.com/539178204879377/?cms_platform=web).

## Mengedit Pesan
```javascript
let res = await ctx.reply("teks lama");
ctx.editMessage(res.key, "teks baru");
```

## Menghapus Pesan
```javascript
let res = await ctx.reply("testing");
ctx.deleteMessage(res.key);
```

## Pesan Poll
> `singleSelect` berarti kamu hanya dapat memilih satu dari beberapa opsi dalam poll. Default adalah false.

```javascript
ctx.sendPoll(ctx.id, { name: "ini polling", values: ["abc", "def"], singleSelect: true })
```

## Mentions

### Mendapatkan Mentions
Dapatkan array JID pengguna yang disebutkan. Misalnya, pesan berisi `halo @jstn @person` di mana `@jstn` & `@person` adalah mention, maka kamu bisa mendapatkan array yang berisi jid dari dua pengguna yang disebutkan.

```javascript
ctx.getMentioned() // Mengembalikan array JID
```

### Auto Mention
Kamu dapat mention seseorang **tanpa** harus memasukkan setiap Whatsapp Jid ke dalam array `mentions`.

- Pertama, kamu perlu mengaktifkan opsi `autoMention` di client kamu.
  ```javascript
  const bot = new Client({
    // ...
    autoMention: true // aktifkan ini
  });
  ```
- Kamu dapat langsung mengetik `@` diikuti dengan nomor pengguna yang akan disebutkan. Contohnya seperti ini:
  ```javascript
  ctx.reply("Halo @62812345678");
  ```

Jika kamu masih bingung tentang ini, mungkin kamu bisa memeriksa perbandingan kode untuk mention seseorang di bawah:

```javascript
// autoMention: true
ctx.reply("Halo @62812345678");

// autoMention: false, kamu harus secara manual menentukan mentions
ctx.reply({ text: "Halo @62812345678", mentions: ['62812345678@s.whatsapp.net'] });
```

## Custom Auth Adapter

Kamu dapat menggunakan berbagai adapter, tetapi berikut adalah contoh menggunakan adapter mysql dari library [mysql-baileys](https://www.npmjs.com/package/mysql-baileys). Ini opsional, pada dasarnya auth session akan disimpan secara lokal menggunakan adapter `useMultiFileAuthState` bawaan dari `@whiskeysockets/baileys`.

```javascript
// ...
const { useMySQLAuthState } = require('mysql-baileys'); // Untuk contoh lebih lanjut menggunakan mysql-baileys, kunjungi npmjs.com/mysql-baileys.

const bot = new Client({
    prefix: "!",
    readIncommingMsg: true,
    // langsung ditugaskan ke authAdapter.
    authAdapter: useMySQLAuthState({
      session: "session", 
      password: '',
      database: 'baileys',
    })
});

// ...
```
  
## Fitur Grup
```javascript
ctx.groups.create(subject, members); // subject: string, members: string[]
ctx.groups.inviteCodeInfo(code); // code: string
ctx.groups.acceptInvite(code); // code: string
ctx.groups.acceptInviteV4(key, inviteMessage); // key: string | proto.IMessageKey, inviteMessage: proto.Message.IGroupInviteMessage
```
```javascript
ctx.group(jid); // jid opsional

ctx.group().members();
ctx.group().inviteCode();
ctx.group().revokeInviteCode();
ctx.group().joinApproval(mode); // mode: "on" | "off"
ctx.group().leave();
ctx.group().membersCanAddMemberMode(mode); // mode: "on" | "off"
ctx.group().metadata();
ctx.group().getMetadata(key); // key: keyof GroupMetadata
ctx.group().name();
ctx.group().description();
ctx.group().owner();
ctx.group().isAdmin(jid); // jid: string
ctx.group().isSenderAdmin();
ctx.group().isBotAdmin();
ctx.group().toggleEphemeral(expiration); // expiration: number
ctx.group().updateDescription(description); // description: number
ctx.group().updateSubject(subject); // subject: number
ctx.group().membersUpdate(members, action); // members: string[], action: ParticipantAction
ctx.group().kick(members); // members: string[]
ctx.group().add(members); // members: string[]
ctx.group().promote(members); // members: string[]
ctx.group().demote(members); // members: string[]
ctx.group().pendingMembers();
ctx.group().pendingMembersUpdate(members, action); // members: string[], action: 'reject' | 'approve'
ctx.group().approvePendingMembers(members); // members: string[]
ctx.group().rejectPendingMembers(members); // members: string[]
ctx.group().updateSetting(setting); // setting: 'announcement' | 'not_announcement' | 'locked' | 'unlocked'
ctx.group().open()
ctx.group().close()
ctx.group().lock()
ctx.group().unlock()
```

## Lain-lain

```javascript
// membalas pesan
ctx.reply({ text: "test" });
ctx.reply("kamu bisa menggunakan string sebagai parameter pertama juga!");

// menggunakan interactive message
ctx.sendInteractiveMessage(jid, content, options); // jid: string, content: IInteractiveMessageContent, options: MessageGenerationOptionsFromContent | {} = {}
ctx.replyInteractiveMessage(content, options); // content: IInteractiveMessageContent, options: MessageGenerationOptionsFromContent | {} = {}

// sama dengan bot.command tapi tanpa prefix
bot.hears('test', async(ctx) => ctx.reply('test 1 2 3 beep boop...'));

// akan dipicu ketika seseorang mengirim pesan stiker
const { MessageType } = require("@balxz/gktw");
bot.hears(MessageType.stickerMessage, async(ctx) => ctx.reply('wow, stiker keren'));

// tambahkan react
ctx.react(jid, emoji, key); // jid: string, emoji: string, key?: WAProto.IMessageKey
ctx.react(ctx.id, "👀");

// dapatkan timestamp bot siap
bot.readyAt;

// dapatkan jid saat ini
ctx.id // string
ctx.decodedId // string 

// dapatkan array argumen yang digunakan
ctx.args // Array<string>

// dapatkan detail pengirim
ctx.sender

// dapatkan quoted
ctx.quoted

// dapatkan bot user
ctx.me

// dapatkan tipe pesan
ctx.getMessageType()

// dapatkan tipe konten
ctx.getContentType(content) // content: WAProto.IMessage | undefined

// unduh konten dari pesan
ctx.downloadContentFromMessage(downloadable, type, opts) // downloadable: DownloadableMessage, type: MediaType, opts?: MediaDownloadOptions

// baca pesan
ctx.read()

// simulasikan status mengetik atau merekam
ctx.simulateTyping()
ctx.simulateRecording()

// ubah about/bio client
bot.bio("Hai!");

// ambil about/bio seseorang
await bot.fetchBio("1234@s.whatsapp.net");

// blokir dan buka blokir
await bot.block("1234@s.whatsapp.net");
await bot.unblock("1234@s.whatsapp.net");

// dapatkan device
ctx.getDevice(id) 
ctx.getDevice() // dapatkan device pengguna

// cek apakah chat adalah grup
ctx.isGroup()

// mengakses objek @whiskeysockets/baileys
bot.core
ctx.core
```