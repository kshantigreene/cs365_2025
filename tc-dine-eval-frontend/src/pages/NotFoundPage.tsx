import { Link } from "react-router-dom";

export default function NotFoundPage() {
  return (
    <div className="state-card">
      <h1>We lost this page</h1>
      <p className="muted">
        The page you’re looking for doesn’t exist. It might have been moved or deleted.
      </p>
      <Link to="/" className="button">
        Back to home
      </Link>
    </div>
  );
}



