import { useI18n } from "@/contexts/I18nContext";
import { LanguageSelector } from "@/components/LanguageSelector";
import { User, Globe, Sliders } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function SettingsPage() {
  const { t } = useI18n();
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
            <Input defaultValue="Admin User" />
          </div>
          <div className="space-y-2">
            <Label>{t("email")}</Label>
            <Input defaultValue="admin@speechbuddy.app" />
          </div>
        </div>
        <Button size="sm">{t("save")}</Button>
      </div>

      {/* Language */}
      <div className="bg-card rounded-2xl shadow-card border border-border p-6 space-y-4">
        <div className="flex items-center gap-3 mb-2">
          <div className="h-10 w-10 rounded-xl bg-lavender flex items-center justify-center">
            <Globe className="h-5 w-5 text-lavender-foreground" />
          </div>
          <h3 className="font-bold text-foreground">{t("language")} Preferences</h3>
        </div>
        <LanguageSelector />
      </div>

      {/* System */}
      <div className="bg-card rounded-2xl shadow-card border border-border p-6 space-y-4">
        <div className="flex items-center gap-3 mb-2">
          <div className="h-10 w-10 rounded-xl bg-mint flex items-center justify-center">
            <Sliders className="h-5 w-5 text-mint-foreground" />
          </div>
          <h3 className="font-bold text-foreground">System Configuration</h3>
        </div>
        <div className="space-y-3">
          {[
            { label: "Max Session Duration", value: "10 minutes" },
            { label: "OTP Expiry", value: "5 minutes" },
            { label: "Supported Age Range", value: "6 months – 3 years" },
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
