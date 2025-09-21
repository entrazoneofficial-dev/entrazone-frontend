import React from "react";
import Header from "../components/LayoutComponents/Header";
import { Outlet } from "react-router-dom";

function PrivateLayout({subjects}) {
  return (
    <>
      <Header subjects={subjects}/>
       <Outlet />
    </>
  );
}

export default PrivateLayout;
