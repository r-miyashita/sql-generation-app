import { useRef, useEffect } from 'react';
import Handsontable from 'handsontable';
import { registerAllModules } from 'handsontable/registry';
import 'handsontable/dist/handsontable.full.min.css';
import { useRecoilState } from 'recoil';
import { tableDataAtom } from '@/stores/table-data/table-data-atom';

// Register Handsontable's modules
registerAllModules();

const HandsontableComponent = () => {
    const [tableData, setTableData] = useRecoilState(tableDataAtom);
    const hotRef = useRef(null);

    useEffect(() => {
        const hotRefCurrent = hotRef.current;

        // インスタンスの初期化は初回のみ。recoil更新の度に初期化されるのを防ぐ。
        if (!hotRefCurrent.hotInstance) {
            const hot = new Handsontable(hotRefCurrent, {
                data: structuredClone(tableData),
                colHeaders: true,
                rowHeaders: true,
                licenseKey: 'non-commercial-and-evaluation',
                afterChange: (changes, source) => {
                    // 初回読み込みデータでない場合、変更後の最新データで Recoilを更新する
                    if (source != 'loadData' && changes) {
                        const newData = hot.getData();
                        setTableData(structuredClone(newData));
                    }
                },
            });

            hotRefCurrent.hotInstance = hot;
        } else {
            // recoilの一貫性担保のため。tableDataが変わったら必ずテーブルデータを最新化する。
            hotRefCurrent.hotInstance.loadData();
        }

        return () => {
            if (hotRefCurrent.hotInstance) {
                hotRefCurrent.hotInstance.destroy();
                hotRefCurrent.hotInstance = null;
            }
        };
    }, [tableData, setTableData]);

    return <div ref={hotRef}></div>;
};

export default HandsontableComponent;
