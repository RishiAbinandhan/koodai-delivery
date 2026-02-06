import { useState } from "react";
import { Moon, Sun, Bell, Power, Trash2, Languages } from "lucide-react";
import { Card, CardContent } from "../../components/ui/card";
import { Switch } from "../../components/ui/switch";
import { Button } from "../../components/ui/button";
import { toast } from "sonner";
import { useTheme } from "../../context/ThemeContext";

export default function AppSettings() {
  const { isDark, toggleTheme } = useTheme();
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [autoOnline, setAutoOnline] = useState(false);
  const [language, setLanguage] = useState("English");

  const clearAppData = () => {
    localStorage.clear();
    toast.success("App data cleared");
    setTimeout(() => window.location.reload(), 800);
  };

  return (
    <div className="flex flex-col min-h-screen bg-background pb-20">
      {/* Header */}
      <div className="bg-background p-4 border-b border-border">
        <h1 className="text-lg font-bold text-foreground">
          App Settings
        </h1>
        <p className="text-sm text-muted-foreground">
          Customize your app experience
        </p>
      </div>

      <div className="p-4 space-y-4">
        {/* Preferences */}
        <Card className="border-none rounded-2xl bg-card">
          <CardContent className="p-0 divide-y divide-border">
            <SettingRow
              icon={isDark ? Moon : Sun}
              label="Dark Mode"
              description="Switch between light & dark theme"
            >
              <Switch checked={isDark} onCheckedChange={toggleTheme} />
            </SettingRow>

            <SettingRow
              icon={Bell}
              label="Sound Alerts"
              description="Play sound for new orders"
            >
              <Switch
                checked={soundEnabled}
                onCheckedChange={setSoundEnabled}
              />
            </SettingRow>

            <SettingRow
              icon={Power}
              label="Auto Go Online"
              description="Automatically go online when app opens"
            >
              <Switch
                checked={autoOnline}
                onCheckedChange={setAutoOnline}
              />
            </SettingRow>
          </CardContent>
        </Card>

        {/* Language */}
        <Card className="border-none rounded-2xl bg-card">
          <CardContent className="p-0">
            <SettingRow
              icon={Languages}
              label="Language"
              description="Select your preferred language"
            >
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                className="text-sm bg-transparent text-foreground outline-none"
              >
                <option>English</option>
                <option>Tamil</option>
                <option>Hindi</option>
              </select>
            </SettingRow>
          </CardContent>
        </Card>

        {/* Clear Data */}
        <Button
          variant="outline"
          className="w-full border-red-200 dark:border-red-900
            text-red-600 dark:text-red-400
            hover:bg-red-50 dark:hover:bg-red-500/10"
          onClick={clearAppData}
        >
          <Trash2 className="w-4 h-4 mr-2" />
          Clear App Data
        </Button>
      </div>
    </div>
  );
}

/* ---------- Row Component ---------- */

function SettingRow({
  icon: Icon,
  label,
  description,
  children,
}: {
  icon: any;
  label: string;
  description: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex items-center justify-between px-4 py-4">
      <div className="flex items-center gap-3">
        <div className="p-2 rounded-lg bg-yellow-100 dark:bg-yellow-500/20">
          <Icon className="w-5 h-5 text-yellow-700 dark:text-yellow-400" />
        </div>
        <div>
          <p className="text-sm font-medium text-foreground">
            {label}
          </p>
          <p className="text-xs text-muted-foreground">
            {description}
          </p>
        </div>
      </div>
      {children}
    </div>
  );
}