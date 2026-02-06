import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { CheckCircle, Edit2 } from "lucide-react";
import { Button } from "../../components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../components/ui/card";
import { toast } from "sonner";

import { db } from "../../firebase/firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";

import { useOnboardingStore } from "../../store/useOnboardingStore";

export default function Step6Review() {
  const navigate = useNavigate();
  const [submitting, setSubmitting] = useState(false);

  const { basicInfo, permissions, vehicle, payment, kyc, reset } =
    useOnboardingStore();

  /* ---------- GUARD ---------- */
  useEffect(() => {
    if (!basicInfo || !permissions || !vehicle || !payment || !kyc) {
      toast.error("Incomplete onboarding");
      navigate("/onboarding/step-1");
    }
  }, []);

  /* ---------- HELPERS ---------- */
  const maskAccount = (acc?: string) =>
    acc ? "••••••••" + acc.slice(-4) : "";

  /* ---------- SUBMIT ---------- */
  const handleSubmit = async () => {
    if (submitting) return;

    try {
      setSubmitting(true);

      await addDoc(collection(db, "delivery"), {
        basicInfo,
        permissions,
        vehicle,
        payment,
        kyc, // Base64 documents
        status: "pending_verification",
        createdAt: serverTimestamp(),
      });

      toast.success("Application submitted!", {
        description: "Your profile is under verification.",
      });

      setTimeout(() => {
        reset();
        navigate("/welcome");
      }, 1500);
    } catch {
      toast.error("Submission failed. Try again.");
    } finally {
      setSubmitting(false);
    }
  };

  /* ---------- UI ---------- */
  /* ---------- UI ---------- */
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Review Application</h1>
        <p className="text-muted-foreground">
          Please review your details before submitting.
        </p>
      </div>

      {/* BASIC INFO */}
      <Card className="bg-card">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-base font-semibold text-foreground">
            Basic Info
          </CardTitle>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate("/onboarding/step-1")}
            className="hover:bg-accent/50"
          >
            <Edit2 className="w-4 h-4" />
          </Button>
        </CardHeader>

        <CardContent className="text-sm space-y-1 text-muted-foreground">
          <p>
            <span className="text-foreground">Name:</span>{" "}
            {basicInfo?.name}
          </p>
          <p>
            <span className="text-foreground">Phone:</span>{" "}
            {basicInfo?.phone}
          </p>
          <p>
            <span className="text-foreground">Email:</span>{" "}
            {basicInfo?.email}
          </p>
        </CardContent>
      </Card>

      {/* VEHICLE */}
      <Card className="bg-card">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-base font-semibold text-foreground">
            Vehicle
          </CardTitle>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate("/onboarding/step-4")}
            className="hover:bg-accent/50"
          >
            <Edit2 className="w-4 h-4" />
          </Button>
        </CardHeader>

        <CardContent className="text-sm space-y-1 text-muted-foreground">
          <p>
            <span className="text-foreground">Type:</span>{" "}
            {vehicle?.vehicleType}
          </p>
          <p>
            <span className="text-foreground">Plate:</span>{" "}
            {vehicle?.plate}
          </p>
          <p>
            <span className="text-foreground">DL:</span>{" "}
            {vehicle?.license}
          </p>
        </CardContent>
      </Card>

      {/* PAYMENT */}
      <Card className="bg-card">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-base font-semibold text-foreground">
            Payout
          </CardTitle>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate("/onboarding/step-5")}
            className="hover:bg-accent/50"
          >
            <Edit2 className="w-4 h-4" />
          </Button>
        </CardHeader>

        <CardContent className="text-sm space-y-1 text-muted-foreground">
          <p>
            <span className="text-foreground">
              Account Holder:
            </span>{" "}
            {payment?.holderName}
          </p>
          <p>
            <span className="text-foreground">Account:</span>{" "}
            {maskAccount(payment?.accountNo)}
          </p>
          <p>
            <span className="text-foreground">IFSC:</span>{" "}
            {payment?.ifsc}
          </p>
        </CardContent>
      </Card>

      {/* CONFIRM */}
      <div className="bg-green-50 dark:bg-green-950 p-4 rounded-xl flex items-start gap-3">
        <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400 mt-0.5" />
        <div>
          <p className="text-sm font-medium text-green-800 dark:text-green-300">
            Ready to submit?
          </p>
          <p className="text-xs text-green-600 dark:text-green-400 mt-1">
            By submitting, you confirm all details are accurate.
          </p>
        </div>
      </div>

      <Button
        onClick={handleSubmit}
        disabled={submitting}
        className="w-full bg-primary hover:bg-primary/90 text-primary-foreground py-6 text-lg font-medium disabled:opacity-50"
      >
        {submitting ? "Submitting..." : "Submit Application"}
      </Button>
    </div>
  );
}