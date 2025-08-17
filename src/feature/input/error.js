/* ``````````````````````````````
checkArrLength

2次元配列のlengthが揃っているかチェックする
基準行のデフォルトはヘッダー(idx: 0)で、一致しない場合はエラーメッセージを返す

@param
    ndarr: 2次元配列
    options: オブジェクト(defaultConfig を上書き時のみ設定する)
                基準行
                エラーメッセージ用関数
`````````````````````````````` */
const checkArrLength = (ndarr, options = {}) => {
    if (!ndarr.length) return;

    const defaultConfig = {
        referenceRow: 0,
        messageTemplate: (row, length) =>
            `ヘッダー項目数と一致しません：${row}行目：${length}項目`,
    };

    const config = { ...defaultConfig, ...options };
    const valid_length = Number(ndarr[config.referenceRow].length);

    const errs = ndarr
        .map(
            (row, idx) =>
                row.length !== valid_length && {
                    row: idx + 1,
                    length: row.length,
                },
        )
        .filter(el => el);

    if (errs.length > 0) {
        return errs.reduce(
            (acc, cur) =>
                acc + config.messageTemplate(cur.row, cur.length) + '\n',
            '',
        );
    }

    return null;
};

const err = {
    checkArrLength,
};

export default err;
