import React from "react";
import SideNavigation from "@/components/SideNavigation";
import Supplier from "@/components/Kelola/Supplier";

const page = () => {
  return <SideNavigation submenu="2" menu="2-4" konten={<Supplier />} />;
};

export default page;
