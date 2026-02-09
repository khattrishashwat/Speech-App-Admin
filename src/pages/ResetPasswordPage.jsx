import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { AuthLayout } from "@/components/AuthLayout";
import { useI18n } from "@/contexts/I18nContext";
import { Eye, EyeOff, Lock, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

function getStrength(pw) {
  let s = 0;
  if (pw.length >= 8) s++;
  if (/[A-Z]/.test(pw)) s++;
  if (/[0-9]/.test(pw)) s++;
  if (/[^A-Za-z0-9]/.test(pw)) s++;
  return s;
}

const strengthColors = ["bg-destructive", "bg-peach-foreground", "bg-warm-foreground", "bg-secondary-foreground"];
const strengthLabels = {
  en: ["Weak", "Fair", "Good", "Strong"],
  fr: ["Faible", "Moyen", "Bon", "Fort"],
};

export default function ResetPasswordPage() {
  const { t, lang } = useI18n();
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [success, setSuccess] = useState(false);

  const strength = getStrength(password);
  const match = password && confirm && password === confirm;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (match && strength >= 2) {
      setSuccess(true);
      setTimeout(() => navigate("/login"), 2000);
    }
  };

  if (success) {
    return (
      <AuthLayout>
        <div className="text-center py-8 animate-fade-in">
          <div className="h-16 w-16 rounded-full bg-mint flex items-center justify-center mx-auto mb-4">
            <CheckCircle2 className="h-8 w-8 text-mint-foreground" />
          </div>
          <h2 className="text-xl font-bold text-foreground">{t("resetSuccess")}</h2>
          <p className="text-sm text-muted-foreground mt-2">{t("redirecting")}</p>
        </div>
      </AuthLayout>
    );
  }

  return (
    <AuthLayout>
      <div className="text-center mb-6">
        <h2 className="text-xl font-bold text-foreground">{t("resetTitle")}</h2>
        <p className="text-sm text-muted-foreground mt-1">{t("resetDesc")}</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="newPw">{t("newPassword")}</Label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              id="newPw"
              type={showPw ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="pl-10 pr-10"
            />
            <button type="button" onClick={() => setShowPw(!showPw)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground">
              {showPw ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>
          {password && (
            <div className="space-y-1.5">
              <div className="flex gap-1">
                {[0, 1, 2, 3].map((i) => (
                  <div key={i} className={`h-1.5 flex-1 rounded-full transition-all ${i < strength ? strengthColors[strength - 1] : "bg-muted"}`} />
                ))}
              </div>
              <p className="text-xs text-muted-foreground">
                {t("passwordStrength")}: {(strengthLabels[lang] || strengthLabels.en)[strength - 1] || (strengthLabels[lang] || strengthLabels.en)[0]}
              </p>
            </div>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="confirmPw">{t("confirmPassword")}</Label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              id="confirmPw"
              type={showConfirm ? "text" : "password"}
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              className="pl-10 pr-10"
            />
            <button type="button" onClick={() => setShowConfirm(!showConfirm)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground">
              {showConfirm ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>
          {confirm && (
            <p className={`text-xs ${match ? "text-secondary-foreground" : "text-destructive"}`}>
              {match ? t("passwordsMatch") : t("passwordsDontMatch")}
            </p>
          )}
        </div>

        <Button type="submit" className="w-full h-11 font-semibold" disabled={!match || strength < 2}>
          {t("resetPassword")}
        </Button>
      </form>
    </AuthLayout>
  );
}