import React from "react";
import SideNavigation from "@/components/SideNavigation";
import PartInduk from "@/components/Kelola/PartInduk";

const page = () => {
  return <SideNavigation submenu="2" menu="2-1" konten={<PartInduk />} />;
};

export default page;
