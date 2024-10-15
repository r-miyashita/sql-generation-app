import { useSetRecoilState } from 'recoil';
import { tableDataAtom } from '@/stores/table-data/table-data-atom';
import { formatData } from './logic';
import { checkArrLength } from './error';

export default function InputArea() {
    const setTableData = useSetRecoilState(tableDataAtom);

    const handleInput = e => {
        if (!e.target.value) return;
        const indata = formatData(e.target.value);

        // 項目数 < 要素数 となる配列 =>> 値に区切り文字が含まれている可能性があるので、アラートを出す
        const errs = checkArrLength(indata);
        if (errs) console.warn(errs);

        setTableData(() => indata);

        // 確認用 あとで削除
        console.log(indata);
    };

    return (
        <>
            <textarea type="text" onChange={handleInput} />
        </>
    );
}
