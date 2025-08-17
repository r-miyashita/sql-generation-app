import PropTypes from 'prop-types';
import Button from '@/feature/ui/button/Button';

const SqlModeToggleButton = ({ type, sqlType, onClick }) => {
    const text = type.toUpperCase();
    const isActive = sqlType === type ? true : false;

    // アクティブ状態のスタイリング
    const style = {
        backgroundColor: isActive ? 'red' : 'transparent',
    };

    return (
        <Button onClick={() => onClick(type)} style={style}>
            {text}
        </Button>
    );
};

SqlModeToggleButton.propTypes = {
    type: PropTypes.oneOf(['update', 'insert']).isRequired,
    onClick: PropTypes.func.isRequired,
    sqlType: PropTypes.string.isRequired,
};

export default SqlModeToggleButton;
