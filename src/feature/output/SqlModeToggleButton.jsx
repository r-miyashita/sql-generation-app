import PropTypes from 'prop-types';

const SqlModeToggleButton = ({ type, sqlType, onClick }) => {
    const getButtonText = () => {
        switch (type) {
            case 'update':
                return 'UPDATE';
            case 'insert':
                return 'INSERT';
            default:
                return 'UNKNOWN';
        }
    };

    const getButtonStyle = () => ({
        backgroundColor: sqlType === type ? 'red' : 'transparent',
    });

    return (
        <button onClick={() => onClick(type)} style={getButtonStyle()}>
            {getButtonText()}
        </button>
    );
};

SqlModeToggleButton.propTypes = {
    type: PropTypes.oneOf(['update', 'insert']).isRequired,
    onClick: PropTypes.func.isRequired,
    sqlType: PropTypes.string.isRequired,
};

export default SqlModeToggleButton;
