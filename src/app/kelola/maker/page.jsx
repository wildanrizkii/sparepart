import React from "react";
import SideNavigation from "@/components/SideNavigation";
import Maker from "@/components/Kelola/Maker";

const page = () => {
  return <SideNavigation submenu="2" menu="2-5" konten={<Maker />} />;
};

export default page;
