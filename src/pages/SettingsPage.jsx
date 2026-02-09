import { useState } from "react";
import { useI18n } from "@/contexts/I18nContext";
import { LanguageSelector } from "@/components/LanguageSelector";
import { User, Globe, Sliders, Save, Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";

export default function SettingsPage() {
  const { t } = useI18n();
  const [profile, setProfile] = useState({
    name: "Admin User",
    email: "admin@speechapp.app",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [notifications, setNotifications] = useState({
    emailAlerts: true,
    weeklyReports: true,
    newChildAlerts: false,
  });

  const handleSaveProfile = () => {
    toast.success("Profile saved successfully!");
  };

  const handleSaveNotifications = () => {
    toast.success("Notification preferences saved!");
  };

  return (
    <div className="space-y-6 max-w-2xl">
      {/* Profile */}
      <div className="bg-card rounded-2xl shadow-card border border-border p-6 space-y-4">
        <div className="flex items-center gap-3 mb-2">
          <div className="h-10 w-10 rounded-xl bg-primary flex items-center justify-center">
            <User className="h-5 w-5 text-primary-foreground" />
          </div>
          <h3 className="font-bold text-foreground">Admin Profile</h3>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>Name</Label>
            <Input 
              value={profile.name}
              onChange={(e) => setProfile({ ...profile, name: e.target.value })}
            />
          </div>
          <div className="space-y-2">
            <Label>{t("email")}</Label>
            <Input 
              value={profile.email}
              onChange={(e) => setProfile({ ...profile, email: e.target.value })}
            />
          </div>
        </div>
        <div className="space-y-2">
          <Label>Change Password</Label>
          <div className="relative">
            <Input 
              type={showPassword ? "text" : "password"}
              placeholder="Enter new password..."
              className="pr-10"
            />
            <button 
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
            >
              {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>
        </div>
        <Button size="sm" onClick={handleSaveProfile} className="gap-1.5">
          <Save className="h-4 w-4" /> {t("save")}
        </Button>
      </div>

      {/* Language */}
      <div className="bg-card rounded-2xl shadow-card border border-border p-6 space-y-4">
        <div className="flex items-center gap-3 mb-2">
          <div className="h-10 w-10 rounded-xl bg-lavender flex items-center justify-center">
            <Globe className="h-5 w-5 text-lavender-foreground" />
          </div>
          <h3 className="font-bold text-foreground">{t("language")} Preferences</h3>
        </div>
        <div className="flex items-center justify-between py-2">
          <div>
            <p className="text-sm font-medium text-foreground">Interface Language</p>
            <p className="text-xs text-muted-foreground">Select your preferred language for the admin panel</p>
          </div>
          <LanguageSelector />
        </div>
      </div>

      {/* Notifications */}
      <div className="bg-card rounded-2xl shadow-card border border-border p-6 space-y-4">
        <div className="flex items-center gap-3 mb-2">
          <div className="h-10 w-10 rounded-xl bg-sky flex items-center justify-center">
            <Sliders className="h-5 w-5 text-sky-foreground" />
          </div>
          <h3 className="font-bold text-foreground">Notification Preferences</h3>
        </div>
        <div className="space-y-4">
          <div className="flex items-center justify-between py-2">
            <div>
              <p className="text-sm font-medium text-foreground">Email Alerts</p>
              <p className="text-xs text-muted-foreground">Receive important system notifications via email</p>
            </div>
            <Switch 
              checked={notifications.emailAlerts}
              onCheckedChange={(checked) => setNotifications({ ...notifications, emailAlerts: checked })}
            />
          </div>
          <div className="flex items-center justify-between py-2 border-t border-border">
            <div>
              <p className="text-sm font-medium text-foreground">Weekly Reports</p>
              <p className="text-xs text-muted-foreground">Get weekly summary reports of activity</p>
            </div>
            <Switch 
              checked={notifications.weeklyReports}
              onCheckedChange={(checked) => setNotifications({ ...notifications, weeklyReports: checked })}
            />
          </div>
          <div className="flex items-center justify-between py-2 border-t border-border">
            <div>
              <p className="text-sm font-medium text-foreground">New Child Alerts</p>
              <p className="text-xs text-muted-foreground">Get notified when new children join</p>
            </div>
            <Switch 
              checked={notifications.newChildAlerts}
              onCheckedChange={(checked) => setNotifications({ ...notifications, newChildAlerts: checked })}
            />
          </div>
        </div>
        <Button size="sm" onClick={handleSaveNotifications} className="gap-1.5">
          <Save className="h-4 w-4" /> Save Preferences
        </Button>
      </div>

      {/* System */}
      <div className="bg-card rounded-2xl shadow-card border border-border p-6 space-y-4">
        <div className="flex items-center gap-3 mb-2">
          <div className="h-10 w-10 rounded-xl bg-mint flex items-center justify-center">
            <Sliders className="h-5 w-5 text-mint-foreground" />
          </div>
          <h3 className="font-bold text-foreground">System Configuration</h3>
        </div>
        <p className="text-sm text-muted-foreground">These settings are read-only and managed by the system.</p>
        <div className="space-y-3">
          {[
            { label: "Max Session Duration", value: "10 minutes" },
            { label: "OTP Expiry", value: "5 minutes" },
            { label: "Supported Age Range", value: "6 months – 3 years" },
            { label: "App Version", value: "2.1.0" },
            { label: "Last Updated", value: "Feb 9, 2026" },
          ].map((config, i) => (
            <div key={i} className="flex items-center justify-between py-2 border-b border-border last:border-0">
              <span className="text-sm text-foreground font-medium">{config.label}</span>
              <span className="text-sm text-muted-foreground">{config.value}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}