const $p = document.querySelector("p")!

function* walk(walker: TreeWalker) {
    while (walker.nextNode()) {
        yield walker.currentNode
    }
}

const parse = () => {
    const walker = document.createTreeWalker(
        $p,
        NodeFilter.SHOW_TEXT,
    )

    const ranges = walk(walker).flatMap(el => el.textContent!
        .matchAll(/[AEIOUaeiou]+/g)
        .map(({ index, [0]: str }) => {
            const range = new Range()
            range.setStart(el, index)
            range.setEnd(el, index + str.length)
            return range
        })
    )

    const highlight = new Highlight(...ranges)
    // @ts-ignore undefined on lib
    CSS.highlights.set("hi1", highlight)
}

parse()

$p.addEventListener("input", parse)

document.styleSheets[0].insertRule(`
    ::highlight(hi1) {
        color: #a55;
    }
`)