import React from "react";

const Container = ({ children, className }) => {
  return <div className={`bg-purple-100 ${className}`}>{children}</div>;
};

export default Container;
