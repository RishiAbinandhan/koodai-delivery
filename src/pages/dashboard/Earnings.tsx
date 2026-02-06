import { TrendingUp, Wallet, CreditCard } from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../components/ui/card";
import { Button } from "../../components/ui/button";

export default function Earnings() {
  return (
    <div className="flex flex-col min-h-screen bg-background pb-20">
      {/* Header */}
      <div className="bg-primary text-primary-foreground p-6 pb-12 rounded-b-3xl">
        <h1 className="text-sm font-medium text-yellow-900 mb-1">
          Total Earnings
        </h1>

        <div className="flex items-end gap-2 mb-6">
          <span className="text-4xl font-bold">₹12,450</span>
          <span className="text-sm text-green-700 mb-1 flex items-center gap-1">
            <TrendingUp className="w-4 h-4" /> +15%
          </span>
        </div>

        <div className="flex gap-4">
          <Button className="flex-1 bg-black/90 text-white hover:bg-black">
            <Wallet className="w-4 h-4 mr-2" />
            Withdraw
          </Button>

          <Button
            variant="outline"
            className="flex-1 border-black/30 text-black hover:bg-black/10"
          >
            <CreditCard className="w-4 h-4 mr-2" />
            History
          </Button>
        </div>
      </div>

      {/* Content */}
      <div className="p-4 -mt-6 space-y-5">
        {/* Weekly Breakdown */}
        <Card className="border-none rounded-2xl bg-card">
          <CardHeader>
            <CardTitle className="text-base text-foreground">
              Weekly Breakdown
            </CardTitle>
          </CardHeader>

          <CardContent>
            <div className="flex items-end justify-between h-32 gap-2">
              {[30, 45, 25, 60, 75, 50, 65].map((h, i) => (
                <div
                  key={i}
                  className="flex-1 flex flex-col items-center gap-2"
                >
                  <div className="w-full bg-yellow-100 dark:bg-yellow-500/20 rounded-lg relative overflow-hidden">
                    <div
                      style={{ height: `${h}%` }}
                      className="absolute bottom-0 w-full bg-yellow-400 rounded-lg"
                    />
                  </div>
                  <span className="text-[10px] text-muted-foreground">
                    {["M", "T", "W", "T", "F", "S", "S"][i]}
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Recent Payouts */}
        <h2 className="font-bold text-lg px-1 text-foreground">
          Recent Payouts
        </h2>

        {[1, 2, 3].map((_, i) => (
          <Card
            key={i}
            className="border-none rounded-xl bg-card"
          >
            <CardContent className="p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-yellow-100 dark:bg-yellow-500/20 rounded-full">
                  <Wallet className="w-5 h-5 text-yellow-700 dark:text-yellow-400" />
                </div>

                <div>
                  <p className="font-medium text-sm text-foreground">
                    Weekly Payout
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Oct {20 - i * 7}, 2024
                  </p>
                </div>
              </div>

              <p className="font-bold text-green-700 dark:text-green-400">
                + ₹3,200
              </p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}