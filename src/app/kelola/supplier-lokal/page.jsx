import React from "react";
import SideNavigation from "@/components/SideNavigation";
import SupplierLokal from "@/components/Kelola/SupplierLokal";

const page = () => {
  return <SideNavigation submenu="2" menu="2-6" konten={<SupplierLokal />} />;
};

export default page;
