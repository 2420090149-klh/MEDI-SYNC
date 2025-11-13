import React from 'react';

export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { error: null, info: null };
  }

  static getDerivedStateFromError(error) {
    return { error };
  }

  componentDidCatch(error, info) {
    // Save stack/info for debugging; keep simple for now
    this.setState({ info });
    // Also log to console so Vite overlay still shows it
    // but this makes a visible in-app error message for users
    // who might not see devtools immediately.
    // eslint-disable-next-line no-console
    console.error('ErrorBoundary caught:', error, info);
  }

  render() {
    const { error, info } = this.state;
    if (error) {
      return (
        <div style={{ padding: 24, fontFamily: 'system-ui, sans-serif' }}>
          <h2 style={{ color: '#b00020' }}>Application Error</h2>
          <p>{error && error.toString()}</p>
          {info && info.componentStack && (
            <details style={{ whiteSpace: 'pre-wrap', marginTop: 12 }}>
              <summary>Component stack</summary>
              <pre>{info.componentStack}</pre>
            </details>
          )}
          <p style={{ marginTop: 12 }}>Open the browser console for more details.</p>
        </div>
      );
    }
    return this.props.children;
  }
}
