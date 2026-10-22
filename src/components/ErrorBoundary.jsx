import React from "react";

// Keeps a render-time crash in one animated subtree from blanking the whole site.
// Nothing about the error is shown to the visitor; details stay in the console.
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error, info) {
    console.error("Unhandled UI error:", error, info);
  }

  render() {
    if (!this.state.hasError) return this.props.children;

    return (
      <div className="p-[0.55rem] gray-bg">
        <div className="rounded-[0.3rem] black-bg min-h-[90vh] flex flex-col items-center justify-center text-center text-off-white px-5">
          <h1 className="text-3xl sm:text-5xl font-extrabold">
            Something went wrong.
          </h1>
          <p className="text-sm mt-4 max-w-md">
            Please reload the page. If it keeps happening, reach out at{" "}
            <a
              className="orange-text-hover underline"
              href="mailto:hafizmahmedashar@gmail.com"
            >
              hafizmahmedashar@gmail.com
            </a>
            .
          </p>
          <a href="/" className="mt-8 text-lg font-bold orange-text-hover underline">
            Back to homepage
          </a>
        </div>
      </div>
    );
  }
}

export default ErrorBoundary;
