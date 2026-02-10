import React, { createContext, useContext, useState, useCallback } from "react";

const labels = {
  en: "English",
  fr: "Français",
  es: "Español",
  ht: "Kreyòl",
};

const translations = {
  en: {
    dashboard: "Dashboard",
    episodes: "Episodes",
    vocabulary: "Vocabulary & Targets",
    tasksLibrary: "Tasks Library",
    children: "Children",
    sessions: "Sessions",
    assessmentInsights: "Assessment Insights",
    content: "Content (CMS)",
    settings: "Settings",
    login: "Login",
    forgotPassword: "Forg Password",
    resetPassword: "Reset Password",
    email: "Email",
    password: "Password",
    submit: "Submit",
    save: "Save",
    cancel: "Cancel",
    add: "Add",
    edit: "Edit",
    delete: "Delete",
    view: "View",
    search: "Search",
    totalChildren: "Total Children",
    totalSessions: "Total Sessions",
    activeEpisodes: "Active Episodes",
    welcome: "Welcome back",
    logout: "Logout",
    language: "Language",
    sendOtp: "Send OTP",
    verifyOtp: "Verify",
    newPassword: "New Password",
    confirmPassword: "Confirm Password",
    backToLogin: "Back to Login",
    resendOtp: "Resend OTP",
  },
  fr: {
    dashboard: "Tableau de bord",
    episodes: "Épisodes",
    vocabulary: "Vocabulaire & Cibles",
    tasksLibrary: "Bibliothèque de tâches",
    children: "Enfants",
    sessions: "Sessions",
    assessmentInsights: "Aperçus d'évaluation",
    content: "Contenu (CMS)",
    settings: "Paramètres",
    login: "Connexion",
    forgotPassword: "Mot de passe oublié",
    resetPassword: "Réinitialiser",
    email: "E-mail",
    password: "Mot de passe",
    submit: "Soumettre",
    save: "Enregistrer",
    cancel: "Annuler",
    add: "Ajouter",
    edit: "Modifier",
    delete: "Supprimer",
    view: "Voir",
    search: "Rechercher",
    totalChildren: "Total enfants",
    totalSessions: "Total sessions",
    activeEpisodes: "Épisodes actifs",
    welcome: "Bienvenue",
    logout: "Déconnexion",
    language: "Langue",
    sendOtp: "Envoyer OTP",
    verifyOtp: "Vérifier",
    newPassword: "Nouveau mot de passe",
    confirmPassword: "Confirmer le mot de passe",
    backToLogin: "Retour à la connexion",
    resendOtp: "Renvoyer OTP",
  },
  es: {
    dashboard: "Panel",
    episodes: "Episodios",
    vocabulary: "Vocabulario y Objetivos",
    tasksLibrary: "Biblioteca de tareas",
    children: "Niños",
    sessions: "Sesiones",
    assessmentInsights: "Perspectivas de evaluación",
    content: "Contenido (CMS)",
    settings: "Configuración",
    login: "Iniciar sesión",
    forgotPassword: "Olvidé mi contraseña",
    resetPassword: "Restablecer",
    email: "Correo",
    password: "Contraseña",
    submit: "Enviar",
    save: "Guardar",
    cancel: "Cancelar",
    add: "Agregar",
    edit: "Editar",
    delete: "Eliminar",
    view: "Ver",
    search: "Buscar",
    totalChildren: "Total niños",
    totalSessions: "Total sesiones",
    activeEpisodes: "Episodios activos",
    welcome: "Bienvenido",
    logout: "Cerrar sesión",
    language: "Idioma",
    sendOtp: "Enviar OTP",
    verifyOtp: "Verificar",
    newPassword: "Nueva contraseña",
    confirmPassword: "Confirmar contraseña",
    backToLogin: "Volver al inicio",
    resendOtp: "Reenviar OTP",
  },
  ht: {
    dashboard: "Tablo",
    episodes: "Epizòd",
    vocabulary: "Vokabilè & Sib",
    tasksLibrary: "Bibliyotèk Travay",
    children: "Timoun",
    sessions: "Sesyon",
    assessmentInsights: "Apèsi Evalyasyon",
    content: "Kontni (CMS)",
    settings: "Paramèt",
    login: "Konekte",
    forgotPassword: "Bliye modpas",
    resetPassword: "Reyinisyalize",
    email: "Imèl",
    password: "Modpas",
    submit: "Soumèt",
    save: "Sovgade",
    cancel: "Anile",
    add: "Ajoute",
    edit: "Modifye",
    delete: "Efase",
    view: "Wè",
    search: "Chèche",
    totalChildren: "Total timoun",
    totalSessions: "Total sesyon",
    activeEpisodes: "Epizòd aktif",
    welcome: "Byenveni",
    logout: "Dekonekte",
    language: "Lang",
    sendOtp: "Voye OTP",
    verifyOtp: "Verifye",
    newPassword: "Nouvo modpas",
    confirmPassword: "Konfime modpas",
    backToLogin: "Retounen konekte",
    resendOtp: "Revoye OTP",
  },
};

const LanguageContext = createContext(null);

export const LanguageProvider = ({ children }) => {
  const [language, setLang] = useState(() => {
    return localStorage.getItem("speech_admin_lang") || "en";
  });

  const setLanguage = useCallback((l) => {
    setLang(l);
    localStorage.setItem("speech_admin_lang", l);
  }, []);

  const t = useCallback(
    (key) => {
      return translations[language]?.[key] || translations.en[key] || key;
    },
    [language]
  );

  const languagesList = Object.entries(labels).map(([code, label]) => ({
    code,
    label,
  }));

  return (
    <LanguageContext.Provider
      value={{
        language,
        setLanguage,
        t,
        languages: languagesList,
      }}
    >
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error("useLanguage must be inside LanguageProvider");
  return ctx;
};