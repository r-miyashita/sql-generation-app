import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';

/* ==================================================
メインコンポーネント

チェック状態をローカル管理する。開いている間はローカルでのみ状態管理し、閉じるときに最終的な状態を親へ同期させる。
================================================== */
const KeyColumnModal = ({
    isOpen,
    onClose,
    handleInputChange,
    columns,
    role,
}) => {
    const [columnsState, setColumnsState] = useState([]);
    useEffect(() => {
        setColumnsState(structuredClone(columns));
    }, [isOpen, columns]);

    const handleModalClose = () => {
        const [key, value] = ['columns', columnsState];
        // モーダルを閉じるタイミングで ローカルステートと親のステートを同期させる( 親： sqlSetting.columns を変更 ）
        if (isOpen) handleInputChange(key, value);
        onClose(role);
    };

    const handleOnchange = (e, eventIdx) => {
        // チェックイベントカラムを特定し、ローカルステートのチェック状態を上書きする
        const updateColumns = columnsState.map((prevCol, idx) =>
            eventIdx === idx
                ? { ...prevCol, [role]: e.target.checked }
                : prevCol,
        );
        setColumnsState(updateColumns);
    };

    if (!isOpen) return null;
    return (
        <div className="modal-overlay" onClick={handleModalClose}>
            <div className="modal-content" onClick={e => e.stopPropagation()}>
                <div className="columns-selector">
                    {columnsState.map((col, idx) => (
                        <div className="checkbox-wrapper" key={idx}>
                            <input
                                type="checkbox"
                                name={`col${idx + 1}`}
                                id={`col${idx + 1}`}
                                value={col.name}
                                checked={col[role]}
                                onChange={e => handleOnchange(e, idx)}
                            />
                            <label htmlFor={`col${idx + 1}`}>{col.name}</label>
                        </div>
                    ))}
                </div>
                <button className="modal-close" onClick={handleModalClose}>
                    Close
                </button>
            </div>
        </div>
    );
};

KeyColumnModal.propTypes = {
    isOpen: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
    handleInputChange: PropTypes.func.isRequired,
    columns: PropTypes.arrayOf(
        PropTypes.shape({
            name: PropTypes.string,
            useInWhere: PropTypes.bool,
            useInSet: PropTypes.bool,
        }),
    ).isRequired,
    role: PropTypes.oneOf(['useInWhere', 'useInSet']),
};

export default KeyColumnModal;
