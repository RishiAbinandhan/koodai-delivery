import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { MapPin, Camera, Bell } from "lucide-react";
import { Button } from "../../components/ui/button";
import { Checkbox } from "../../components/ui/checkbox";
import { Label } from "../../components/ui/label";
import { Card, CardContent } from "../../components/ui/card";
import { toast } from "sonner";
import { useOnboardingStore } from "../../store/useOnboardingStore";

export default function Step2Permissions() {
  const navigate = useNavigate();
  const setPermissions = useOnboardingStore((s) => s.setPermissions);

  /* ---------- STATE ---------- */
  const [cameraAllowed, setCameraAllowed] = useState(true);
  const [notificationAllowed, setNotificationAllowed] = useState(true);

  // GPS is mandatory and always enabled
  const gpsAllowed = true;

  /* ---------- NEXT ---------- */
  const handleNext = () => {
    if (!cameraAllowed) {
      toast.error("Camera permission is required to continue");
      return;
    }

    if (!notificationAllowed) {
      toast.error("Notification permission is required to continue");
      return;
    }

    /* SAVE TO STORE */
    setPermissions({
      cameraAllowed,
      notificationAllowed,
      gpsAllowed,
    });

    navigate("/onboarding/step-3");
  };

  /* ---------- UI ---------- */
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">System Permissions</h1>
        <p className="text-muted-foreground">
          We need access to these features to provide the delivery service.
        </p>
      </div>

      <div className="space-y-4">
        {/* GPS */}
        <Card className="bg-card">
          <CardContent className="flex items-start gap-4 p-4">
            <div className="p-2 bg-yellow-100 dark:bg-yellow-500/20 rounded-lg">
              <MapPin className="w-6 h-6 text-yellow-700 dark:text-yellow-400" />
            </div>

            <div className="flex-1 space-y-1">
              <div className="flex items-center justify-between">
                <Label className="text-base font-semibold text-foreground">
                  Location (GPS)
                </Label>
                <Checkbox checked disabled />
              </div>

              <p className="text-sm text-muted-foreground">
                Required for order assignment and navigation.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* CAMERA */}
        <Card className="bg-card">
          <CardContent className="flex items-start gap-4 p-4">
            <div className="p-2 bg-yellow-100 dark:bg-yellow-500/20 rounded-lg">
              <Camera className="w-6 h-6 text-yellow-700 dark:text-yellow-400" />
            </div>

            <div className="flex-1 space-y-1">
              <div className="flex items-center justify-between">
                <Label className="text-base font-semibold text-foreground">
                  Camera Access
                </Label>

                <Checkbox
                  checked={cameraAllowed}
                  onCheckedChange={(v) =>
                    setCameraAllowed(Boolean(v))
                  }
                />
              </div>

              <p className="text-sm text-muted-foreground">
                Required to capture proof of delivery.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* NOTIFICATIONS */}
        <Card className="bg-card">
          <CardContent className="flex items-start gap-4 p-4">
            <div className="p-2 bg-yellow-100 dark:bg-yellow-500/20 rounded-lg">
              <Bell className="w-6 h-6 text-yellow-700 dark:text-yellow-400" />
            </div>

            <div className="flex-1 space-y-1">
              <div className="flex items-center justify-between">
                <Label className="text-base font-semibold text-foreground">
                  Notifications
                </Label>

                <Checkbox
                  checked={notificationAllowed}
                  onCheckedChange={(v) =>
                    setNotificationAllowed(Boolean(v))
                  }
                />
              </div>

              <p className="text-sm text-muted-foreground">
                Required to receive order alerts.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      <Button
        onClick={handleNext}
        disabled={!cameraAllowed || !notificationAllowed}
        className="w-full bg-primary hover:bg-primary/90 text-primary-foreground py-6 text-lg font-medium disabled:opacity-50"
      >
        Grant Permissions & Continue
      </Button>
    </div>
  );
}