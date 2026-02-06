import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Phone, ArrowLeft } from "lucide-react";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "../../components/ui/input-otp";
import { toast } from "sonner";

export default function Login() {
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const isSignup = params.get("mode") === "signup";

  const [step, setStep] = useState<"phone" | "otp">("phone");
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setStep("phone");
    setOtp("");
  }, [isSignup]);

  const sendOTP = () => {
    if (!/^[6-9]\d{9}$/.test(phone)) {
      toast.error("Enter a valid 10-digit mobile number");
      return;
    }

    setLoading(true);
    setTimeout(() => {
      toast.success("OTP Sent", { description: "Use 123456 (mock)" });
      setStep("otp");
      setLoading(false);
    }, 1200);
  };

  const verifyOTP = () => {
    if (otp !== "123456") {
      toast.error("Invalid OTP", { description: "Try 123456" });
      return;
    }

    toast.success(isSignup ? "Mobile Verified" : "Login Successful");

    setTimeout(() => {
      if (isSignup) {
        navigate("/onboarding/step-1");
      } else {
        navigate("/dashboard");
      }
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <div className="p-4">
        <button
          onClick={() => navigate("/")}
          className="flex items-center gap-2 text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="w-5 h-5" />
          Back
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 flex flex-col items-center px-4">
        <h1 className="text-2xl font-bold text-foreground mb-2 mt-6">
          {isSignup ? "Partner Registration" : "Partner Login"}
        </h1>

        <p className="text-muted-foreground text-center mb-8">
          {step === "phone"
            ? "Enter your mobile number to continue"
            : `Verify OTP sent to +91 ${phone}`}
        </p>

        <div className="w-full max-w-md space-y-6">
          {step === "phone" ? (
            <>
              <div className="flex gap-2">
                <div className="w-14 flex items-center justify-center bg-card border border-border rounded-xl text-foreground">
                  +91
                </div>
                <div className="relative flex-1">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground w-4 h-4" />
                  <Input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="9876543210"
                    maxLength={10}
                    className="pl-9 py-6 rounded-xl"
                    disabled={loading}
                  />
                </div>
              </div>

              <Button
                onClick={sendOTP}
                disabled={loading || phone.length !== 10}
                className="w-full bg-primary hover:bg-primary/90 text-primary-foreground py-6 rounded-xl"
              >
                {loading ? "Sending OTP..." : "Get OTP"}
              </Button>
            </>
          ) : (
            <>
              <div className="flex justify-center">
                <InputOTP value={otp} onChange={setOtp} maxLength={6}>
                  <InputOTPGroup>
                    {[...Array(6)].map((_, i) => (
                      <InputOTPSlot
                        key={i}
                        index={i}
                        className="w-12 h-12 border-2 rounded-xl border-border bg-card text-foreground"
                      />
                    ))}
                  </InputOTPGroup>
                </InputOTP>
              </div>

              <Button
                onClick={verifyOTP}
                disabled={otp.length !== 6}
                className="w-full bg-primary hover:bg-primary/90 text-primary-foreground py-6 rounded-xl"
              >
                Verify & Continue
              </Button>

              <Button
                variant="ghost"
                onClick={() => setStep("phone")}
                className="w-full text-foreground hover:bg-accent"
              >
                Change Number
              </Button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
