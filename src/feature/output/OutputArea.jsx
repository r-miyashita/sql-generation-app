/* ==================================================
インポート

================================================== */
import { useState, useEffect } from 'react';
import { useRecoilValue } from 'recoil';
/* ``````````````````````````````
ストア
`````````````````````````````` */
import {
    tableDataHeaderSelector,
    tableDataBodySelector,
} from '@/stores/table-data/table-data-atom';
/* ``````````````````````````````
コンポーネント
`````````````````````````````` */
import ConfigSection from './ConfigSection';
import SqlModeToggleButton from './SqlModeToggleButton';
/* ``````````````````````````````
ロジック
`````````````````````````````` */
import helper from './logic';

/* ==================================================
共通変数

================================================== */
const TYPES = { insert: 'insert', update: 'update' };
const DEFAULT_TABLE_NAME = 'tableName';
const SAFE_UPDATES_QUERY = {
    head: 'SET sql_safe_updates = 0;',
    tail: 'SET sql_safe_updates = 1;',
};
const TRANSACTION_QUERY = {
    head: 'BEGIN\n',
    tail: 'ROLLBACK;\n-- COMMIT;',
};

/* ==================================================
メインコンポーネント

================================================== */
const OutputArea = () => {
    const header = useRecoilValue(tableDataHeaderSelector); // カラム情報を配列で保持。各sqlの生成に使う
    const body = useRecoilValue(tableDataBodySelector);
    const [sqlType, setSqlType] = useState(TYPES.insert); //タイプは 'insert' or 'update' の2種
    // todo: INPUT入力無の状態でOnchangeが発火するとエラーになる。 headerがundifinedのために、mapを使えないエラー。 元のrecoil更新でundifinedにならないように制御入れた方が良さそう。
    const columns = header.map(col => ({
        name: col,
        useInWhere: false,
        useInSet: false,
    }));
    const [sqlSetting, setSqlSetting] = useState({
        // 設定: タイプに合った設定内容を保持
        tableName: DEFAULT_TABLE_NAME,
        options: {
            createFlag: false,
            dropFlag: false,
        },
    });
    const [insertQuery, setInsertQuery] = useState('');
    const [updateQuery, setUpdateQuery] = useState('');

    /* ``````````````````````````````
    handleSqlType

    SQLタイプの変更 と タイプに対応したSQLセッティング の設定をする
    `````````````````````````````` */
    const handleSqlType = type => {
        if (sqlType === type) return;
        const setting = helper.updateSqlSetting(
            type,
            columns,
            DEFAULT_TABLE_NAME,
        );
        setSqlType(type);
        setSqlSetting(setting);
    };

    /* ``````````````````````````````
    handleInputChange

    子要素の onChangeイベントで利用される。
    変更内容を SQLセッティングへ 反映させる
   `````````````````````````````` */
    const handleInputChange = (key, value) => {
        setSqlSetting(prev => helper.handleUpsateSqlSetting(prev, key, value));
    };

    /* ----------------------------------------
    SQL

    ---------------------------------------- */

    /* ``````````````````````````````
    -- create
    
    `````````````````````````````` */
    const setCreateStatement = (currentTableName, header) => {
        const query = helper.generateCreateQuery(currentTableName, header);
        setOptionalQuerys(prev => ({
            ...prev,
            create: query.head + query.body + query.tail,
        }));
    };

    /* ``````````````````````````````
    -- drop
    
    `````````````````````````````` */
    const setDropStatement = currentTableName => {
        setOptionalQuerys(prev => ({
            ...prev,
            drop: `DROP TABLE IF EXISTS \`${currentTableName}\`;`,
        }));
    };

    /* ``````````````````````````````
    -- insert
    
    `````````````````````````````` */
    const setInsertStatement = (currentTableName, header, body) => {
        const query = helper.generateInsertQuery(
            currentTableName,
            header,
            body,
        );
        setInsertQuery(query.head + query.body + query.tail);
    };

    /* ``````````````````````````````
    -- update
    
    `````````````````````````````` */
    // TODO: columnsを利用してupdateクエリを作成する。
    const setUpdateStatement = (currentTableName, columnsState, body) => {
        const querys = helper.generateUpdateQuery(
            currentTableName,
            columnsState,
            body,
        );
        setUpdateQuery(querys);
    };

    /* ``````````````````````````````
    -- option
    
    `````````````````````````````` */
    const [optionalQuerys, setOptionalQuerys] = useState({
        create: '',
        drop: '',
        safeUpdates: SAFE_UPDATES_QUERY,
        transaction: TRANSACTION_QUERY,
    });

    const displayStyle = keyFlag => ({
        display: keyFlag ? 'block' : 'none',
        whiteSpace: 'pre-wrap',
    });

    /* ==================================================
    useEffect

    ================================================== */
    useEffect(() => {
        setCreateStatement(sqlSetting.tableName, header);
        setDropStatement(sqlSetting.tableName);
        if (sqlType === 'insert')
            setInsertStatement(sqlSetting.tableName, header, body);
        if (sqlType === 'update')
            setUpdateStatement(sqlSetting.tableName, sqlSetting.columns, body);
    }, [header, body, sqlSetting, sqlType]);

    /* ==================================================
    return

    ================================================== */
    return (
        <>
            <div>
                <SqlModeToggleButton
                    type={TYPES.insert}
                    sqlType={sqlType}
                    onClick={handleSqlType}
                />
                <SqlModeToggleButton
                    type={TYPES.update}
                    sqlType={sqlType}
                    onClick={handleSqlType}
                />

                <h3>Setting↓↓</h3>
                <ConfigSection
                    sqlType={sqlType}
                    sqlSetting={sqlSetting}
                    handleInputChange={handleInputChange}
                />
            </div>
            <h3>OutPut</h3>
            <div style={{ height: '15rem' }}>
                <div style={displayStyle(sqlSetting.options.dropFlag)}>
                    {optionalQuerys.drop}
                </div>
                <div style={displayStyle(sqlSetting.options.createFlag)}>
                    {optionalQuerys.create}
                </div>
                <div style={displayStyle(sqlSetting.options.safeUpdatesFlag)}>
                    {optionalQuerys.safeUpdates.head}
                </div>
                <div style={displayStyle(sqlSetting.options.transactionFlag)}>
                    {optionalQuerys.transaction.head}
                    {optionalQuerys.transaction.tail}
                </div>
                <div style={displayStyle(sqlSetting.options.safeUpdatesFlag)}>
                    {optionalQuerys.safeUpdates.tail}
                </div>
                <div style={{ whiteSpace: 'pre-wrap' }}>
                    {sqlType === 'insert' ? insertQuery : updateQuery}
                </div>
            </div>
        </>
    );
};

export default OutputArea;
