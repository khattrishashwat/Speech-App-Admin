import { useI18n } from "@/contexts/I18nContext";
import { FileEdit, Eye, Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";

const contentPages = [
  { key: "terms", label: "Terms & Conditions", updated: "Feb 5, 2026" },
  { key: "privacy", label: "Privacy Policy", updated: "Jan 28, 2026" },
  { key: "help", label: "Help", updated: "Feb 1, 2026" },
  { key: "faq", label: "FAQ", updated: "Jan 15, 2026" },
];

export default function ContentPage() {
  const { t } = useI18n();
  return (
    <Tabs defaultValue="terms" className="space-y-4">
      <TabsList className="bg-muted rounded-xl p-1">
        {contentPages.map((p) => (
          <TabsTrigger key={p.key} value={p.key} className="rounded-lg text-sm font-medium">
            {p.label}
          </TabsTrigger>
        ))}
      </TabsList>
      {contentPages.map((p) => (
        <TabsContent key={p.key} value={p.key}>
          <div className="bg-card rounded-2xl shadow-card border border-border p-6 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-bold text-foreground">{p.label}</h3>
                <p className="text-xs text-muted-foreground">Last updated: {p.updated}</p>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" className="gap-1.5"><Eye className="h-4 w-4" /> Preview</Button>
                <Button size="sm" className="gap-1.5"><Save className="h-4 w-4" /> Publish</Button>
              </div>
            </div>
            <Textarea
              rows={12}
              placeholder={`Enter ${p.label} content...`}
              className="font-body text-sm"
            />
          </div>
        </TabsContent>
      ))}
    </Tabs>
  );
}
