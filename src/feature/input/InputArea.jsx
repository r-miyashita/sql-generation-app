// import { useRecoilState } from 'recoil';
// import { tableDataAtom } from '@/stores/table-data';
import { formatData } from './logic';
import { checkArrLength } from './error';

// const [tableData, setTableData] = useRecoilState(tableDataAtom);

const handleInput = e => {
    if (!e.target.value) return;

    const result = formatData(e.target.value);

    // 項目数 < 要素数 となる配列 =>> 値に区切り文字が含まれている可能性があるので、アラートを出す
    const errs = checkArrLength(result);
    if (errs) console.warn(errs);

    result.forEach(el => console.log(el));
};

export default function input() {
    return (
        <>
            <textarea type="text" onChange={handleInput} />
        </>
    );
}
