import { createContext, useContext, useState } from "react";

const translations = {
  en: {
    login: "Login",
    email: "Email",
    password: "Password",
    forgotPassword: "Forgot password?",
    sendOtp: "Send OTP",
    backToLogin: "Back to Login",
    verify: "Verify",
    resendOtp: "Resend OTP",
    resetPassword: "Reset Password",
    newPassword: "New Password",
    confirmPassword: "Confirm Password",
    save: "Save",
    dashboard: "Dashboard",
    episodes: "Episodes",
    vocabulary: "Vocabulary",
    children: "Children",
    sessions: "Sessions",
    errorAnalysis: "Error Analysis",
    reports: "Reports",
    content: "Content",
    settings: "Settings",
    totalChildren: "Total Children",
    totalSessions: "Total Sessions",
    activeEpisodes: "Active Episodes",
    commonPattern: "Most Common Pattern",
    avgDuration: "Avg Session Duration",
    recentSessions: "Recent Sessions",
    insights: "Insights",
    speechPatterns: "Speech Pattern Distribution",
    patternsByAge: "Patterns by Age Group",
    episodeUsage: "Episode Usage",
    childName: "Child Name",
    episodeName: "Episode Name",
    duration: "Duration",
    detectedPattern: "Detected Pattern",
    action: "Action",
    view: "View",
    search: "Search",
    language: "Language",
    logout: "Logout",
    welcomeBack: "Welcome back",
    signInContinue: "Sign in to continue managing",
    enterEmail: "Enter your email",
    enterPassword: "Enter your password",
    forgotPasswordDesc: "Enter your email to receive a verification code",
    otpTitle: "Verify Your Identity",
    otpDesc: "Enter the code sent to your email",
    resetTitle: "Create New Password",
    resetDesc: "Choose a strong password for your account",
    passwordStrength: "Password strength",
    passwordsMatch: "Passwords match",
    passwordsDontMatch: "Passwords don't match",
    resetSuccess: "Password updated successfully!",
    redirecting: "Redirecting to login...",
    weak: "Weak",
    fair: "Fair",
    good: "Good",
    strong: "Strong",
  },
  fr: {
    login: "Connexion",
    email: "E-mail",
    password: "Mot de passe",
    forgotPassword: "Mot de passe oublié ?",
    sendOtp: "Envoyer le code",
    backToLogin: "Retour à la connexion",
    verify: "Vérifier",
    resendOtp: "Renvoyer le code",
    resetPassword: "Réinitialiser",
    newPassword: "Nouveau mot de passe",
    confirmPassword: "Confirmer le mot de passe",
    save: "Enregistrer",
    dashboard: "Tableau de bord",
    episodes: "Épisodes",
    vocabulary: "Vocabulaire",
    children: "Enfants",
    sessions: "Sessions",
    errorAnalysis: "Analyse des erreurs",
    reports: "Rapports",
    content: "Contenu",
    settings: "Paramètres",
    totalChildren: "Total Enfants",
    totalSessions: "Total Sessions",
    activeEpisodes: "Épisodes Actifs",
    commonPattern: "Modèle le Plus Courant",
    avgDuration: "Durée Moyenne",
    recentSessions: "Sessions Récentes",
    insights: "Aperçus",
    speechPatterns: "Distribution des Modèles",
    patternsByAge: "Modèles par Âge",
    episodeUsage: "Utilisation des Épisodes",
    childName: "Nom de l'Enfant",
    episodeName: "Nom de l'Épisode",
    duration: "Durée",
    detectedPattern: "Modèle Détecté",
    action: "Action",
    view: "Voir",
    search: "Rechercher",
    language: "Langue",
    logout: "Déconnexion",
    welcomeBack: "Bon retour",
    signInContinue: "Connectez-vous pour continuer",
    enterEmail: "Entrez votre e-mail",
    enterPassword: "Entrez votre mot de passe",
    forgotPasswordDesc: "Entrez votre e-mail pour recevoir un code",
    otpTitle: "Vérifiez votre identité",
    otpDesc: "Entrez le code envoyé à votre e-mail",
    resetTitle: "Créer un nouveau mot de passe",
    resetDesc: "Choisissez un mot de passe fort",
    passwordStrength: "Force du mot de passe",
    passwordsMatch: "Les mots de passe correspondent",
    passwordsDontMatch: "Les mots de passe ne correspondent pas",
    resetSuccess: "Mot de passe mis à jour !",
    redirecting: "Redirection vers la connexion...",
    weak: "Faible",
    fair: "Moyen",
    good: "Bon",
    strong: "Fort",
  },
};

const I18nContext = createContext(null);

export const languages = [
  { code: "en", label: "English" },
  { code: "fr", label: "Français" },
];

export function I18nProvider({ children }) {
  const [lang, setLang] = useState("en");

  const t = (key) => translations[lang]?.[key] ?? translations.en?.[key] ?? key;

  return (
    <I18nContext.Provider value={{ lang, setLang, t, languages }}>
      {children}
    </I18nContext.Provider>
  );
}

export function useI18n() {
  const ctx = useContext(I18nContext);
  if (!ctx) throw new Error("useI18n must be used within I18nProvider");
  return ctx;
}