import React from "react";
import SideNavigation from "@/components/SideNavigation";
import About from "@/components/About";

const page = () => {
  return <SideNavigation menu="3" konten={<About />} />;
};

export default page;
