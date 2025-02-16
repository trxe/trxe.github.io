const set_caret = (pos: number, parent: ChildNode | null) => {
    if (parent == null || pos < 0) return pos;
    for (let i = 0; i < parent.childNodes.length; i++) {
        if (parent.childNodes[i].nodeType != Node.TEXT_NODE) {
            pos = set_caret(pos, parent.childNodes[i]);
            if (pos < 0) break;
        } else {
            let line = parent.childNodes[i].textContent;
            if (line == null) continue;
            if (line.length >= pos) {
                console.log(pos);
                parent.childNodes[i].textContent = line.substring(0, pos) + '  ' + line.substring(pos);
                const range = document.createRange();
                const sel = window.getSelection();
                range.setStart(parent.childNodes[i], pos + 2);
                range.collapse();
                sel?.removeAllRanges();
                sel?.addRange(range);
                return -1;
            } else {
                pos -= line.length;
            }
        }
    }
    return pos;
};

const scrape_text = (parent: ChildNode | null) => {
    let lines: string[] = [];
    if (parent == null) return lines;
    for (let i = 0; i < parent.childNodes.length; i++) {
        let textNode = parent.childNodes[i].childNodes[0].textContent;
        if (textNode == null) throw new Error("broken text in shader, editor bug?");
        lines.push(textNode);
    }
    return lines.join('\n');
}

const get_caret_pos = (el: HTMLElement | null) => {
    if (el == null) return -1;
    const range = window.getSelection()?.getRangeAt(0);
    if (range == null) return -1;
    const prefix = range.cloneRange();
    prefix.selectNodeContents(el);
    prefix.setEnd(range.endContainer, range.endOffset);
    return prefix.toString().length;
};

const tab_handler = (el: HTMLElement | null, replacer: Function) => {
    return (e: KeyboardEvent) => {
        console.log(e.key);
        if (e.key == 'Tab') {
            e.preventDefault();
            set_caret(get_caret_pos(el), el);
        } else if (e.key == 'Enter' && e.ctrlKey) {
            e.preventDefault();
            // console.log(scrape_text(el);
            replacer(scrape_text(el));
        }
    }
}

const format_line = (line: string) => {
    let linep = document.createTextNode(line);
    let temp = document.createElement('div');
    temp.appendChild(linep);
    return temp;
}

export const init_editor = (el: HTMLElement | null, text: string, replacer: Function) => {
    text = text.trimStart();
    if (el == null) return;
    el.innerHTML = '';
    let lines: HTMLElement[] = text.split('\n').map(format_line);
    for (let line of lines) {
        el.insertAdjacentElement('beforeend', line);
    }
    el.addEventListener('keydown', tab_handler(el, replacer));
}

export const get_text = (el: HTMLElement | null) => {
    if (el == null) return;
    return scrape_text(el);
}