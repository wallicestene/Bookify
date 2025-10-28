/* eslint-disable react/prop-types */
import { Component } from "react";
import { AlertCircle, RefreshCw } from "lucide-react";
import { Button } from "./ui/button";

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("Error caught by boundary:", error, errorInfo);
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null });
    window.location.href = "/";
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex items-center justify-center min-h-screen bg-gray-50">
          <div className="text-center p-8 max-w-md">
            <AlertCircle className="mx-auto h-16 w-16 text-red-500 mb-4" />
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              Oops! Something went wrong
            </h1>
            <p className="text-gray-600 mb-6">
              We&apos;re sorry, but something unexpected happened. Please try
              refreshing the page.
            </p>
            <Button
              onClick={this.handleReset}
              className="inline-flex items-center gap-2"
            >
              <RefreshCw className="h-4 w-4" />
              Go to Home
            </Button>
            {import.meta.env.DEV && (
              <details className="mt-6 text-left">
                <summary className="cursor-pointer text-sm text-gray-500">
                  Error details
                </summary>
                <pre className="mt-2 p-4 bg-gray-100 rounded text-xs overflow-auto">
                  {this.state.error?.toString()}
                </pre>
              </details>
            )}
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
