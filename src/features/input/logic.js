/* ==================================================
variables

================================================== */
const enclosure = '"'
const delimiters = [
    ',',
    ';',
    '\t',
    '\\|',
]

/* ==================================================
functions

================================================== */

/* ``````````````````````````````
lineBreakDecision

文字列を受け取って改行を判定する
`````````````````````````````` */
function lineBreakDecision(str) {
    const counts = {
        '\n': (str.match(/(?<!\r)\n/g) ?? []).length,
        '\r\n': (str.match(/\r\n/g) ?? []).length,
    };

    return Object.keys(counts).reduce((a, b) => counts[a] > counts[b] ? a : b);
}

/* ``````````````````````````````
delimiterDecision

文字列を受け取って区切り文字を判定する
`````````````````````````````` */
function delimiterDecision(str) {
    const counts = [];
    delimiters.forEach(delimiter => {
        counts.push((str?.match(new RegExp(delimiter, 'g')) ?? []).length);
    });

    const maxIdx = counts.reduce((maxIdx, currentVal, currentIdx, arr) => {
        return currentVal > arr[maxIdx] ? currentIdx : maxIdx;
    }, 0);

    return delimiters[maxIdx];
}

/* ``````````````````````````````
parseInput

CSV形式、EXCEL形式の文字列を配列に変換する
`````````````````````````````` */
function parseInput(inData) {
    // 改行文字のエスケープ対策
    const data = normalizeLineBreak(inData)

    // 改行文字判定後、1次元配列作成 (EOFに改行があった場合は除去する)
    const lineBreakPtn = lineBreakDecision(data) === '\n' ? '\n' : '\r\n';
    const rows = data.split(lineBreakPtn).filter(el => Boolean(el));

    // 区切り文字判定後、2次元配列を作成し返却
    const delimiter = delimiterDecision(rows[0]);
    const pattern = new RegExp(`${delimiter}(?=(?:[^"]*"[^"]*")*[^"]*$)`, 'g');
    return rows.map(row => row.split(pattern));
}

/* ``````````````````````````````
normalizeLineBreak

入力イベント時に発生する改行エスケープを考慮して
`````````````````````````````` */
function normalizeLineBreak(inData) {
    const [CRLF, LF] = [
        [/\\r\\n/g, '\r\n'],
        [/\\n/g, '\n']
    ]
    return inData.replace(CRLF[0], CRLF[1]).replace(LF[0], LF[1])
}

/* ``````````````````````````````
formatData

入力データを整形する
parseInputを呼び出して文字列 =>> 配列へ変換
変換後、囲い文字を除去
`````````````````````````````` */
function formatData(inData) {
    // 2次元配列内の囲い文字を除去して返却
    const enclosurePtn = new RegExp(`(^[${enclosure}])|([${enclosure}]$)`, 'g');
    const rows = parseInput(inData);
    return rows.map(row => {
        return row.map(cell => {
            return cell.replace(enclosurePtn, '');
        });
    });
}

export { formatData }