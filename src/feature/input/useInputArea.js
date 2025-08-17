import helper from './logic';
import err from './error';
import { useCallback } from 'react';

const useHandleInput = setRecoilState => {
    return useCallback(
        e => {
            if (!e.target.value) return;
            const indata = helper.formatData(e.target.value);

            // `ヘッダーの項目数` != `値の項目数` の場合は input不備なので検知する
            const errs = err.checkArrLength(indata);
            if (errs) console.warn(errs);

            setRecoilState(indata);
        },
        [setRecoilState],
    );
};

export { useHandleInput };
