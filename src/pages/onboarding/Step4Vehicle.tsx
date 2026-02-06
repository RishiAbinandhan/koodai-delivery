import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../components/ui/select";
import { toast } from "sonner";
import { useOnboardingStore } from "../../store/useOnboardingStore";

export default function Step4Vehicle() {
  const navigate = useNavigate();
  const setVehicle = useOnboardingStore((s) => s.setVehicle);

  /* ---------- STATE ---------- */
  const [vehicleType, setVehicleType] = useState("bike");
  const [plate, setPlate] = useState("");
  const [model, setModel] = useState("");
  const [license, setLicense] = useState("");

  /* ---------- NEXT ---------- */
  const handleNext = () => {
    const normalizedPlate = plate.replace(/\s+/g, " ").trim();
    const normalizedModel = model.trim();
    const normalizedLicense = license.replace(/\s+/g, "").trim();

    if (!vehicleType) {
      toast.error("Please select a vehicle type");
      return;
    }

    const plateRegex = /^[A-Z]{2}\s?\d{1,2}\s?[A-Z]{1,2}\s?\d{3,4}$/;
    if (!plateRegex.test(normalizedPlate)) {
      toast.error("Enter valid vehicle number (TN 01 AB 1234)");
      return;
    }

    if (!normalizedModel) {
      toast.error("Vehicle model is required");
      return;
    }

    const licenseRegex =
      /^(?:[A-Z]{2}-\d{2}-\d{4}-\d{7}|[A-Z]{2}\d{2}\d{4}\d{8})$/;

    if (!licenseRegex.test(normalizedLicense)) {
      toast.error(
        "Enter valid DL number (TN77202400002053 or TN-01-2020-1234567)"
      );
      return;
    }

    /* SAVE TO STORE */
    setVehicle({
      vehicleType,
      plate: normalizedPlate,
      model: normalizedModel,
      license: normalizedLicense,
    });

    toast.success("Vehicle details saved");
    navigate("/onboarding/step-5");
  };

  /* ---------- UI ---------- */
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Vehicle Details</h1>
        <p className="text-muted-foreground">
          Register your delivery vehicle.
        </p>
      </div>

      <div className="space-y-4">
        {/* VEHICLE TYPE */}
        <div className="space-y-2">
          <Label className="text-foreground">Vehicle Type</Label>
          <Select value={vehicleType} onValueChange={setVehicleType}>
            <SelectTrigger>
              <SelectValue placeholder="Select Vehicle" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="bike">Motorcycle / Bike</SelectItem>
              <SelectItem value="scooter">Scooter</SelectItem>
              <SelectItem value="ev">Electric Vehicle</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* NUMBER PLATE */}
        <div className="space-y-2">
          <Label className="text-foreground">Vehicle Number Plate</Label>
          <Input
            value={plate}
            onChange={(e) =>
              setPlate(
                e.target.value.replace(/[^A-Z0-9\s]/gi, "").toUpperCase()
              )
            }
            placeholder="TN 01 AB 1234"
            className="uppercase"
          />
        </div>

        {/* MODEL */}
        <div className="space-y-2">
          <Label className="text-foreground">Vehicle Model</Label>
          <Input
            value={model}
            onChange={(e) => setModel(e.target.value)}
            placeholder="Honda Activa 6G"
          />
        </div>

        {/* DRIVING LICENSE */}
        <div className="space-y-2">
          <Label className="text-foreground">Driving License Number</Label>
          <Input
            value={license}
            onChange={(e) =>
              setLicense(
                e.target.value.replace(/[^A-Z0-9-]/gi, "").toUpperCase()
              )
            }
            placeholder="TN77202400002053"
            className="uppercase"
          />
        </div>
      </div>

      <Button
        onClick={handleNext}
        disabled={!plate || !model || !license}
        className="w-full bg-primary hover:bg-primary/90 text-primary-foreground py-6 text-lg disabled:opacity-50"
      >
        Save Vehicle Details
      </Button>
    </div>
  );
}