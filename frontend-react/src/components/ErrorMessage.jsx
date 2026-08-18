export default function ErrorMessage({ message = "Something went wrong.", onRetry }) {
  return (
    <div className="state-box error-box" role="alert">
      <p>{message}</p>
      {onRetry && (
        <button className="btn btn-outline" onClick={onRetry}>
          Try again
        </button>
      )}
    </div>
  );
}
