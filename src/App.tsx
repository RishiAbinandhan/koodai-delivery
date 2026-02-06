import { Toaster } from "./components/ui/sonner";
import AppRoutes from "./routes/AppRoutes";

export default function App() {
  return (
    // App shell (mobile container)
    <div className="min-h-screen bg-background text-foreground font-sans antialiased">
      <div className="max-w-md mx-auto relative bg-background min-h-screen shadow-xl border-x">
        <AppRoutes />
      </div>
      <Toaster position="top-center" />
    </div>
  );
}
