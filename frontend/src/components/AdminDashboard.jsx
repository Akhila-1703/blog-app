import { Outlet } from "react-router";

import { pageWrapper } from "../styles/common";

function AdminDashboard() {

  return (

    <div className={pageWrapper}>

      <Outlet />

    </div>
  );
}

export default AdminDashboard;