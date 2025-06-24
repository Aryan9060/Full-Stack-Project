import React from "react";
import { Outlet } from "react-router";
import Navbar from "./navbar/Navbar";

const Layout = () => {
  return (
    <div className="w-full">
      <Navbar />
      <Outlet />
    </div>
  );
};

export default Layout;
