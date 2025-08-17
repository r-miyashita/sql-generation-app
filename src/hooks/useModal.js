import { useState } from 'react';

const useModal = (initialState = {}) => {
    // HACK 整数のキーが存在すると並び順が担保できなくなる仕様になっている。厳密に制御が必要なら追加処置が必要。
    const modals = Object.keys(initialState);

    const [modalStates, setModalStates] = useState(initialState);

    const openModal = modalRole => {
        setModalStates(prev => ({ ...prev, [modalRole]: true }));
    };

    const closeModal = (modalRole, callback) => {
        setModalStates(prev => {
            if (prev[modalRole] && callback) callback();
            return { ...prev, [modalRole]: false };
        });
    };

    return { modals, modalStates, openModal, closeModal };
};

export default useModal;
