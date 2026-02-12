import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { AuthLayout } from "@/components/AuthLayout";
import { useAuth } from "@/contexts/AuthContext";
import { useI18n } from "@/contexts/I18nContext";
import { Eye, EyeOff, Mail, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { loginApi } from "../utils/api";

export default function LoginPage() {
  const { t } = useI18n();
  const { login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Clear previous error
    setError("");
    
    // Validate email
    if (!email.trim()) {
      setError(t("emailRequired") || "Email is required");
      return;
    }
    
    if (!validateEmail(email)) {
      setError(t("invalidEmail") || "Please enter a valid email address");
      return;
    }
    
    // Validate password
    if (!password) {
      setError(t("passwordRequired") || "Password is required");
      return;
    }
    
    setIsLoading(true);
    
    try {
      // loginApi directly returns the response data, not axios response object
      const response = await loginApi(email, password);
      
        console.log("response",response.data,response)
      if (response && response.data) {
        const { token, admin } = response.data;
        console.log("token",response.data.token)
        // Store authentication data
        localStorage.setItem("login_email", email);
        localStorage.setItem("token", token);
        localStorage.setItem("user_email", email);
        localStorage.setItem("isAuthenticated", "true");
        
        login(token, admin);
        
        // Navigate to dashboard or home
        navigate("/");
      } else {
        setError(response?.message || t("invalidCredentials") || "Invalid email or password");
      }
    } catch (err) {
      console.error("Login error:", err);
      
      // Handle error based on what the API returns
      if (err.message) {
        setError(err.message);
      } else if (typeof err === 'string') {
        setError(err);
      } else {
        setError(t("loginFailed") || "Login failed. Please try again");
      }
    } finally {
      setIsLoading(false);
    }
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
              disabled={isLoading}
              autoComplete="email"
              required
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
              disabled={isLoading}
              autoComplete="current-password"
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              disabled={isLoading}
            >
              {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>
        </div>

        {error && (
          <div className="text-sm text-destructive bg-peach px-3 py-2 rounded-lg">
            {error}
          </div>
        )}

        <Button 
          type="submit" 
          className="w-full h-11 font-semibold"
          disabled={isLoading}
        >
          {isLoading ? (
            <span className="flex items-center gap-2">
              <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
              {t("loggingIn") || "Logging in..."}
            </span>
          ) : (
            t("login")
          )}
        </Button>

        <div className="text-center">
          <button
            type="button"
            onClick={() => navigate("/forgot-password")}
            className="text-sm text-primary hover:underline font-medium"
            disabled={isLoading}
          >
            {t("forgotPassword")}
          </button>
        </div>
      </form>
    </AuthLayout>
  );
}