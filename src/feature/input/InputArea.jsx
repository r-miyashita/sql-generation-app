import { useSetRecoilState } from 'recoil';
import { tableDataAtom } from '@/stores/table-data/table-data-atom';
import { useHandleInput } from './useInputArea';

const InputArea = () => {
    const setTableData = useSetRecoilState(tableDataAtom);
    const handleInput = useHandleInput(setTableData);

    return (
        <div className="flex max-w-6xl flex-col gap-4 rounded ring-1 ring-blue-900">
            {/* sectionHeader */}
            <div className="flex justify-between">
                {/* label */}
                <div className="flex items-center border-b-2 border-blue-500 px-2 py-1">
                    <h1 className="font-bold">INPUT</h1>
                </div>
                {/* control */}
                <div className="flex justify-between gap-4 px-2 py-1">
                    <button>clear</button>
                    <button>example</button>
                    <button>expand</button>
                </div>
            </div>
            {/* sectionBody */}
            <div className="px-12 py-6">
                <textarea
                    type="text"
                    onChange={handleInput}
                    className="flex h-auto min-h-40 w-full rounded-md border border-neutral-300 bg-white px-3 py-2 text-sm placeholder:text-neutral-400 focus:border-neutral-300 focus:outline-none focus:ring-2 focus:ring-neutral-400 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    placeholder="paste or drop down here ..."
                />
            </div>
        </div>
    );
};

export default InputArea;
