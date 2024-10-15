import { tableDataAtom } from '@/stores/table-data/table-data-atom';
import HandsontableComponent from './HandsontableComponent';
import { useRecoilValue } from 'recoil';
import { useEffect } from 'react';

export default function EditTableArea() {
    // 確認用 あとで削除
    const tableData = useRecoilValue(tableDataAtom);
    useEffect(() => {
        tableData.forEach(row => console.log(row));
    }, [tableData]);

    return (
        <>
            <h3>EditTableArea</h3>
            <HandsontableComponent />
        </>
    );
}
