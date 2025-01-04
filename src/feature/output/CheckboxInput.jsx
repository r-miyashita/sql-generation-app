import PropTypes from 'prop-types';

const CheckboxInput = ({ parentKey, childKey, handleInputChange }) => {
    // options からチェックボックスを作る
    const key = `${parentKey}.${childKey}`;
    return (
        <input
            type="checkbox"
            name={childKey}
            id={childKey}
            onChange={e => handleInputChange(key, e.target.checked)}
        />
    );
};
CheckboxInput.propTypes = {
    parentKey: PropTypes.string.isRequired,
    childKey: PropTypes.string.isRequired,
    handleInputChange: PropTypes.func.isRequired,
};

export default CheckboxInput;
