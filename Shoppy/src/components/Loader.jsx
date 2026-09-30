import PropTypes from 'prop-types';

// Spinner used as the Suspense fallback and while data is loading.
// (Kept as a normal import on purpose: the fallback itself must not be lazy.)
export default function Loader({ label = 'Loading…' }) {
  return (
    <div className="loader" role="status">
      <span className="spinner" aria-hidden="true" />
      <span>{label}</span>
    </div>
  );
}

Loader.propTypes = { label: PropTypes.string };
