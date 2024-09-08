
/* ``````````````````````````````
checkArrLength

2次元配列のlengthが揃っているかチェックする
idx:0 の要素を基準とし、一致しない要素を返す
`````````````````````````````` */
function checkArrLength(ndarr) {
    if (!ndarr.length) return;
    const valid_length = Number(ndarr[0].length);
    return ndarr.map((el, idx) => (
        el.length !== valid_length && { row: idx + 1, length: el.length }
    )).filter(el => Boolean(el))
}

export { checkArrLength }