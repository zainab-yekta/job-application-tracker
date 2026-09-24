import React from 'react';
import { RefreshCw, TriangleAlert } from 'lucide-react';
import './StatusPage.css';

// Shows a friendly page instead of a blank screen when something breaks while
// rendering. A common real case: the site was updated while the page was open,
// so the Analytics code it tries to load no longer exists, and reloading fixes it.
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error, info) {
    console.error('Something went wrong while showing the page', error, info.componentStack);
  }

  // Try again when the visitor moves to another page (App passes the current path)
  componentDidUpdate(prevProps) {
    if (this.state.hasError && prevProps.resetKey !== this.props.resetKey) {
      this.setState({ hasError: false });
    }
  }

  render() {
    if (!this.state.hasError) return this.props.children;

    return (
      <main className="status-page">
        <div className="status-page-card card" role="alert">
          <span className="status-page-icon is-error" aria-hidden="true">
            <TriangleAlert size={28} />
          </span>
          <h1>Something went wrong</h1>
          <p>
            The page could not be shown. Your saved applications are safe. Reloading usually fixes
            this.
          </p>
          <div className="status-page-actions">
            <button
              type="button"
              className="btn btn-primary"
              onClick={() => window.location.reload()}
            >
              <RefreshCw size={16} aria-hidden="true" />
              Reload the page
            </button>
            <a href="#/" className="btn btn-secondary">
              Go to the home page
            </a>
          </div>
        </div>
      </main>
    );
  }
}

export default ErrorBoundary;
