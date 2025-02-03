import React from "react";
import SideNavigation from "@/components/SideNavigation";
import Material from "@/components/Kelola/Material";

const page = () => {
  return <SideNavigation submenu="2" menu="2-3" konten={<Material />} />;
};

export default page;
