import PropTypes from 'prop-types';

const CustomLabel = ({ keyName }) => (
    <label htmlFor={keyName}>{keyName} : </label>
);
CustomLabel.propTypes = { keyName: PropTypes.string.isRequired };

export default CustomLabel;
