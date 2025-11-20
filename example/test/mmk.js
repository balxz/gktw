export default {
    name: "mmk",
    description: "memek",
    category: "general",
    code: async(ctx) => {
        ctx.reply({ text: `${Date.now() - (ctx.msg.messageTimestamp * 1000)}ms` })
    }
}