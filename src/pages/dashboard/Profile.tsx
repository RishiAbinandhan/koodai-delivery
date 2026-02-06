import { useNavigate } from "react-router-dom";
import {
  User,
  Truck,
  Settings,
  HelpCircle,
  LogOut,
  ChevronRight,
} from "lucide-react";
import { Button } from "../../components/ui/button";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "../../components/ui/avatar";
import { Card, CardContent } from "../../components/ui/card";
import { toast } from "sonner";

export default function Profile() {
  const navigate = useNavigate();

  const handleLogout = () => {
    toast.info("Logging out...");
    setTimeout(() => navigate("/"), 1000);
  };

  const menuItems = [
    {
      icon: User,
      label: "Personal Details",
      path: "/onboarding/step-6",
    },
    {
      icon: Truck,
      label: "Vehicle Information",
      path: "/onboarding/step-4",
    },
    {
      icon: Settings,
      label: "App Settings",
      path: "/dashboard/settings",
    },
    {
      icon: HelpCircle,
      label: "Help & Support",
      path: "#",
    },
  ];

  return (
    <div className="flex flex-col min-h-screen bg-background pb-20">
      {/* Header */}
      <div className="bg-background p-6 pb-8 border-b border-border text-center">
        <Avatar className="w-24 h-24 mx-auto mb-4 ring-4 ring-yellow-200 dark:ring-yellow-500/30">
          <AvatarImage src="https://github.com/shadcn.png" />
          <AvatarFallback>JD</AvatarFallback>
        </Avatar>

        <h1 className="text-xl font-bold text-foreground">
          John Doe
        </h1>
        <p className="text-sm text-muted-foreground">
          +91 98765 43210
        </p>

        <div className="mt-5 flex justify-center gap-6">
          <Stat label="Rating" value="4.8" />
          <Divider />
          <Stat label="Trips" value="1,240" />
          <Divider />
          <Stat label="Years" value="2.5" />
        </div>
      </div>

      {/* Menu */}
      <div className="p-4 space-y-4">
        <Card className="border-none rounded-2xl bg-card overflow-hidden">
          <CardContent className="p-0 divide-y divide-border">
            {menuItems.map((item, index) => (
              <button
                key={index}
                onClick={() =>
                  item.path !== "#" && navigate(item.path)
                }
                className="w-full flex items-center justify-between px-4 py-4
                  hover:bg-accent/50 transition"
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-yellow-100 dark:bg-yellow-500/20">
                    <item.icon className="w-5 h-5 text-yellow-700 dark:text-yellow-400" />
                  </div>
                  <span className="text-sm font-medium text-foreground">
                    {item.label}
                  </span>
                </div>
                <ChevronRight className="w-4 h-4 text-muted-foreground" />
              </button>
            ))}
          </CardContent>
        </Card>

        {/* Logout */}
        <Button
          variant="outline"
          className="w-full py-6 border-red-200 text-red-600
            hover:bg-red-50 dark:hover:bg-red-500/10"
          onClick={handleLogout}
        >
          <LogOut className="w-4 h-4 mr-2" />
          Logout
        </Button>

        <p className="text-center text-xs text-muted-foreground mt-6">
          App Version 1.0.0 (Build 2024)
        </p>
      </div>
    </div>
  );
}

/* Small helpers */

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="text-center">
      <p className="font-bold text-lg text-foreground">
        {value}
      </p>
      <p className="text-xs text-muted-foreground">
        {label}
      </p>
    </div>
  );
}

function Divider() {
  return <div className="w-px bg-border" />;
}