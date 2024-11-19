const $p = document.querySelector("p")!

const parse = () => {
    const el = $p.firstChild!
    const ranges = el.textContent!.matchAll(/[aeiou]+/g)
        .map(({ index, [0]: str }) => {
            const range = new Range()
            range.setStart(el, index)
            range.setEnd(el, index + str.length)
            return range
        })
    const highlight = new Highlight(...ranges)
    // @ts-ignore undefined on lib
    CSS.highlights.set("hi1", highlight)
}

parse()

document.styleSheets[0].insertRule(`
    ::highlight(hi1) {
        color: #a55;
    }
`)