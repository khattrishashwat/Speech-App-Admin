import { useState } from "react";
import { useI18n } from "@/contexts/I18nContext";
import { Eye, Save, FileText, Globe } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { toast } from "sonner";

interface ContentItem {
  key: string;
  label: string;
  updated: string;
  content: {
    en: string;
    fr: string;
  };
  isDraft: boolean;
}

const initialContentPages: ContentItem[] = [
  { 
    key: "terms", 
    label: "Terms & Conditions", 
    updated: "Feb 5, 2026",
    content: {
      en: "# Terms & Conditions\n\nWelcome to SpeechBuddy. By using our service, you agree to these terms.\n\n## 1. Acceptance of Terms\n\nBy accessing or using SpeechBuddy, you agree to be bound by these Terms & Conditions.\n\n## 2. Description of Service\n\nSpeechBuddy provides speech and language learning content for children aged 6 months to 3 years.\n\n## 3. Privacy\n\nYour privacy is important to us. Please review our Privacy Policy for details on how we collect and use your information.",
      fr: "# Conditions d'utilisation\n\nBienvenue sur SpeechBuddy. En utilisant notre service, vous acceptez ces conditions.\n\n## 1. Acceptation des conditions\n\nEn accédant ou en utilisant SpeechBuddy, vous acceptez d'être lié par ces conditions.\n\n## 2. Description du service\n\nSpeechBuddy fournit du contenu d'apprentissage de la parole et du langage pour les enfants de 6 mois à 3 ans."
    },
    isDraft: false
  },
  { 
    key: "privacy", 
    label: "Privacy Policy", 
    updated: "Jan 28, 2026",
    content: {
      en: "# Privacy Policy\n\nThis Privacy Policy describes how SpeechBuddy collects, uses, and protects your information.\n\n## Information We Collect\n\n- Account information (email, name)\n- Child profile information (name, age)\n- Usage data and session recordings\n\n## How We Use Your Information\n\nWe use your information to:\n- Provide personalized learning experiences\n- Improve our services\n- Communicate with you about your account",
      fr: "# Politique de confidentialité\n\nCette politique de confidentialité décrit comment SpeechBuddy collecte, utilise et protège vos informations.\n\n## Informations que nous collectons\n\n- Informations de compte (email, nom)\n- Informations du profil enfant (nom, âge)\n- Données d'utilisation et enregistrements de session"
    },
    isDraft: false
  },
  { 
    key: "help", 
    label: "Help", 
    updated: "Feb 1, 2026",
    content: {
      en: "# Help Center\n\n## Getting Started\n\n1. Create an account\n2. Add your child's profile\n3. Start with age-appropriate episodes\n\n## Troubleshooting\n\n### Audio not playing?\n- Check your device volume\n- Ensure microphone permissions are enabled\n\n### Session not saving?\n- Check your internet connection\n- Try refreshing the page",
      fr: "# Centre d'aide\n\n## Pour commencer\n\n1. Créez un compte\n2. Ajoutez le profil de votre enfant\n3. Commencez avec des épisodes adaptés à l'âge"
    },
    isDraft: true
  },
  { 
    key: "faq", 
    label: "FAQ", 
    updated: "Jan 15, 2026",
    content: {
      en: "# Frequently Asked Questions\n\n## What age is SpeechBuddy for?\n\nSpeechBuddy is designed for children aged 6 months to 3 years.\n\n## How does speech pattern detection work?\n\nOur system listens to your child's speech and identifies common developmental patterns, helping you understand their language development.\n\n## Is my child's data secure?\n\nYes! We use industry-standard encryption and never share your data with third parties.",
      fr: "# Questions fréquemment posées\n\n## Pour quel âge est SpeechBuddy?\n\nSpeechBuddy est conçu pour les enfants de 6 mois à 3 ans."
    },
    isDraft: false
  },
];

export default function ContentPage() {
  const { t } = useI18n();
  const [contentPages, setContentPages] = useState(initialContentPages);
  const [activeTab, setActiveTab] = useState("terms");
  const [contentLanguage, setContentLanguage] = useState<"en" | "fr">("en");
  const [showPreview, setShowPreview] = useState(false);
  const [previewContent, setPreviewContent] = useState("");

  const currentContent = contentPages.find(p => p.key === activeTab);

  const handleContentChange = (value: string) => {
    setContentPages(pages => 
      pages.map(p => 
        p.key === activeTab 
          ? { ...p, content: { ...p.content, [contentLanguage]: value }, isDraft: true }
          : p
      )
    );
  };

  const handleSaveDraft = () => {
    toast.success("Draft saved successfully!");
  };

  const handlePublish = () => {
    setContentPages(pages =>
      pages.map(p =>
        p.key === activeTab
          ? { ...p, isDraft: false, updated: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) }
          : p
      )
    );
    toast.success("Content published!");
  };

  const handlePreview = () => {
    if (currentContent) {
      setPreviewContent(currentContent.content[contentLanguage]);
      setShowPreview(true);
    }
  };

  // Simple markdown to HTML conversion for preview
  const renderMarkdown = (text: string) => {
    return text
      .replace(/^### (.*$)/gim, '<h3 class="text-lg font-semibold mt-4 mb-2">$1</h3>')
      .replace(/^## (.*$)/gim, '<h2 class="text-xl font-bold mt-6 mb-3">$1</h2>')
      .replace(/^# (.*$)/gim, '<h1 class="text-2xl font-bold mb-4">$1</h1>')
      .replace(/^\- (.*$)/gim, '<li class="ml-4">$1</li>')
      .replace(/^\d+\. (.*$)/gim, '<li class="ml-4 list-decimal">$1</li>')
      .replace(/\n/gim, '<br />');
  };

  return (
    <>
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="bg-muted rounded-xl p-1">
          {contentPages.map((p) => (
            <TabsTrigger key={p.key} value={p.key} className="rounded-lg text-sm font-medium relative">
              {p.label}
              {p.isDraft && (
                <span className="absolute -top-1 -right-1 h-2 w-2 bg-warm rounded-full" />
              )}
            </TabsTrigger>
          ))}
        </TabsList>

        {contentPages.map((p) => (
          <TabsContent key={p.key} value={p.key}>
            <div className="bg-card rounded-2xl shadow-card border border-border p-6 space-y-4">
              <div className="flex items-center justify-between flex-wrap gap-4">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-xl bg-lavender flex items-center justify-center">
                    <FileText className="h-5 w-5 text-lavender-foreground" />
                  </div>
                  <div>
                    <h3 className="font-bold text-foreground">{p.label}</h3>
                    <p className="text-xs text-muted-foreground">
                      Last updated: {p.updated}
                      {p.isDraft && <span className="ml-2 text-warm-foreground">(Unsaved changes)</span>}
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center gap-2 flex-wrap">
                  {/* Language Selector */}
                  <div className="flex items-center gap-2 bg-muted rounded-lg p-1">
                    <button
                      onClick={() => setContentLanguage("en")}
                      className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                        contentLanguage === "en" 
                          ? "bg-background text-foreground shadow-sm" 
                          : "text-muted-foreground hover:text-foreground"
                      }`}
                    >
                      <span className="flex items-center gap-1.5">
                        <Globe className="h-4 w-4" /> EN
                      </span>
                    </button>
                    <button
                      onClick={() => setContentLanguage("fr")}
                      className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                        contentLanguage === "fr" 
                          ? "bg-background text-foreground shadow-sm" 
                          : "text-muted-foreground hover:text-foreground"
                      }`}
                    >
                      <span className="flex items-center gap-1.5">
                        <Globe className="h-4 w-4" /> FR
                      </span>
                    </button>
                  </div>
                  
                  <Button variant="outline" size="sm" className="gap-1.5" onClick={handlePreview}>
                    <Eye className="h-4 w-4" /> Preview
                  </Button>
                  <Button variant="outline" size="sm" className="gap-1.5" onClick={handleSaveDraft}>
                    <Save className="h-4 w-4" /> Save Draft
                  </Button>
                  <Button size="sm" className="gap-1.5" onClick={handlePublish}>
                    <Save className="h-4 w-4" /> Publish
                  </Button>
                </div>
              </div>

              {/* Editor Toolbar */}
              <div className="flex items-center gap-1 p-2 bg-muted rounded-lg">
                <button className="px-2 py-1 text-sm font-bold hover:bg-background rounded">B</button>
                <button className="px-2 py-1 text-sm italic hover:bg-background rounded">I</button>
                <button className="px-2 py-1 text-sm underline hover:bg-background rounded">U</button>
                <span className="w-px h-5 bg-border mx-2" />
                <button className="px-2 py-1 text-sm hover:bg-background rounded">H1</button>
                <button className="px-2 py-1 text-sm hover:bg-background rounded">H2</button>
                <button className="px-2 py-1 text-sm hover:bg-background rounded">H3</button>
                <span className="w-px h-5 bg-border mx-2" />
                <button className="px-2 py-1 text-sm hover:bg-background rounded">• List</button>
                <button className="px-2 py-1 text-sm hover:bg-background rounded">1. List</button>
                <button className="px-2 py-1 text-sm hover:bg-background rounded">Link</button>
              </div>

              <Textarea
                rows={16}
                value={p.content[contentLanguage]}
                onChange={(e) => handleContentChange(e.target.value)}
                placeholder={`Enter ${p.label} content...`}
                className="font-mono text-sm resize-none"
              />
            </div>
          </TabsContent>
        ))}
      </Tabs>

      {/* Preview Dialog */}
      <Dialog open={showPreview} onOpenChange={setShowPreview}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Preview: {currentContent?.label} ({contentLanguage.toUpperCase()})</DialogTitle>
          </DialogHeader>
          <div 
            className="prose prose-sm max-w-none py-4"
            dangerouslySetInnerHTML={{ __html: renderMarkdown(previewContent) }}
          />
        </DialogContent>
      </Dialog>
    </>
  );
}
