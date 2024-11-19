// deno-lint-ignore no-explicit-any
declare const CSS: { highlights: any }

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
    CSS.highlights.set("hi1", highlight)
}

parse()

$p.addEventListener("input", parse)

let prevRange: Range | null = null

$p.addEventListener("input", _e => {
    const currRange = getSelection()!.getRangeAt(0)
    if (prevRange?.startContainer == currRange.startContainer) {
        const node = currRange.startContainer
        const range = new Range()
        range.setStart(node, prevRange.startOffset)
        range.setEnd(node, currRange.endOffset)

        if (CSS.highlights.has("hi2")) {
            const highlight = CSS.highlights.get("hi2")
            highlight.add(range)
        } else {
            const highlight = new Highlight(range)
            CSS.highlights.set("hi2", highlight)
        }
    }
})
document.addEventListener("selectionchange", _e => {
    prevRange = getSelection()!.getRangeAt(0)
})

document.styleSheets[0].insertRule(`
    ::highlight(hi1) {
        color: #a55;
    }
`)
document.styleSheets[0].insertRule(`
    ::highlight(hi2) {
        background: #dfd;
    }
`)