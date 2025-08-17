import { ENCLOSURE, DELIMITERS } from './constant';

/* ``````````````````````````````
>> 改行・区切り文字判定

`````````````````````````````` */
// 改行を判定する
const getLineBreak = str => {
    const counts = {
        '\n': (str.match(/(?<!\r)\n/g) ?? []).length,
        '\r\n': (str.match(/\r\n/g) ?? []).length,
    };

    return Object.keys(counts).reduce((a, b) =>
        counts[a] > counts[b] ? a : b,
    );
};

// 区切り文字を判定する
const getDelimiter = str => {
    const counts = [];
    DELIMITERS.forEach(delimiter => {
        counts.push((str?.match(new RegExp(delimiter, 'g')) ?? []).length);
    });

    const maxIdx = counts.reduce((maxIdx, currentVal, currentIdx, arr) => {
        return currentVal > arr[maxIdx] ? currentIdx : maxIdx;
    }, 0);

    return DELIMITERS[maxIdx];
};

/* ``````````````````````````````
>> 文字置換

`````````````````````````````` */
// 入力イベント時に発生する改行エスケープを戻す
const normalizeLineBreak = inData => {
    const [CRLF, LF] = [
        [/\\r\\n/g, '\r\n'],
        [/\\n/g, '\n'],
    ];
    return inData.replace(CRLF[0], CRLF[1]).replace(LF[0], LF[1]);
};

/* ``````````````````````````````
>> データ変換

`````````````````````````````` */
// CSV形式、EXCEL形式の`文字列`を`配列`に変換する
const parseInput = inData => {
    // 改行文字のエスケープ対策
    const data = normalizeLineBreak(inData);

    // 改行文字判定後、1次元配列作成 (EOFに改行があった場合は除去する)
    const lineBreakPtn = getLineBreak(data);
    const rows = data.split(lineBreakPtn).filter(el => el);

    // 区切り文字判定後、2次元配列を作成し返却
    const delimiter = getDelimiter(rows[0]);
    const pattern = new RegExp(`${delimiter}(?=(?:[^"]*"[^"]*")*[^"]*$)`, 'g');
    return rows.map(row => row.split(pattern));
};

/* ``````````````````````````````
>> データ整形

`````````````````````````````` */
// 入力データ整形
const formatData = inData => {
    // 2次元配列内の囲い文字を除去して返却
    const enclosurePtn = new RegExp(`(^[${ENCLOSURE}])|([${ENCLOSURE}]$)`, 'g');

    // 文字列 =>> 配列へ変換
    const rows = parseInput(inData);
    return rows.map(row => {
        return row.map(cell => {
            // 囲い文字を除去
            return cell.replace(enclosurePtn, '');
        });
    });
};

/* ``````````````````````````````
>> イベント

`````````````````````````````` */

const helper = {
    formatData,
};

export default helper;
