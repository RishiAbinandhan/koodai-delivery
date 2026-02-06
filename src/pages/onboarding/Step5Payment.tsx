import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import { toast } from "sonner";
import { useOnboardingStore } from "../../store/useOnboardingStore";

export default function Step5Payment() {
  const navigate = useNavigate();
  const setPayment = useOnboardingStore((s) => s.setPayment);

  const [mounted, setMounted] = useState(false);

  const [holderName, setHolderName] = useState("");
  const [accountNo, setAccountNo] = useState("");
  const [confirmAccountNo, setConfirmAccountNo] = useState("");
  const [ifsc, setIfsc] = useState("");
  const [upi, setUpi] = useState("");

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleNext = () => {

    if (!/^[A-Za-z ]+$/.test(holderName.trim())) {
      toast.error("Enter valid account holder name");
      return;
    }

    if (!/^\d{9,18}$/.test(accountNo)) {
      toast.error("Account number must be 9–18 digits");
      return;
    }

    if (accountNo !== confirmAccountNo) {
      toast.error("Account numbers do not match");
      return;
    }

    if (!/^[A-Z]{4}0[A-Z0-9]{6}$/.test(ifsc)) {
      toast.error("Enter valid IFSC code");
      return;
    }

    if (upi && !/^[a-zA-Z0-9.\-_]{2,256}@[a-zA-Z]{2,64}$/.test(upi)) {
      toast.error("Enter valid UPI ID");
      return;
    }

    // ✅ SAVE TO STORE
    setPayment({
      holderName,
      accountNo,
      ifsc,
      upi,
    });

    toast.success("Payout details saved");

    navigate("/onboarding/step-6");
  };

  if (!mounted) return null;

  return (
    <form autoComplete="off" className="space-y-6">

      <input type="text" name="fakeusernameremembered" hidden />
      <input type="password" name="fakepasswordremembered" hidden />

      <div>
        <h1 className="text-2xl font-bold text-foreground">Payout Details</h1>
        <p className="text-muted-foreground">
          Add bank account to receive earnings.
        </p>
      </div>

      <div className="space-y-4">

        <div>
          <Label className="text-foreground">Account Holder Name</Label>
          <Input
            autoComplete="new-password"
            value={holderName}
            onChange={(e) => setHolderName(e.target.value)}
            placeholder="Name as per Passbook"
          />
        </div>

        <div>
          <Label className="text-foreground">Bank Account Number</Label>
          <Input
            type="password"
            autoComplete="new-password"
            value={accountNo}
            onChange={(e) => setAccountNo(e.target.value)}
            placeholder="Enter Account Number"
          />
        </div>

        <div>
          <Label className="text-foreground">Confirm Account Number</Label>
          <Input
            autoComplete="new-password"
            value={confirmAccountNo}
            onChange={(e) => setConfirmAccountNo(e.target.value)}
            placeholder="Re-enter Account Number"
          />
        </div>

        <div>
          <Label className="text-foreground">IFSC Code</Label>
          <Input
            autoComplete="new-password"
            value={ifsc}
            onChange={(e) => setIfsc(e.target.value.toUpperCase())}
            placeholder="SBIN0001234"
          />
        </div>

        <div>
          <Label className="text-foreground">UPI ID (Optional)</Label>
          <Input
            autoComplete="off"
            value={upi}
            onChange={(e) => setUpi(e.target.value)}
            placeholder="username@bank"
          />
        </div>

      </div>

      <Button
        type="button"
        onClick={handleNext}
        className="w-full bg-primary hover:bg-primary/90 text-primary-foreground py-6 text-lg"
      >
        Save Payout Details
      </Button>
    </form>
  );
}