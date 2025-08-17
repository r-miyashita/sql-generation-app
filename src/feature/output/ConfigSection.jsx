/* ==================================================
インポート

================================================== */
// import { useState } from 'react';
import PropTypes from 'prop-types';
/* ``````````````````````````````
カスタムフック
`````````````````````````````` */
import useModal from '@/hooks/useModal';
/* ``````````````````````````````
コンポーネント
`````````````````````````````` */
import CustomLabel from './CustomLabel';
import TextInput from './TextInput';
import CheckboxInput from './CheckboxInput';
import KeyColumnModal from './KeyColumnModal';

/* ==================================================
メインコンポーネント

================================================== */
const ConfigSection = ({ sqlType, sqlSetting, handleInputChange }) => {
    const { modals, modalStates, openModal, closeModal } = useModal({
        useInWhere: false,
        useInSet: false,
    });

    return (
        <ul>
            {/* tableName */}
            <li>
                <CustomLabel keyName="tableName" />
                <TextInput
                    keyName="tableName"
                    value={sqlSetting.tableName}
                    handleInputChange={handleInputChange}
                />
            </li>

            {/* columns */}
            {/* HACK: modal本体はループで生成するので、ゆくゆくはこっちもループ生成に揃える。 */}
            {sqlSetting.columns && sqlType === 'update' && (
                <>
                    <li>
                        <CustomLabel keyName="where" />
                        <button onClick={() => openModal('useInWhere')}>
                            add
                        </button>
                    </li>
                    <li>
                        <CustomLabel keyName="set" />
                        <button onClick={() => openModal('useInSet')}>
                            add
                        </button>
                    </li>
                </>
            )}

            {/* options */}
            {Object.entries(sqlSetting['options']).map(([childKey]) => {
                return (
                    <li key={childKey}>
                        <CustomLabel keyName={childKey} />
                        <CheckboxInput
                            parentKey="options"
                            childKey={childKey}
                            handleInputChange={handleInputChange}
                        />
                    </li>
                );
            })}

            {/* モーダル */}
            {modals.map(modalRole => (
                <KeyColumnModal
                    key={modalRole}
                    isOpen={modalStates[modalRole]}
                    onClose={closeModal}
                    handleInputChange={handleInputChange}
                    columns={sqlSetting.columns || []}
                    role={modalRole}
                />
            ))}
        </ul>
    );
};

ConfigSection.propTypes = {
    sqlType: PropTypes.oneOf(['update', 'insert']).isRequired,
    sqlSetting: PropTypes.shape({
        tableName: PropTypes.string.isRequired,
        options: PropTypes.shape({
            createFlag: PropTypes.bool,
            dropFlag: PropTypes.bool,
            safeUpdatesFlag: PropTypes.bool,
            transactionFlag: PropTypes.bool,
        }).isRequired,
        columns: PropTypes.arrayOf(
            PropTypes.shape({
                name: PropTypes.string,
                useInWhere: PropTypes.bool,
                useInSet: PropTypes.bool,
            }),
        ),
    }).isRequired,
    handleInputChange: PropTypes.func.isRequired,
};

export default ConfigSection;
