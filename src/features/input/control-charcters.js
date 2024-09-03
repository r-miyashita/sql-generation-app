const enclosure = '"'

const delimiters = [
    ',',
    ';',
    '\t',
    '\\|',
]

function lineBreakDecision(str) {
    const counts = {
        '\n': (str.match(/(?<!\r)\n/g) ?? []).length,
        '\r\n': (str.match(/\r\n/g) ?? []).length,
    };

    return Object.keys(counts).reduce((a, b) => counts[a] > counts[b] ? a : b);
}

function delimiterDecision(str) {
    const patterns = delimiters
    const counts = [];
    patterns.forEach(delimiter => {
        counts.push((str?.match(new RegExp(delimiter, 'g')) ?? []).length);
    });

    const maxIdx = counts.reduce((maxIdx, currentVal, currentIdx, arr) => {
        return currentVal > arr[maxIdx] ? currentIdx : maxIdx;
    }, 0);

    return patterns[maxIdx];
}

function parseInput(inData) {
    // 改行文字判定後、1次元配列作成 (EOFに改行があった場合は除去する)
    const lineBreakPtn = new RegExp(lineBreakDecision(inData))
    console.log(lineBreakPtn)
    console.log(inData)
    const rows = inData.split(lineBreakPtn).filter(el => Boolean(el));
    console.log(rows)

    // 区切り文字判定後、2次元配列を作成し返却
    const delimiter = delimiterDecision(rows[0]);
    const pattern = new RegExp(`${delimiter}(?=(?:[^"]*"[^"]*")*[^"]*$)`, 'g');
    return rows.map(row => row.split(pattern));
}

function formatData(inData) {
    // 2次元配列内の囲い文字を除去して返却
    const enclosurePtn = new RegExp(`(^[${enclosure}])|([${enclosure}]$)`, 'g');
    const rows = parseInput(inData);
    return rows.map(row => {
        return row.map(cell => {
            return cell.replaceAll(enclosurePtn, '');
        });
    });
}

export { formatData }