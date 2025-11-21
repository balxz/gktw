export default {
    name: "eval",
    category: "owner",
    code: async ctx => {
        let util = await import("util")
        let input = ctx.args.join(" ").replace(/```(?:[^\s]+\n)?(.*?)\n?```/gm, (_, a) => a)
        if (!input) {
            return ctx.reply({ text: "No code provided, use codeblock instead" })
        }

        try {
            let asyncFlag = /--async$/.test(input)
            let body = asyncFlag ? input.replace(/--async$/, "") : input
            let wrapped = asyncFlag
                ? `(async () => { ${body} })()`
                : body

            let output = await eval(wrapped)

            let text = util.inspect(output, {
                depth: 5,
                compact: false
            })

            return ctx.sendMessage(ctx.id, { text })
        } catch (e) {
            return ctx.sendMessage(ctx.id, { text: String(e) })
        }
    }
}