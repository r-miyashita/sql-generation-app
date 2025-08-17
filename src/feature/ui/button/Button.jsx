import PropTypes from 'prop-types';

const Button = ({ children, onClick, style = {} }) => {
    return (
        <button onClick={onClick} style={style}>
            {children}
        </button>
    );
};

Button.propTypes = {
    children: PropTypes.node.isRequired,
    onClick: PropTypes.func.isRequired,
    style: PropTypes.object,
};

export default Button;
