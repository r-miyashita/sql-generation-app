/* ==================================================
ヘルパー関数
OutputArea.jsx
================================================== */
/* ``````````````````````````````
>> handleSqlType

`````````````````````````````` */
const updateSqlSetting = (type, columns, defaultTableName) => {
    switch (type) {
        case 'insert': // テーブル名, テーブル作成フラグ, テーブル削除フラグ
            return {
                tableName: defaultTableName,
                options: {
                    createFlag: false,
                    dropFlag: false,
                },
            };
        case 'update': // テーブル名, セーフアップデート無効化フラグ, トランザクションフラグ
            return {
                tableName: defaultTableName,
                options: {
                    safeUpdatesFlag: false,
                    transactionFlag: false,
                },
                columns: columns,
            };
        default:
            console.warn(`予期しないタイプ：${type}`);
            return { unkownType: type };
    }
};
/* ``````````````````````````````
>> handleInputChange

`````````````````````````````` */
/* +++++++++++++
カラムの状態を比較する
各カラム要素が保持している bool値 の変更を検知する。変更があった場合は true を返す

+++++++++++++ */
const compareColumns = (prevColumns, newColumns) => {
    const newColumnsMap = new Map(newColumns.map(col => [col.name, col]));

    // 比較ロジック
    return prevColumns.some(prevCol => {
        const matchingNewCol = newColumnsMap.get(prevCol.name);
        return (
            !matchingNewCol ||
            prevCol.useInWhere !== matchingNewCol.useInWhere ||
            prevCol.useInSet !== matchingNewCol.useInSet
        );
    });
};

/* +++++++++++++
key でオブジェクト.プロパティ名を判定し
該当プロパティのみ更新された状態のオブジェクトを返す

+++++++++++++ */
const handleUpsateSqlSetting = (prev, key, value) => {
    const propertyName = key.split('.')[0];
    switch (propertyName) {
        /* options */
        case 'options': {
            const [parentKey, childKey] = key.split('.');
            return {
                ...prev,
                [parentKey]: { ...prev[parentKey], [childKey]: value },
            };
        }
        /* columns */
        case 'columns': {
            const hasDifference = compareColumns(prev[key], value);
            return {
                ...prev,
                [key]: hasDifference ? value : prev[key],
            };
        }
        /* tableName */
        case 'tableName':
            return {
                ...prev,
                [key]: value,
            };
        default:
            console.warn('更新失敗。該当プロパティが存在しません。');
            return prev;
    }
};

/* ``````````````````````````````
>> sql
    -- 共通ヘルパー

`````````````````````````````` */
// NULL, TRUE, FALSE 以外の値にクォーテーションをつけて返す処理
const formatValue = val => {
    const regx = /^(NULL|TRUE|FALSE)$/i;
    return regx.test(val) ? val : `'${val}'`;
};

// null か undifind の要素は空文字へ置換する
const fillEmptyStrings = body => body.map(row => row.map(col => col ?? ''));

/* ``````````````````````````````
>> sql
    -- create

`````````````````````````````` */
const generateCreateQuery = (currentTableName, header) => ({
    head: `CREATE TABLE ${currentTableName} (\n`,
    body: header.reduce(
        (acc, cur, idx, arr) =>
            idx === arr.length - 1
                ? acc + `\t${cur}\tVARCHAR(512)\n`
                : acc + `\t${cur}\tVARCHAR(512),\n`,
        '',
    ),
    tail: ');',
});

/* ``````````````````````````````
>> sql
    -- insert

`````````````````````````````` */
const generateInsertQuery = (currentTableName, header, body) => {
    const columns = header.reduce(
        (acc, cur, idx, arr) =>
            idx === arr.length - 1 ? acc + `\`${cur}\`` : acc + `\`${cur}\`, `,
        '',
    );

    // reduce でマルチインサートの `value行` を作っていく
    const values = fillEmptyStrings(body).reduce(
        (acc, cur, idx, arr) =>
            idx === arr.length - 1
                ? acc +
                  cur.reduce(
                      // 最終行： 改行インデントを付加しない
                      (acc, cur, idx, arr) =>
                          idx === arr.length - 1
                              ? acc + `${formatValue(cur)})`
                              : acc + `${formatValue(cur)}, `,
                      '(',
                  )
                : acc +
                  cur.reduce(
                      // 最終行でない: 改行インデントを付加する
                      (acc, cur, idx, arr) => {
                          return idx === arr.length - 1
                              ? acc + `${formatValue(cur)}),\n\t`
                              : acc + `${formatValue(cur)}, `;
                      },
                      '(',
                  ),
        '',
    );

    return {
        head: `INSERT INTO \`${currentTableName}\`\n\t(${columns})\n`,
        body: `VALUES\n\t${values}\n`,
        tail: ';',
    };
};

/* ``````````````````````````````
>> sql
    -- update

`````````````````````````````` */
// 第2引数が`true`の要素を抽出対象とする。 `カラム名` と 対応する値の`インデックス` のセットを格納した2次元配列を返却する
const filterColumns = (columns, property) =>
    columns
        .map((col, idx) => (col[property] ? [col.name, idx] : []))
        .filter(el => el.length > 0);

// WHERE句のカラムと値を繋ぐオペレータを判定し返却する
const getOperator = val => {
    const regx = /^NULL$/i;
    return regx.test(val) ? 'IS' : '=';
};

// `対象カラム`と`対応する値`を取り出し、1行ずつクエリを作成していく
const generateUpdateQuery = (currentTableName, columnsState, body) => {
    const headStatement = `UPDATE \`${currentTableName}\``;
    const tailStatement = ';';

    // 対象カラムの抽出。第2引数の
    const setColumns = filterColumns(columnsState, 'useInSet');
    const whereColumns = filterColumns(columnsState, 'useInWhere');

    // クエリ作成部分 1行１クエリを生成し、配列へ格納する
    const querys = fillEmptyStrings(body).map(row => {
        const setStatement = setColumns.reduce((prev, cur) => {
            const [col, val] = [`\`${cur[0]}\``, formatValue(row[cur[1]])];
            return prev.length === 0
                ? ' ' + `SET ${col} = ${val}`
                : prev + `, ${col} = ${val}`;
        }, '');

        const whereStatement = whereColumns.reduce((prev, cur) => {
            const [col, val] = [`\`${cur[0]}\``, formatValue(row[cur[1]])];
            const operator = getOperator(val);
            return prev.length === 0
                ? ' ' + `WHERE ${col} ${operator} ${val}`
                : prev + ` AND ${col} ${operator} ${val}`;
        }, '');

        return headStatement + setStatement + whereStatement + tailStatement;
    });

    return querys.reduce(
        (prev, cur) => (prev === '' ? prev + cur : prev + '\n' + cur),
        '',
    );
};

/* ==================================================
エクスポート

================================================== */
const helper = {
    updateSqlSetting: updateSqlSetting,
    compareColumns: compareColumns,
    handleUpsateSqlSetting: handleUpsateSqlSetting,
    generateCreateQuery: generateCreateQuery,
    generateInsertQuery: generateInsertQuery,
    generateUpdateQuery: generateUpdateQuery,
};

export default helper;
