import { useState, useEffect } from "react";
import { useI18n } from "@/contexts/I18nContext";
import { LanguageSelector } from "@/components/LanguageSelector";
import { User, Globe, Sliders, Save, Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";
import { getProfileApi, updateProfileApi } from "../utils/api";

export default function SettingsPage() {
  const { t } = useI18n();
  const [loading, setLoading] = useState(false);
  const [profile, setProfile] = useState({
    name: "",
    email: "",
  });
  const [passwordData, setPasswordData] = useState({
    newPassword: "",
    confirmPassword: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [notifications, setNotifications] = useState({
    emailAlerts: true,
    weeklyReports: true,
    newChildAlerts: false,
  });

  // Fetch profile data on component mount
  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const response = await getProfileApi();
      if (response.data) {
        setProfile({
          name: response.data.data.name || [],
          email: response.data.data.email || [],
        });
        // If notification preferences are returned from API
        if (response.data.notifications) {
          setNotifications(response.data.notifications);
        }
      }
    } catch (error) {
      console.error("Failed to fetch profile:", error);
      toast.error("Failed to load profile data");
      
    } finally {
      setLoading(false);
    }
  };

  const handleSaveProfile = async () => {
    try {
      setLoading(true);
      
      // Prepare update data
      const updateData = {
        name: profile.name,
        email: profile.email,
      };

      // Add password if provided
      if (passwordData.newPassword) {
        if (passwordData.newPassword !== passwordData.confirmPassword) {
          toast.error("Passwords do not match");
          return;
        }
        if (passwordData.newPassword.length < 6) {
          toast.error("Password must be at least 6 characters");
          return;
        }
        updateData.password = passwordData.newPassword;
      }

      const response = await updateProfileApi(updateData);
      
      if (response.success) {
        toast.success("Profile saved successfully!");
        // Clear password fields after successful save
        setPasswordData({ newPassword: "", confirmPassword: "" });
        // Refresh profile data
        fetchProfile();
      }
    } catch (error) {
      console.error("Failed to save profile:", error);
      toast.error(error.message || "Failed to save profile");
    } finally {
      setLoading(false);
    }
  };

  const handleSaveNotifications = async () => {
    try {
      setLoading(true);
      
      // Update notification preferences
      const response = await updateProfileApi({
        notifications: notifications
      });
      
      if (response.success) {
        toast.success("Notification preferences saved!");
      }
    } catch (error) {
      console.error("Failed to save notifications:", error);
      toast.error(error.message || "Failed to save notification preferences");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Profile Section */}
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
              disabled={loading}
            />
          </div>
          <div className="space-y-2">
            <Label>{t("email")}</Label>
            <Input 
              value={profile.email}
              onChange={(e) => setProfile({ ...profile, email: e.target.value })}
              disabled={loading}
              type="email"
            />
          </div>
        </div>

        {/* New Password Field */}
        <div className="space-y-2">
          <Label>New Password (optional)</Label>
          <div className="relative">
            <Input 
              type={showPassword ? "text" : "password"}
              placeholder="Enter new password..."
              className="pr-10"
              value={passwordData.newPassword}
              onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
              disabled={loading}
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

        {/* Confirm Password Field */}
        {passwordData.newPassword && (
          <div className="space-y-2">
            <Label>Confirm Password</Label>
            <div className="relative">
              <Input 
                type={showConfirmPassword ? "text" : "password"}
                placeholder="Confirm new password..."
                className="pr-10"
                value={passwordData.confirmPassword}
                onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                disabled={loading}
              />
              <button 
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              >
                {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>
        )}

        <Button 
          size="sm" 
          onClick={handleSaveProfile} 
          className="gap-1.5"
          disabled={loading}
        >
          <Save className="h-4 w-4" /> 
          {loading ? "Saving..." : t("save")}
        </Button>
      </div>
      
      {/* Language and Notifications Grid */}
      <div className="grid grid-cols-12 gap-6">
        {/* Language Preferences */}
        <div className="col-span-12 md:col-span-6 bg-card rounded-2xl shadow-card border border-border p-6 space-y-4">
          <div className="flex items-center gap-3 mb-2">
            <div className="h-10 w-10 rounded-xl bg-lavender flex items-center justify-center">
              <Globe className="h-5 w-5 text-lavender-foreground" />
            </div>
            <h3 className="font-bold text-foreground">
              {t("language")} Preferences
            </h3>
          </div>

          <div className="flex items-center justify-between py-2">
            <div>
              <p className="text-sm font-medium text-foreground">
                Interface Language
              </p>
              <p className="text-xs text-muted-foreground">
                Select your preferred language for the admin panel
              </p>
            </div>
            <LanguageSelector />
          </div>
        </div>

        {/* Notification Preferences */}
        <div className="col-span-12 md:col-span-6 bg-card rounded-2xl shadow-card border border-border p-6 space-y-4">
          <div className="flex items-center gap-3 mb-2">
            <div className="h-10 w-10 rounded-xl bg-sky flex items-center justify-center">
              <Sliders className="h-5 w-5 text-sky-foreground" />
            </div>
            <h3 className="font-bold text-foreground">
              Notification Preferences
            </h3>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between py-2">
              <div>
                <p className="text-sm font-medium text-foreground">
                  Email Alerts
                </p>
                <p className="text-xs text-muted-foreground">
                  Receive important system notifications via email
                </p>
              </div>
              <Switch
                checked={notifications.emailAlerts}
                onCheckedChange={(checked) =>
                  setNotifications({ ...notifications, emailAlerts: checked })
                }
                disabled={loading}
              />
            </div>

            <div className="flex items-center justify-between py-2 border-t border-border">
              <div>
                <p className="text-sm font-medium text-foreground">
                  Weekly Reports
                </p>
                <p className="text-xs text-muted-foreground">
                  Get weekly summary reports of activity
                </p>
              </div>
              <Switch
                checked={notifications.weeklyReports}
                onCheckedChange={(checked) =>
                  setNotifications({ ...notifications, weeklyReports: checked })
                }
                disabled={loading}
              />
            </div>

            <div className="flex items-center justify-between py-2 border-t border-border">
              <div>
                <p className="text-sm font-medium text-foreground">
                  New Child Alerts
                </p>
                <p className="text-xs text-muted-foreground">
                  Get notified when new children join
                </p>
              </div>
              <Switch
                checked={notifications.newChildAlerts}
                onCheckedChange={(checked) =>
                  setNotifications({ ...notifications, newChildAlerts: checked })
                }
                disabled={loading}
              />
            </div>
          </div>

          <Button
            size="sm"
            onClick={handleSaveNotifications}
            className="gap-1.5"
            disabled={loading}
          >
            <Save className="h-4 w-4" />
            {loading ? "Saving..." : "Save Preferences"}
          </Button>
        </div>
      </div>
    </div>
  );
}