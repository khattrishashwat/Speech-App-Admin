import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { AuthLayout } from "@/components/AuthLayout";
import { useI18n } from "@/contexts/I18nContext";
import { Mail, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function ForgotPasswordPage() {
  const { t } = useI18n();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim()) navigate("/otp-verification", { state: { email } });
  };

  return (
    <AuthLayout>
      <div className="text-center mb-6">
        <h2 className="text-xl font-bold text-foreground">{t("forgotPassword")}</h2>
        <p className="text-sm text-muted-foreground mt-1">{t("forgotPasswordDesc")}</p>
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
              onChange={(e) => setEmail(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        <Button type="submit" className="w-full h-11 font-semibold">
          {t("sendOtp")}
        </Button>

        <div className="text-center">
          <button
            type="button"
            onClick={() => navigate("/login")}
            className="text-sm text-primary hover:underline font-medium inline-flex items-center gap-1"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            {t("backToLogin")}
          </button>
        </div>
      </form>
    </AuthLayout>
  );
}
