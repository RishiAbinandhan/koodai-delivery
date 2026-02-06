import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Upload, X } from "lucide-react";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import { toast } from "sonner";
import { useOnboardingStore } from "../../store/useOnboardingStore";

/* ---------- CONSTANTS ---------- */
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ALLOWED_TYPES = ["image/jpeg", "image/png", "application/pdf"];

/* ---------- COMPONENT ---------- */
export default function Step3KYC() {
  const navigate = useNavigate();
  const setKYC = useOnboardingStore((s) => s.setKYC);

  const [aadhaar, setAadhaar] = useState<File | null>(null);
  const [pan, setPan] = useState<File | null>(null);
  const [license, setLicense] = useState<File | null>(null);

  const [previewFile, setPreviewFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);

  /* ---------- HELPERS ---------- */

  const validateFile = (file: File | null, label: string) => {
    if (!file) {
      toast.error(`${label} is required`);
      return false;
    }

    if (!ALLOWED_TYPES.includes(file.type)) {
      toast.error(`${label}: Only JPG, PNG or PDF allowed`);
      return false;
    }

    if (file.size > MAX_FILE_SIZE) {
      toast.error(`${label}: File must be under 5MB`);
      return false;
    }

    return true;
  };

  const fileToBase64 = (file: File): Promise<string> =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });

  /* ---------- SUBMIT ---------- */

  const handleNext = async () => {
    if (!validateFile(aadhaar, "Aadhaar Card")) return;
    if (!validateFile(pan, "PAN Card")) return;
    if (!validateFile(license, "Driving License")) return;

    try {
      setLoading(true);

      const aadhaarBase64 = await fileToBase64(aadhaar!);
      const panBase64 = await fileToBase64(pan!);
      const licenseBase64 = await fileToBase64(license!);

      setKYC({
        aadhaarBase64,
        panBase64,
        licenseBase64,
      });

      toast.success("Documents attached successfully");
      navigate("/onboarding/step-4");
    } catch {
      toast.error("Failed to process documents");
    } finally {
      setLoading(false);
    }
  };

  /* ---------- UPLOAD BOX ---------- */

  const UploadBox = ({
    label,
    file,
    setFile,
  }: {
    label: string;
    file: File | null;
    setFile: (file: File | null) => void;
  }) => (
    <div className="space-y-2">
      <Label>{label}</Label>

      <div className="border-2 border-dashed border-border rounded-xl p-6 bg-muted/50">
        {!file ? (
          <label className="cursor-pointer flex flex-col items-center">
            <Upload className="w-6 h-6 text-muted-foreground mb-3" />
            <p className="text-sm font-medium text-muted-foreground">
              Click to upload {label}
            </p>
            <Input
              type="file"
              className="hidden"
              onChange={(e) => setFile(e.target.files?.[0] || null)}
            />
          </label>
        ) : (
          <div className="flex items-center justify-between">
            <button
              onClick={() => setPreviewFile(file)}
              className="text-sm text-blue-600 dark:text-blue-400 underline"
            >
              {file.name}
            </button>

            <button onClick={() => setFile(null)}>
              <X className="w-4 h-4 text-destructive" />
            </button>
          </div>
        )}
      </div>
    </div>
  );

  /* ---------- UI ---------- */

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-foreground">KYC Verification</h1>

      <UploadBox label="Aadhaar Card" file={aadhaar} setFile={setAadhaar} />
      <UploadBox label="PAN Card" file={pan} setFile={setPan} />
      <UploadBox
        label="Driving License"
        file={license}
        setFile={setLicense}
      />

      <Button
        onClick={handleNext}
        disabled={loading}
        className="w-full bg-primary hover:bg-primary/90 text-primary-foreground py-6 text-lg disabled:opacity-50"
      >
        {loading ? "Processing..." : "Submit Documents"}
      </Button>

      {/* PREVIEW MODAL */}
      {previewFile && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
          <div className="bg-card p-4 rounded-xl max-w-lg w-full relative border border-border">
            <button
              className="absolute top-2 right-2"
              onClick={() => setPreviewFile(null)}
            >
              <X className="text-foreground" />
            </button>

            {previewFile.type === "application/pdf" ? (
              <iframe
                src={URL.createObjectURL(previewFile)}
                className="w-full h-[500px]"
              />
            ) : (
              <img
                src={URL.createObjectURL(previewFile)}
                className="w-full rounded-lg"
              />
            )}
          </div>
        </div>
      )}
    </div>
  );
}