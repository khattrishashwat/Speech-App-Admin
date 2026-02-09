import { LanguageSelector } from "@/components/LanguageSelector";
import { BookOpen } from "lucide-react";

export function AuthLayout({ children }) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4 relative">
      {/* Decorative background shapes */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-32 -right-32 w-96 h-96 rounded-full bg-sky opacity-40" />
        <div className="absolute -bottom-24 -left-24 w-80 h-80 rounded-full bg-mint opacity-30" />
        <div className="absolute top-1/3 left-10 w-48 h-48 rounded-full bg-lavender opacity-20" />
        <div className="absolute bottom-1/4 right-20 w-36 h-36 rounded-full bg-warm opacity-25" />
      </div>

      <div className="absolute top-4 right-4 z-10">
        <LanguageSelector />
      </div>

      <div className="w-full max-w-md z-10 animate-fade-in">
        <div className="flex items-center justify-center gap-3 mb-8">
          <div className="h-12 w-12 flex items-center justify-center">
            <img src="/image.png" alt="icon" />
          </div>

          <div>
            <h1 className="text-2xl font-bold text-foreground">Speech App</h1>
            <p className="text-xs text-muted-foreground font-medium">Admin Panel</p>
          </div>
        </div>
        <div className="bg-card rounded-2xl shadow-card p-8 border border-border">
          {children}
        </div>
      </div>
    </div>
  );
}