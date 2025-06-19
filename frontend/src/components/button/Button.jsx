import React from "react";

export default function Button({
  onClick,
  type = "button",
  children,
  className = "",
}) {
  return (
    <button
      onClick={onClick}
      type={type}
      className={`btn ${className}`}
      {...prop}
    >
      {children}
    </button>
  );
}
