import { useNavigate } from "react-router-dom";
import { Truck } from "lucide-react";
import { Button } from "../../components/ui/button";

export default function Welcome() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center px-6">
      {/* Logo */}
      <div className="w-20 h-20 bg-primary rounded-3xl flex items-center justify-center shadow-lg mb-6">
        <Truck className="w-10 h-10 text-primary-foreground" />
      </div>

      {/* Title */}
      <h1 className="text-3xl font-bold text-foreground mb-2">
        KOODAI DELIVERY
      </h1>
      <p className="text-muted-foreground text-center mb-10">
        Delivery Partner App. Join the fleet.
      </p>

      {/* Actions */}
      <div className="w-full max-w-sm space-y-4">
        <Button
          onClick={() => navigate("/login")}
          className="w-full bg-primary hover:bg-primary/90 text-primary-foreground py-6 rounded-xl shadow-lg font-medium"
        >
          Login
        </Button>

        <div className="flex items-center my-2">
          <div className="flex-1 border-t border-border" />
          <span className="mx-3 text-sm text-muted-foreground"><b>OR</b></span>
          <div className="flex-1 border-t border-border" />
        </div>

        <Button
          onClick={() => navigate("/onboarding/step-1")}
          variant="outline"
          className="w-full border-primary text-primary hover:bg-primary/10 py-6 rounded-xl shadow-lg font-medium"
        >
          Register as Partner
        </Button>
      </div>
    </div>
  );
}
