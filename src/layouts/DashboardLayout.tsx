import { Outlet } from "react-router-dom";
import { BottomNav } from "../components/BottomNav";

export default function DashboardLayout() {
  return (
    <div className="min-h-screen bg-background flex justify-center">
      {/* Mobile container */}
      <div className="w-full max-w-[420px] bg-background relative pb-20">
        <Outlet />
        <BottomNav />
      </div>
    </div>
  );
}