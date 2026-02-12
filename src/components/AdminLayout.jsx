import { useNavigate, useLocation } from "react-router-dom";
import { useI18n } from "@/contexts/I18nContext";
import { useAuth } from "@/contexts/AuthContext";
import { LanguageSelector } from "@/components/LanguageSelector";
import {
  LayoutDashboard,
  BookOpen,
  MessageSquare,
  Users,
  Clock,
  BarChart3,
  FileText,
  FileEdit,
  Settings,
  LogOut,
  Menu,
  X,
  LifeBuoy,
  UserCog,
  FolderTree,
} from "lucide-react";
import { useState } from "react";

const menuItems = [
  { key: "dashboard", icon: LayoutDashboard, path: "/" },
  { key: "category", icon: FolderTree, path: "/category" },
  { key: "episodes", icon: BookOpen, path: "/episodes" },
  { key: "vocabulary", icon: MessageSquare, path: "/vocabulary" },
  { key: "parent", icon: UserCog, path: "/parent" },
  { key: "children", icon: Users, path: "/children" },
  { key: "sessions", icon: Clock, path: "/sessions" },
  { key: "errorAnalysis", icon: BarChart3, path: "/error-analysis" },
  { key: "reports", icon: FileText, path: "/reports" },
  { key: "content", icon: FileEdit, path: "/content" },
  { key: "support", icon: LifeBuoy, path: "/support" },
  { key: "settings", icon: Settings, path: "/settings" },
];

export function AdminLayout({ children }) {
  const { t } = useI18n();
  const { logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const currentKey =
    menuItems.find((m) => m.path === location.pathname)?.key || "dashboard";

  return (
    <div className="min-h-screen flex w-full bg-background">
      {/* Sidebar */}
      <aside
        className={`fixed lg:relative z-30 bg-card border-r border-border flex flex-col transition-all duration-300 ${
          sidebarOpen ? "w-64" : "w-0 lg:w-16"
        } overflow-hidden`}
      >
        {/* Logo */}
        <div className="h-16 flex items-center gap-3 px-4 border-b border-border shrink-0">
          <div className="h-12 w-12 flex items-center justify-center">
            <img src="/image.png" alt="icon" />
          </div>
          {sidebarOpen && (
            <span className="font-bold text-lg text-foreground whitespace-nowrap">
              Speech App
            </span>
          )}
        </div>

        {/* Nav items */}
        <nav className="flex-1 py-4 px-2 space-y-1 overflow-y-auto">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const active = location.pathname === item.path;
            return (
              <button
                key={item.key}
                onClick={() => navigate(item.path)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                  active
                    ? "bg-primary text-primary-foreground shadow-soft"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                } ${!sidebarOpen ? "justify-center" : ""}`}
                title={t(item.key)}
              >
                <Icon className="h-5 w-5 shrink-0" />
                {sidebarOpen && (
                  <span className="whitespace-nowrap">{t(item.key)}</span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Logout */}
        <div className="p-2 border-t border-border">
          <button
            onClick={() => {
              logout();
              navigate("/login");
            }}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-muted-foreground hover:bg-peach hover:text-peach-foreground transition-all ${
              !sidebarOpen ? "justify-center" : ""
            }`}
          >
            <LogOut className="h-5 w-5 shrink-0" />
            {sidebarOpen && <span>{t("logout")}</span>}
          </button>
        </div>
      </aside>

      {/* Overlay for mobile */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-foreground/20 z-20 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Main */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Header */}
        <header className="h-16 bg-card border-b border-border flex items-center justify-between px-4 lg:px-6 shrink-0">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="p-2 rounded-lg hover:bg-muted text-muted-foreground transition-colors"
            >
              {sidebarOpen ? (
                <X className="h-5 w-5" />
              ) : (
                <Menu className="h-5 w-5" />
              )}
            </button>
            <h1 className="text-lg font-bold text-foreground capitalize">
              {t(currentKey)}
            </h1>
          </div>
          <div className="flex items-center gap-4">
            <LanguageSelector />
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 p-4 lg:p-6 overflow-y-auto">
          <div className="animate-fade-in">{children}</div>
        </main>
      </div>
    </div>
  );
}