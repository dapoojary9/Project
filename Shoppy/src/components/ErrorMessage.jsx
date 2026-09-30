import PropTypes from 'prop-types';

// Friendly error box with an optional "Try again" button
export default function ErrorMessage({ message, onRetry }) {
  return (
    <div className="error-box" role="alert">
      <h2>We couldn't load this page</h2>
      <p>{message}</p>
      {onRetry && (
        <button type="button" className="btn" onClick={onRetry}>
          Try again
        </button>
      )}
    </div>
  );
}

ErrorMessage.propTypes = {
  message: PropTypes.string.isRequired,
  onRetry: PropTypes.func,
};
