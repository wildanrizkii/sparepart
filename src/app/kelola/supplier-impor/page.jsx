import React from "react";
import SideNavigation from "@/components/SideNavigation";
import SupplierImpor from "@/components/Kelola/SupplierImpor";

const page = () => {
  return <SideNavigation submenu="2" menu="2-5" konten={<SupplierImpor />} />;
};

export default page;
