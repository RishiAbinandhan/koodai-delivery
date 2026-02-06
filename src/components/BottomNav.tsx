import { useNavigate, useLocation } from "react-router-dom";
import { Home, Package, DollarSign, User } from "lucide-react";

export function BottomNav() {
  const navigate = useNavigate();
  const location = useLocation();

  const navItems = [
    {
      path: "/dashboard",
      icon: Home,
      label: "Home",
    },
    {
      path: "/dashboard/orders",
      icon: Package,
      label: "Orders",
    },
    {
      path: "/dashboard/earnings",
      icon: DollarSign,
      label: "Earnings",
    },
    {
      path: "/dashboard/profile",
      icon: User,
      label: "Profile",
    },
  ];

  const isActive = (path: string) => {
    if (path === "/dashboard") {
      return location.pathname === "/dashboard";
    }
    return location.pathname.startsWith(path);
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-card border-t border-border">
      <div className="flex justify-around max-w-md mx-auto py-3">
        {navItems.map((item) => {
          const active = isActive(item.path);

          return (
            <button
              key={item.path}
              onClick={() => navigate(item.path)}
              className="flex flex-col items-center gap-1"
            >
              <div
                className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all
                  ${active
                    ? "bg-primary"
                    : "bg-muted"
                  }`}
              >
                <item.icon
                  className={`w-5 h-5 ${active
                      ? "text-primary-foreground"
                      : "text-muted-foreground"
                    }`}
                />
              </div>

              <span
                className={`text-xs font-medium ${active
                    ? "text-foreground"
                    : "text-muted-foreground"
                  }`}
              >
                {item.label}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}