import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { AuthLayout } from "@/components/AuthLayout";
import { useI18n } from "@/contexts/I18nContext";
import { Button } from "@/components/ui/button";

export default function OtpVerificationPage() {
  const { t } = useI18n();
  const navigate = useNavigate();
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [countdown, setCountdown] = useState(60);
  const inputsRef = useRef([]);

  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown]);

  const handleChange = (index, value) => {
    if (!/^\d*$/.test(value)) return;
    const newOtp = [...otp];
    newOtp[index] = value.slice(-1);
    setOtp(newOtp);
    if (value && index < 5) inputsRef.current[index + 1]?.focus();
  };

  const handleKeyDown = (index, e) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputsRef.current[index - 1]?.focus();
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (otp.every((d) => d)) navigate("/reset-password");
  };

  return (
    <AuthLayout>
      <div className="text-center mb-6">
        <h2 className="text-xl font-bold text-foreground">{t("otpTitle")}</h2>
        <p className="text-sm text-muted-foreground mt-1">{t("otpDesc")}</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="flex justify-center gap-3">
          {otp.map((digit, i) => (
            <input
              key={i}
              ref={(el) => { inputsRef.current[i] = el; }}
              type="text"
              inputMode="numeric"
              maxLength={1}
              value={digit}
              onChange={(e) => handleChange(i, e.target.value)}
              onKeyDown={(e) => handleKeyDown(i, e)}
              className="w-12 h-14 text-center text-xl font-bold rounded-xl border-2 border-border bg-muted focus:border-primary focus:ring-2 focus:ring-ring/20 outline-none transition-all"
            />
          ))}
        </div>

        <div className="text-center text-sm text-muted-foreground">
          {countdown > 0 ? (
            <span>Resend in {countdown}s</span>
          ) : (
            <button
              type="button"
              onClick={() => setCountdown(60)}
              className="text-primary hover:underline font-medium"
            >
              {t("resendOtp")}
            </button>
          )}
        </div>

        <Button type="submit" className="w-full h-11 font-semibold">
          {t("verify")}
        </Button>
      </form>
    </AuthLayout>
  );
}