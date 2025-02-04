import React from "react";
import SideNavigation from "@/components/SideNavigation";
import PartAnak from "@/components/Kelola/PartAnak";

const page = () => {
  return <SideNavigation submenu="2" menu="2-2" konten={<PartAnak />} />;
};

export default page;
