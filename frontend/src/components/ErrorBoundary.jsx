import React from "react";
import { useRouteError } from "react-router";

function ErrorBoundary() {
  const error = useRouteError();

  if (!error) return <p>Something went wrong</p>;

  const { data, status, statusText, message } = error;

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-2">Oops! An error occurred</h2>
      <p>{message || data}</p>
      {status && (
        <p>
          Status: {status} - {statusText}
        </p>
      )}
    </div>
  );
}

export default ErrorBoundary;