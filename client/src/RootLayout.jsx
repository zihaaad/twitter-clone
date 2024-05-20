import {Outlet} from "react-router-dom";
import Sidebar from "./components/common/Sidebar";
import RightPanel from "./components/common/RightPanel";

function RootLayout() {
  return (
    <main className="flex max-w-6xl mx-auto">
      <Sidebar />
      <Outlet />
      <RightPanel />
    </main>
  );
}

export default RootLayout;
