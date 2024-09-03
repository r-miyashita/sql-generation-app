// import { useRecoilState } from 'recoil';
// import { tableDataAtom } from '@/stores/table-data';
import { formatData } from './control-charcters';

// const [tableData, setTableData] = useRecoilState(tableDataAtom);

const handleInput = e => {
    if (!e.target.value) return;

    const result = formatData(e.target.value);

    // 項目数 < 要素数 となる配列 =>> 値に区切り文字が含まれている可能性がある =>> アラートを出す
    const numOfHeaders = Number(result[0]?.length);
    const errs = [];
    result.forEach((el, idx) => {
        if (Number(el.length) !== numOfHeaders) {
            errs.push({
                row: idx + 1,
                length: el.length,
            });
        }
    });

    if (errs) {
        let warns = '';
        errs.forEach(el => {
            warns += `ヘッダー項目数と一致しません：${el.row}行目：${el.length}項目\n`;
        });
        console.log(warns);
    }

    result.forEach(el => console.log(el));
};

export default function input() {
    return (
        <>
            <textarea type="text" onChange={handleInput} />
        </>
    );
}
