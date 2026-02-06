import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import { Textarea } from "../../components/ui/textarea";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "../../components/ui/input-otp";
import { toast } from "sonner";
import { useOnboardingStore } from "../../store/useOnboardingStore";

export default function Step1BasicInfo() {
  const navigate = useNavigate();
  const setBasicInfo = useOnboardingStore((s) => s.setBasicInfo);

  /* ---------- STATE ---------- */
  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  const [emergency, setEmergency] = useState("");
  const [email, setEmail] = useState("");

  const [phone, setPhone] = useState("");
  const [phoneOTP, setPhoneOTP] = useState("");
  const [phoneOTPSent, setPhoneOTPSent] = useState(false);
  const [phoneVerified, setPhoneVerified] = useState(false);
  const [phoneTimer, setPhoneTimer] = useState(0);

  /* ---------- OTP TIMER ---------- */
  useEffect(() => {
    if (phoneTimer <= 0) return;
    const interval = setInterval(() => {
      setPhoneTimer((t) => t - 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [phoneTimer]);

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s.toString().padStart(2, "0")}`;
  };

  /* ---------- SEND OTP (MOCK) ---------- */
  const sendPhoneOTP = () => {
    if (!/^[6-9]\d{9}$/.test(phone)) {
      toast.error("Enter a valid 10-digit mobile number");
      return;
    }

    setPhoneOTPSent(true);
    setPhoneTimer(60);
    setPhoneOTP("");

    toast.success("OTP sent", {
      description: "Use 111111 (mock verification)",
    });
  };

  /* ---------- VERIFY OTP ---------- */
  const confirmPhoneOTP = () => {
    if (phoneOTP.length !== 6) {
      toast.error("Enter 6-digit OTP");
      return;
    }

    if (phoneOTP !== "111111") {
      toast.error("Invalid OTP");
      return;
    }

    setPhoneVerified(true);
    setPhoneTimer(0);
    toast.success("Mobile number verified");
  };

  /* ---------- NEXT ---------- */
  const handleNext = () => {
    const normalizedName = name.replace(/\s+/g, " ").trim();
    const normalizedAddress = address.trim();
    const normalizedEmail = email.trim();

    if (!normalizedName) {
      toast.error("Full name is required");
      return;
    }

    if (!normalizedAddress) {
      toast.error("Address is required");
      return;
    }

    if (!phoneVerified) {
      toast.error("Please verify your mobile number");
      return;
    }

    if (!/^\S+@\S+\.\S+$/.test(normalizedEmail)) {
      toast.error("Enter a valid email address");
      return;
    }

    /* SAVE TO STORE */
    setBasicInfo({
      name: normalizedName,
      address: normalizedAddress,
      emergency,
      phone,
      email: normalizedEmail,
    });

    navigate("/onboarding/step-2");
  };

  /* ---------- UI ---------- */
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-foreground">Basic Information</h1>

      <div className="space-y-4">
        {/* NAME */}
        <div>
          <Label className="text-foreground">Full Name</Label>
          <Input
            value={name}
            onChange={(e) =>
              setName(e.target.value.replace(/[^A-Za-z ]/g, ""))
            }
            placeholder="Enter your full name"
          />
        </div>

        {/* ADDRESS */}
        <div>
          <Label className="text-foreground">Current Address</Label>
          <Textarea
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            placeholder="House No, Street, City"
          />
        </div>

        {/* EMERGENCY */}
        <div>
          <Label className="text-foreground">Emergency Contact (Optional)</Label>
          <Input
            value={emergency}
            maxLength={10}
            onChange={(e) =>
              setEmergency(e.target.value.replace(/\D/g, ""))
            }
            placeholder="10-digit number"
          />
        </div>

        {/* PHONE */}
        <div className="space-y-2">
          <Label className="text-foreground">Mobile Number</Label>

          <div className="flex gap-2">
            <Input
              value={phone}
              disabled={phoneVerified}
              maxLength={10}
              onChange={(e) =>
                setPhone(e.target.value.replace(/\D/g, ""))
              }
              placeholder="Enter mobile number"
            />

            <Button
              onClick={sendPhoneOTP}
              disabled={phoneVerified || phoneTimer > 0}
              className="bg-primary hover:bg-primary/90 text-primary-foreground"
            >
              {phoneTimer > 0 ? formatTime(phoneTimer) : "Verify"}
            </Button>
          </div>

          {phoneOTPSent && !phoneVerified && (
            <div className="space-y-2">
              <InputOTP
                value={phoneOTP}
                onChange={setPhoneOTP}
                maxLength={6}
              >
                <InputOTPGroup>
                  {[...Array(6)].map((_, i) => (
                    <InputOTPSlot key={i} index={i} />
                  ))}
                </InputOTPGroup>
              </InputOTP>

              <div className="flex gap-2">
                <Button
                  className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground"
                  onClick={confirmPhoneOTP}
                >
                  Confirm OTP
                </Button>

                <Button
                  variant="outline"
                  className="flex-1"
                  disabled={phoneTimer > 0}
                  onClick={sendPhoneOTP}
                >
                  Resend OTP
                </Button>
              </div>
            </div>
          )}
        </div>

        {/* EMAIL */}
        <div>
          <Label className="text-foreground">Email Address</Label>
          <Input
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="example@mail.com"
          />
        </div>
      </div>

      <Button
        onClick={handleNext}
        className="w-full bg-primary hover:bg-primary/90 text-primary-foreground py-6"
      >
        Save & Continue
      </Button>
    </div>
  );
}