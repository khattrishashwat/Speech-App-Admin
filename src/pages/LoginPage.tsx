import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { AuthLayout } from "@/components/AuthLayout";
import { useAuth } from "@/contexts/AuthContext";
import { useI18n } from "@/contexts/I18nContext";
import { Eye, EyeOff, Mail, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function LoginPage() {
  const { t } = useI18n();
  const { login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) { setError("Please enter your email"); return; }
    if (!password.trim()) { setError("Please enter your password"); return; }
    const success = login(email, password);
    if (success) navigate("/");
    else setError("Unable to sign in. Please check your credentials.");
  };

  return (
    <AuthLayout>
      <div className="text-center mb-6">
        <h2 className="text-xl font-bold text-foreground">{t("welcomeBack")}</h2>
        <p className="text-sm text-muted-foreground mt-1">{t("signInContinue")}</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="email">{t("email")}</Label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              id="email"
              type="email"
              placeholder={t("enterEmail")}
              value={email}
              onChange={(e) => { setEmail(e.target.value); setError(""); }}
              className="pl-10"
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="password">{t("password")}</Label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              id="password"
              type={showPassword ? "text" : "password"}
              placeholder={t("enterPassword")}
              value={password}
              onChange={(e) => { setPassword(e.target.value); setError(""); }}
              className="pl-10 pr-10"
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

        {error && (
          <p className="text-sm text-destructive bg-peach px-3 py-2 rounded-lg">{error}</p>
        )}

        <Button type="submit" className="w-full h-11 font-semibold">
          {t("login")}
        </Button>

        <div className="text-center">
          <button
            type="button"
            onClick={() => navigate("/forgot-password")}
            className="text-sm text-primary hover:underline font-medium"
          >
            {t("forgotPassword")}
          </button>
        </div>
      </form>
    </AuthLayout>
  );
}
