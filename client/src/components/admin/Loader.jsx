import React from "react";
import { FaSpinner } from "react-icons/fa";

/**
 * A reusable, responsive loader component.
 * @param {object} props
 * @param {string} [props.text="Loading..."] - The text to display below the spinner.
 * @param {boolean} [props.fullScreen=false] - If true, the loader will cover the entire screen.
 * @param {'sm'|'md'|'lg'} [props.size='md'] - The size of the spinner.
 */
const Loader = ({ text = "Loading...", fullScreen = false, size = "md" }) => {
  // ✅ FIX: Added responsive font sizes.
  // Now, each size is a bit smaller on mobile and scales up on larger screens.
  const sizeClasses = {
    sm: "text-2xl sm:text-3xl",
    md: "text-4xl sm:text-5xl",
    lg: "text-6xl sm:text-7xl",
  };

  const loaderContent = (
    <div className="flex flex-col items-center justify-center gap-4 text-slate-500">
      <FaSpinner className={`animate-spin ${sizeClasses[size]}`} />
      {/* ✅ FIX: Made the loading text responsive as well. */}
      {text && <p className="text-sm sm:text-base font-medium">{text}</p>}
    </div>
  );

  if (fullScreen) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-slate-900/20 backdrop-blur-sm z-50">
        {loaderContent}
      </div>
    );
  }

  return loaderContent;
};

export default Loader;
