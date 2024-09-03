import { atom } from "recoil"

export const tableDataAtom = atom({
    key: 'tableDataAtom',
    default: [
        ['header_1', 'header_2', 'header_3', 'header_4', 'header_5'],
        ['data_1-1', 'data_2-1', 'data_3-1, data_4-1', 'data_5-1'],
        ['data_1-2', 'data_2-2', 'data_3-2, data_4-2', 'data_5-2'],
        ['data_1-3', 'data_2-3', 'data_3-3, data_4-3', 'data_5-3'],
        ['data_1-4', 'data_2-4', 'data_3-4, data_4-4', 'data_5-4'],
    ]
})