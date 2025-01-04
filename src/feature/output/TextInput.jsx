import PropTypes from 'prop-types';

const TextInput = ({ keyName, value, handleInputChange }) => {
    // tableName からテキストボックスを作る
    const key = keyName;
    return (
        <input
            type="text"
            name={keyName}
            id={keyName}
            value={value}
            onChange={e => handleInputChange(key, e.target.value)}
        />
    );
};
TextInput.propTypes = {
    keyName: PropTypes.string.isRequired,
    value: PropTypes.string.isRequired,
    handleInputChange: PropTypes.func.isRequired,
};

export default TextInput;
