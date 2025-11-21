export default {
    name: "mmk",
    category: "general",
    code: async(ctx) => {
        ctx.reply({ text: `${Date.now() - (ctx.msg.messageTimestamp * 1000)}ms` })
    }
}