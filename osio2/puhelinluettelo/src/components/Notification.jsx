
import PropTypes from 'prop-types'

const Notification = ({ message, type }) => {
  if (!message || !type) {
    return null
  }
  
  return (
    <div className={`notification-bar ${type}`}>
      {message}
    </div>
  );
}

Notification.propTypes = {
  message: PropTypes.string.isRequired,
  type: PropTypes.string.isRequired,
};

export default Notification