import { Calendar } from "lucide-react";
import { Badge } from "../../components/ui/badge";
import { Card, CardContent } from "../../components/ui/card";

export default function Orders() {
  const orders = [
    {
      id: "ORD-9921",
      date: "Today, 10:30 AM",
      amount: "₹85",
      status: "Delivered",
      from: "Hotel Saravana Bhavan",
      to: "Anna Nagar",
    },
    {
      id: "ORD-9920",
      date: "Today, 09:15 AM",
      amount: "₹120",
      status: "Delivered",
      from: "A2B Sweets",
      to: "Koyambedu",
    },
    {
      id: "ORD-9918",
      date: "Yesterday",
      amount: "₹65",
      status: "Delivered",
      from: "Sangeetha Veg",
      to: "Vadapalani",
    },
    {
      id: "ORD-9915",
      date: "Yesterday",
      amount: "₹45",
      status: "Cancelled",
      from: "KFC",
      to: "Ashok Nagar",
    },
  ];

  return (
    <div className="flex flex-col min-h-screen bg-background pb-20">
      {/* Header */}
      <div className="bg-background p-4 sticky top-0 z-10 border-b border-border">
        <h1 className="text-lg font-bold text-foreground">Past Orders</h1>
      </div>

      <div className="p-4 space-y-4">
        {orders.map((order) => (
          <Card
            key={order.id}
            className="border-none rounded-2xl bg-card"
          >
            <CardContent className="p-4 space-y-3">
              {/* Top Row */}
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-sm font-bold text-foreground">
                    {order.id}
                  </p>
                  <div className="flex items-center gap-1 text-xs text-muted-foreground mt-1">
                    <Calendar className="w-3 h-3" />
                    {order.date}
                  </div>
                </div>

                <div className="text-right">
                  <p className="font-bold text-foreground">
                    {order.amount}
                  </p>
                  <Badge
                    className={
                      order.status === "Delivered"
                        ? "bg-green-100 text-green-800 dark:bg-green-500/20 dark:text-green-400"
                        : "bg-red-100 text-red-800 dark:bg-red-500/20 dark:text-red-400"
                    }
                  >
                    {order.status}
                  </Badge>
                </div>
              </div>

              {/* Route */}
              <div className="relative pl-4 space-y-3 border-l-2 border-dashed border-border">
                <RoutePoint
                  color="green"
                  label={order.from}
                />
                <RoutePoint
                  color="red"
                  label={order.to}
                />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

function RoutePoint({
  color,
  label,
}: {
  color: "green" | "red";
  label: string;
}) {
  return (
    <div className="relative">
      <span
        className={`absolute -left-[9px] top-1 w-2.5 h-2.5 rounded-full border-2 border-card ${color === "green" ? "bg-green-500" : "bg-red-500"
          }`}
      />
      <p className="text-xs font-medium text-foreground">{label}</p>
    </div>
  );
}